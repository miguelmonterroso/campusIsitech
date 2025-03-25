/*
  Warnings:

  - You are about to drop the column `courseId` on the `Enrollment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,courseScheduleId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseScheduleId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropIndex
DROP INDEX "Enrollment_studentId_courseId_key";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "courseId",
ADD COLUMN     "courseScheduleId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CourseSchedule" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "instructorId" INTEGER,
    "dayPattern" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "cupo" INTEGER NOT NULL,
    "zoomLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_courseScheduleId_key" ON "Enrollment"("studentId", "courseScheduleId");

-- AddForeignKey
ALTER TABLE "CourseSchedule" ADD CONSTRAINT "CourseSchedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSchedule" ADD CONSTRAINT "CourseSchedule_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseScheduleId_fkey" FOREIGN KEY ("courseScheduleId") REFERENCES "CourseSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
