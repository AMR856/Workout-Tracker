import { z } from "zod";
import { ExerciseCategory, MuscleGroup } from "@prisma/client";

export class ExerciseValidationSchema {
  static create = z.object({
    name: z
      .string()
      .trim()
      .min(1, "Exercise name is required")
      .describe("Exercise name"),
    description: z
      .string()
      .trim()
      .min(1, "Exercise description is required")
      .describe("Exercise description"),
    category: z
      .enum(Object.values(ExerciseCategory) as [string, ...string[]])
      .describe("Exercise category"),
    muscleGroup: z
      .enum(Object.values(MuscleGroup) as [string, ...string[]])
      .describe("Muscle group"),
  });

  static update = z.object({
    name: z
      .string()
      .trim()
      .min(1, "Exercise name must not be empty")
      .optional()
      .describe("Exercise name"),
    description: z
      .string()
      .trim()
      .min(1, "Exercise description must not be empty")
      .optional()
      .describe("Exercise description"),
    category: z
      .enum(Object.values(ExerciseCategory) as [string, ...string[]])
      .optional()
      .describe("Exercise category"),
    muscleGroup: z
      .enum(Object.values(MuscleGroup) as [string, ...string[]])
      .optional()
      .describe("Muscle group"),
  });

  static getByCategory = z.object({
    category: z
      .enum(Object.values(ExerciseCategory) as [string, ...string[]])
      .describe("Category query parameter"),
  });

  static getByMuscleGroup = z.object({
    muscleGroup: z
      .enum(Object.values(MuscleGroup) as [string, ...string[]])
      .describe("Muscle group query parameter"),
  });
}

export type CreateExerciseInput = z.infer<typeof ExerciseValidationSchema.create>;
export type UpdateExerciseInput = z.infer<typeof ExerciseValidationSchema.update>;
export type GetByCategoryInput = z.infer<typeof ExerciseValidationSchema.getByCategory>;
export type GetByMuscleGroupInput = z.infer<typeof ExerciseValidationSchema.getByMuscleGroup>;
