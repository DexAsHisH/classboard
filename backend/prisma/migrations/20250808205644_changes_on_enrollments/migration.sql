/*
  Warnings:

  - You are about to alter the column `gradePoints` on the `Enrollment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `disipline` on the `Student` table. All the data in the column will be lost.
  - Added the required column `discipline` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Enrollment" ADD COLUMN     "studentPoints" INTEGER,
ALTER COLUMN "gradePoints" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Student" DROP COLUMN "disipline",
ADD COLUMN     "discipline" TEXT NOT NULL;
