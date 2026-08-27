-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ORGANISATEUR', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('EN_ATTENTE', 'ACTIF', 'REJETE', 'SUSPENDU', 'ANONYMISE');

-- CreateEnum
CREATE TYPE "IntervenantStatus" AS ENUM ('EN_ATTENTE', 'VALIDEE', 'REJETEE', 'DESACTIVEE');

-- CreateEnum
CREATE TYPE "ActivityFormat" AS ENUM ('PRESENTIEL', 'DISTANCIEL', 'HYBRIDE');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('BROUILLON', 'PUBLIEE', 'DEPUBLIEE');

-- CreateEnum
CREATE TYPE "ContactRequestStatus" AS ENUM ('ENVOYE', 'ECHEC_ENVOI');

-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('STRUCTURE', 'ACTIVITY', 'INTERVENANT');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OUVERT', 'TRAITE_IGNORE', 'TRAITE_ACTION');

-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('VALIDATION_INSCRIPTION', 'REJET_INSCRIPTION', 'VALIDATION_INTERVENANT', 'REJET_INTERVENANT', 'SUSPENSION_COMPTE', 'REACTIVATION_COMPTE', 'EDITION_COMPTE', 'EDITION_ACTIVITE', 'EDITION_INTERVENANT', 'TRAITEMENT_SIGNALEMENT', 'GESTION_TAXONOMIE');

-- CreateEnum
CREATE TYPE "AdminActionTargetType" AS ENUM ('USER', 'STRUCTURE', 'ACTIVITY', 'INTERVENANT', 'REPORT', 'THEME', 'AUDIENCE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INSCRIPTION_VALIDEE', 'INSCRIPTION_REJETEE', 'INTERVENANT_VALIDE', 'INTERVENANT_REJETE', 'NOUVELLE_DEMANDE_CONTACT', 'SIGNALEMENT_TRAITE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "role" "UserRole" NOT NULL,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "anonymizedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Structure" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT,
    "website" TEXT,
    "contactEmail" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intervenant" (
    "id" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "contactEmail" TEXT,
    "status" "IntervenantStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intervenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "format" "ActivityFormat" NOT NULL,
    "cityId" TEXT NOT NULL,
    "budgetIndicative" TEXT,
    "availabilityNote" TEXT,
    "status" "ActivityStatus" NOT NULL DEFAULT 'BROUILLON',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityIntervenant" (
    "activityId" TEXT NOT NULL,
    "intervenantId" TEXT NOT NULL,

    CONSTRAINT "ActivityIntervenant_pkey" PRIMARY KEY ("activityId","intervenantId")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audience" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityTheme" (
    "activityId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,

    CONSTRAINT "ActivityTheme_pkey" PRIMARY KEY ("activityId","themeId")
);

-- CreateTable
CREATE TABLE "ActivityAudience" (
    "activityId" TEXT NOT NULL,
    "audienceId" TEXT NOT NULL,

    CONSTRAINT "ActivityAudience_pkey" PRIMARY KEY ("activityId","audienceId")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "inseeCode" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "recipientStructureId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactRequestStatus" NOT NULL DEFAULT 'ENVOYE',
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "authorUserId" TEXT,
    "authorEmail" TEXT,
    "targetType" "ReportTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'OUVERT',
    "resolvedByUserId" TEXT,
    "resolutionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAction" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "actionType" "AdminActionType" NOT NULL,
    "targetType" "AdminActionTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "justification" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "payload" JSONB NOT NULL,
    "readAt" TIMESTAMP(3),
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Structure_userId_key" ON "Structure"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_label_key" ON "Theme"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Audience_label_key" ON "Audience"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "City_inseeCode_key" ON "City"("inseeCode");

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Structure" ADD CONSTRAINT "Structure_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervenant" ADD CONSTRAINT "Intervenant_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityIntervenant" ADD CONSTRAINT "ActivityIntervenant_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityIntervenant" ADD CONSTRAINT "ActivityIntervenant_intervenantId_fkey" FOREIGN KEY ("intervenantId") REFERENCES "Intervenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTheme" ADD CONSTRAINT "ActivityTheme_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTheme" ADD CONSTRAINT "ActivityTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityAudience" ADD CONSTRAINT "ActivityAudience_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityAudience" ADD CONSTRAINT "ActivityAudience_audienceId_fkey" FOREIGN KEY ("audienceId") REFERENCES "Audience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactRequest" ADD CONSTRAINT "ContactRequest_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactRequest" ADD CONSTRAINT "ContactRequest_recipientStructureId_fkey" FOREIGN KEY ("recipientStructureId") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_resolvedByUserId_fkey" FOREIGN KEY ("resolvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAction" ADD CONSTRAINT "AdminAction_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
