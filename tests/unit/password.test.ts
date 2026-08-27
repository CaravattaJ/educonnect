import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password", () => {
  it("hashes and verifies a matching password", async () => {
    const hash = await hashPassword("un-mot-de-passe-suffisamment-long");
    await expect(verifyPassword("un-mot-de-passe-suffisamment-long", hash)).resolves.toBe(true);
  });

  it("rejects a non-matching password", async () => {
    const hash = await hashPassword("un-mot-de-passe-suffisamment-long");
    await expect(verifyPassword("autre-mot-de-passe", hash)).resolves.toBe(false);
  });
});
