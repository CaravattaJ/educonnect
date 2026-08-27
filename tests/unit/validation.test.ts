import { describe, expect, it } from "vitest";

import {
  adminDecisionSchema,
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "@/lib/validation/organisateur";

describe("registerSchema", () => {
  const base = {
    email: "contact@ecole.fr",
    password: "un-mot-de-passe-suffisamment-long",
    structureName: "École des Fleurs",
    structureDescription: "École primaire publique.",
    contactEmail: "contact@ecole.fr",
    website: "",
    cityId: "550e8400-e29b-41d4-a716-446655440000",
  };

  it("accepts a valid payload", () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = registerSchema.safeParse({ ...base, password: "trop-court" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ ...base, email: "pas-un-email" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ email: "a@b.fr", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("rejects when the new password equals the current one", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "un-mot-de-passe-suffisamment-long",
      newPassword: "un-mot-de-passe-suffisamment-long",
    });
    expect(result.success).toBe(false);
  });
});

describe("adminDecisionSchema", () => {
  const userId = "550e8400-e29b-41d4-a716-446655440000";

  it("requires a justification when rejecting", () => {
    const result = adminDecisionSchema.safeParse({ userId, decision: "REJETER", justification: "" });
    expect(result.success).toBe(false);
  });

  it("does not require a justification when validating", () => {
    const result = adminDecisionSchema.safeParse({ userId, decision: "VALIDER", justification: "" });
    expect(result.success).toBe(true);
  });
});
