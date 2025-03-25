/*
  Warnings:

  - You are about to drop the column `cupo` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `dias` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `horaInicio` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `zoomLink` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "cupo",
DROP COLUMN "dias",
DROP COLUMN "endDate",
DROP COLUMN "horaInicio",
DROP COLUMN "startDate",
DROP COLUMN "zoomLink";
