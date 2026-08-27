import type { Session } from "next-auth";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/permissions/session", () => ({
  requireRole: vi.fn(),
}));

import { generateVerificationToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/client";
import { requireRole } from "@/lib/permissions/session";
import { decideInscription, listPendingInscriptions } from "@/server/admin/inscriptions";
import { registerOrganisateur } from "@/server/organisateur/register";
import { verifyEmail } from "@/server/organisateur/verify-email";

const mockedRequireRole = vi.mocked(requireRole);
const runId = Date.now();

function buildRegistrationFormData(email: string, structureName: string, cityId: string): FormData {
  const formData = new FormData();
  formData.set("email", email);
  formData.set("password", "un-mot-de-passe-suffisamment-long");
  formData.set("structureName", structureName);
  formData.set("structureDescription", "Description de test.");
  formData.set("contactEmail", email);
  formData.set("website", "");
  formData.set("cityId", cityId);
  return formData;
}

describe("E1 — inscription, vérification, validation admin", () => {
  let cityId: string;
  let adminUserId: string;

  beforeAll(async () => {
    const region = await prisma.region.create({
      data: { code: `TEST-E1-R-${runId}`, name: `Région test E1 ${runId}` },
    });
    const department = await prisma.department.create({
      data: { code: `TEST-E1-D-${runId}`, name: `Département test E1 ${runId}`, regionId: region.id },
    });
    const city = await prisma.city.create({
      data: {
        inseeCode: `E1-${runId}`,
        postalCode: "00000",
        name: `Ville test E1 ${runId}`,
        departmentId: department.id,
      },
    });
    cityId = city.id;

    const admin = await prisma.user.create({
      data: {
        email: `admin-${runId}@test.local`,
        role: "ADMIN",
        accountStatus: "ACTIF",
        emailVerifiedAt: new Date(),
      },
    });
    adminUserId = admin.id;

    mockedRequireRole.mockResolvedValue({
      user: { id: adminUserId, role: "ADMIN" },
    } as unknown as Session);
  });

  afterAll(async () => {
    await prisma.adminAction.deleteMany({ where: { adminUserId } });
    await prisma.user.deleteMany({ where: { email: { endsWith: `${runId}@test.local` } } });
    await prisma.city.deleteMany({ where: { id: cityId } });
    await prisma.department.deleteMany({ where: { code: `TEST-E1-D-${runId}` } });
    await prisma.region.deleteMany({ where: { code: `TEST-E1-R-${runId}` } });
  });

  it("creates a pending, unverified organisateur account on registration", async () => {
    const email = `organisateur-${runId}@test.local`;
    const result = await registerOrganisateur(
      buildRegistrationFormData(email, "Association Test", cityId),
    );
    expect(result.success).toBe(true);

    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      include: { structure: true },
    });
    expect(user.role).toBe("ORGANISATEUR");
    expect(user.accountStatus).toBe("EN_ATTENTE");
    expect(user.emailVerifiedAt).toBeNull();
    expect(user.structure?.name).toBe("Association Test");

    const token = await prisma.emailVerificationToken.findFirstOrThrow({
      where: { userId: user.id },
    });
    expect(token.usedAt).toBeNull();
  });

  it("rejects an unknown verification token", async () => {
    await expect(verifyEmail("token-inexistant")).resolves.toBe("invalid");
  });

  it("verifies a valid token exactly once and rejects an expired one", async () => {
    const email = `verif-${runId}@test.local`;
    const user = await prisma.user.create({
      data: {
        email,
        role: "ORGANISATEUR",
        accountStatus: "EN_ATTENTE",
        structure: {
          create: {
            name: "Structure Vérif",
            description: "Description.",
            contactEmail: email,
            cityId,
          },
        },
      },
    });

    const valid = generateVerificationToken();
    await prisma.emailVerificationToken.create({
      data: { userId: user.id, tokenHash: valid.tokenHash, expiresAt: valid.expiresAt },
    });

    await expect(verifyEmail(valid.token)).resolves.toBe("success");
    const verifiedUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(verifiedUser.emailVerifiedAt).not.toBeNull();

    await expect(verifyEmail(valid.token)).resolves.toBe("already-used");

    const expired = generateVerificationToken();
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: expired.tokenHash,
        expiresAt: new Date(Date.now() - 1000),
      },
    });
    await expect(verifyEmail(expired.token)).resolves.toBe("expired");
  });

  it("lets an admin validate a pending inscription and writes an audit entry", async () => {
    const email = `valider-${runId}@test.local`;
    await registerOrganisateur(buildRegistrationFormData(email, "Structure à valider", cityId));
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    const before = await listPendingInscriptions();
    expect(before.some((entry) => entry.user.id === user.id)).toBe(true);

    const decisionForm = new FormData();
    decisionForm.set("userId", user.id);
    decisionForm.set("decision", "VALIDER");
    const result = await decideInscription(decisionForm);
    expect(result.success).toBe(true);

    const updated = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(updated.accountStatus).toBe("ACTIF");

    const action = await prisma.adminAction.findFirstOrThrow({
      where: { targetId: user.id, actionType: "VALIDATION_INSCRIPTION" },
    });
    expect(action.adminUserId).toBe(adminUserId);
  });

  it("lets an admin reject a pending inscription with a mandatory justification", async () => {
    const email = `rejeter-${runId}@test.local`;
    await registerOrganisateur(buildRegistrationFormData(email, "Structure à rejeter", cityId));
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    const decisionForm = new FormData();
    decisionForm.set("userId", user.id);
    decisionForm.set("decision", "REJETER");
    decisionForm.set("justification", "Informations insuffisantes.");
    const result = await decideInscription(decisionForm);
    expect(result.success).toBe(true);

    const updated = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(updated.accountStatus).toBe("REJETE");
    expect(updated.rejectionReason).toBe("Informations insuffisantes.");
  });
});
