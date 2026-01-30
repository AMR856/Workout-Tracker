import { WorkoutStatus } from "@prisma/client";
import { z } from "zod";

const exerciseSchema = z.object({
  exerciseId: z.string().uuid({ message: "Invalid exercise ID" }),
  sets: z.number().int().min(1, "Sets must be at least 1").max(15, "What are you even doing"),
  reps: z.number().int().min(1, "Reps must be at least 1"),
  weight: z.number().nonnegative().optional(),
});

export const createWorkoutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  scheduledAt: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().optional()
  ),
  exercises: z.array(exerciseSchema).min(1, "At least one exercise is required"),
});

export const updateWorkoutSchema = z.object({
  title: z.string().min(1).optional(),
  notes: z.string().optional(),
  scheduledAt: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().optional()
  ),
  status: z.nativeEnum(WorkoutStatus).optional(),
  exercises: z.array(exerciseSchema).optional(),
});


export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;