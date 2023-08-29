-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INVESTOR', 'ADMIN', 'FUNDRASIER');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('KYC_LEGAL_ID', 'CAMPAIGN_IMAGE', 'CAMPAIGN_BACKGROUND');

-- CreateEnum
CREATE TYPE "KycRisk" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "phoneNumber" TEXT,
    "street_address" TEXT,
    "country" TEXT,
    "city" TEXT,
    "state_province" TEXT,
    "zip" TEXT,
    "role" "UserRole" NOT NULL,
    "refresh_token" TEXT,
    "avatar_picture" TEXT,
    "activated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kyc_infor" (
    "id" SERIAL NOT NULL,
    "risk" "KycRisk" NOT NULL,
    "status" "KycStatus" NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "kyc_infor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_storage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "object_id" INTEGER NOT NULL,
    "fileType" "FileType" NOT NULL,

    CONSTRAINT "file_storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "localtion" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "goal" DOUBLE PRECISION NOT NULL,
    "current_amount" DOUBLE PRECISION NOT NULL,
    "investor" INTEGER NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "campaign_id" INTEGER NOT NULL,

    CONSTRAINT "campaign_tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_infor_user_id_key" ON "kyc_infor"("user_id");

-- AddForeignKey
ALTER TABLE "kyc_infor" ADD CONSTRAINT "kyc_infor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_tag" ADD CONSTRAINT "campaign_tag_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
