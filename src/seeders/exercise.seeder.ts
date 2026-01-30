import { PrismaClient, ExerciseCategory, MuscleGroup } from "@prisma/client";
const prisma = new PrismaClient();

export async function seedExercises() {
  const count = await prisma.exercise.count();

  if (count > 0) {
    console.log("Exercises already seeded, skipping...");
    return;
  }

  const categories = Object.values(ExerciseCategory);
  const muscleGroups = Object.values(MuscleGroup);

  const exercises = Array.from({ length: 100 }).map((_, i) => ({
    name: `Exercise ${i + 1}`,
    description: `Auto-generated exercise number ${i + 1}`,
    category: categories[i % categories.length] ?? "CARDIO",
    muscleGroup: muscleGroups[i % muscleGroups.length] ?? "FULL_BODY",
  }));

  await prisma.exercise.createMany({
    data: exercises,
  });

  console.log("100 exercises seeded successfully");
}
