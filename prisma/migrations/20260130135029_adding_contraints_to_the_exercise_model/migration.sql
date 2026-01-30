/*
  Warnings:

  - Changed the type of `category` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `muscleGroup` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('CARDIO', 'STRENGTH', 'FLEXIBILITY');

-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'FULL_BODY');

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "category",
ADD COLUMN     "category" "ExerciseCategory" NOT NULL,
DROP COLUMN "muscleGroup",
ADD COLUMN     "muscleGroup" "MuscleGroup" NOT NULL;
