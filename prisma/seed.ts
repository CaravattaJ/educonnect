import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Thématiques validées avec l'utilisateur (2026-08-27) — liste administrable (D10),
// ce jeu de 7 est la donnée initiale, pas un enum figé. Un admin peut en ajouter d'autres
// via le back-office (épic E2).
const THEMES = [
  { label: "Sport", colorHex: "#F97316" },
  { label: "Écologie", colorHex: "#16A34A" },
  { label: "Citoyenneté", colorHex: "#2563EB" },
  { label: "Santé", colorHex: "#E11D48" },
  { label: "Art et culture", colorHex: "#A855F7" },
  { label: "Science et technique", colorHex: "#0891B2" },
  { label: "Avenir", colorHex: "#CA8A04" },
];

// Tranches d'âge validées avec l'utilisateur (2026-08-27).
const AUDIENCES = [
  { label: "3-6 ans", minAge: 3, maxAge: 6 },
  { label: "6-11 ans", minAge: 6, maxAge: 11 },
  { label: "11-15 ans", minAge: 11, maxAge: 15 },
  { label: "15-18 ans", minAge: 15, maxAge: 18 },
];

// Référentiel géographique minimal pour développer/tester en local uniquement.
// Le chargement complet du référentiel officiel (communes françaises) est prévu en épic E2.
const TEST_GEO = {
  region: { code: "TEST-REG", name: "Région de test" },
  department: { code: "TEST-DEP", name: "Département de test" },
  cities: [
    { inseeCode: "75056", postalCode: "75001", name: "Paris" },
    { inseeCode: "69123", postalCode: "69001", name: "Lyon" },
  ],
};

async function main() {
  for (const theme of THEMES) {
    await prisma.theme.upsert({
      where: { label: theme.label },
      update: { colorHex: theme.colorHex },
      create: theme,
    });
  }

  for (const audience of AUDIENCES) {
    await prisma.audience.upsert({
      where: { label: audience.label },
      update: { minAge: audience.minAge, maxAge: audience.maxAge },
      create: audience,
    });
  }

  const region = await prisma.region.upsert({
    where: { code: TEST_GEO.region.code },
    update: {},
    create: TEST_GEO.region,
  });

  const department = await prisma.department.upsert({
    where: { code: TEST_GEO.department.code },
    update: {},
    create: { ...TEST_GEO.department, regionId: region.id },
  });

  for (const city of TEST_GEO.cities) {
    await prisma.city.upsert({
      where: { inseeCode: city.inseeCode },
      update: {},
      create: { ...city, departmentId: department.id },
    });
  }

  console.log(
    `Seed terminé : ${THEMES.length} thématiques, ${AUDIENCES.length} tranches d'âge, ${TEST_GEO.cities.length} villes de test.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
