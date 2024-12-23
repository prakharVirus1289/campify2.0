/*
  Warnings:

  - Added the required column `code_language` to the `M_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "M_messages" ADD COLUMN     "code_language" TEXT NOT NULL;
