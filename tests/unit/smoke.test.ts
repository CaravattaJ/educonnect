import { describe, expect, it } from "vitest";

// Test de fumée pour E0 : confirme que l'outillage de test (Vitest, alias @/, CI) fonctionne.
// Les premiers tests métier arrivent avec E1 (comptes & authentification).
describe("smoke", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
