-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INVESTOR', 'ADMIN', 'FUNDRASIER');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('KYC_LEGAL_ID', 'CAMPAIGN_IMAGE', 'CAMPAIGN_BACKGROUND');

-- CreateEnum
CREATE TYPE "KycRisk" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CampaignFileType" AS ENUM ('IMAGE', 'BACKGROUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TransactionPaymentMethod" AS ENUM ('BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "FundCampaignStatus" AS ENUM ('ON_GOING', 'FAILED', 'SUCCEED');

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
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "submitted_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "kyc_infor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kyc_image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "kycInforId" INTEGER NOT NULL,

    CONSTRAINT "kyc_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_storage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "object_id" INTEGER NOT NULL,
    "upload_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "goal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "current_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creator_id" INTEGER NOT NULL,
    "campaignTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "FundCampaignStatus" NOT NULL DEFAULT 'ON_GOING',

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_bank" (
    "id" SERIAL NOT NULL,
    "bank_name" TEXT NOT NULL,
    "account_holder_name" TEXT NOT NULL,
    "bank_number" TEXT NOT NULL,
    "campaign_id" INTEGER NOT NULL,

    CONSTRAINT "campaign_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_file" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "upload_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "CampaignFileType" NOT NULL DEFAULT 'IMAGE',

    CONSTRAINT "campaign_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_campaign" (
    "category_id" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,

    CONSTRAINT "category_campaign_pkey" PRIMARY KEY ("category_id","campaign_id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" "TransactionPaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "fund_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "update_date" TIMESTAMP(3),
    "generated_note" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "campaign_id" INTEGER NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_infor_user_id_key" ON "kyc_infor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_bank_campaign_id_key" ON "campaign_bank"("campaign_id");

-- AddForeignKey
ALTER TABLE "kyc_infor" ADD CONSTRAINT "kyc_infor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc_image" ADD CONSTRAINT "kyc_image_kycInforId_fkey" FOREIGN KEY ("kycInforId") REFERENCES "kyc_infor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_bank" ADD CONSTRAINT "campaign_bank_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_file" ADD CONSTRAINT "campaign_file_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_campaign" ADD CONSTRAINT "category_campaign_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_campaign" ADD CONSTRAINT "category_campaign_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
