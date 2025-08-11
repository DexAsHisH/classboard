/*
  Warnings:

  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Enrollment" DROP CONSTRAINT "Enrollment_studentId_fkey";

-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "gradePoints" INTEGER,
ADD COLUMN     "studentGrade" TEXT,
ADD COLUMN     "studentId" INTEGER;

-- DropTable
DROP TABLE "public"."Enrollment";

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
