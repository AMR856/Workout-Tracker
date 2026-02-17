import { WorkoutStatus } from "@prisma/client";
import { z } from "zod";

export class WorkoutValidationSchema {
  static exerciseSchema = z.object({
    exerciseId: z.string().uuid({ message: "Invalid exercise ID" }),
    sets: z
      .number()
      .int()
      .min(1, "Sets must be at least 1")
      .max(15, "What are you even doing"),
    reps: z.number().int().min(1, "Reps must be at least 1"),
    weight: z.number().nonnegative().optional(),
  });

  static create = z.object({
    title: z.string().min(1, "Title is required"),
    notes: z.string().optional(),
    scheduledAt: z.preprocess(
      (arg) => (arg ? new Date(arg as string) : undefined),
      z.date().optional(),
    ),
    exercises: z
      .array(WorkoutValidationSchema.exerciseSchema)
      .min(1, "At least one exercise is required"),
  });

  static update = z.object({
    title: z.string().min(1).optional(),
    notes: z.string().optional(),
    scheduledAt: z.preprocess(
      (arg) => (arg ? new Date(arg as string) : undefined),
      z.date().optional(),
    ),
    status: z.nativeEnum(WorkoutStatus).optional(),
    exercises: z.array(WorkoutValidationSchema.exerciseSchema).optional(),
  });

  static workoutId = z.object({
    workoutId: z.string().uuid("Invalid workout ID"),
  });
  static addNotes = z.object({
    notes: z
      .string()
      .min(1, "Notes cannot be empty")
      .max(1000, "Notes too long"),
  });
  static scheduleWorkout = z.object({
    scheduledAt: z.preprocess(
      (arg) => (arg ? new Date(arg as string) : undefined),
      z.date({ message: "Invalid date" }),
    ),
  });
  static generateReport = z.object({
    from: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid date",
      }),
    to: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid date",
      }),
    status: z.nativeEnum(WorkoutStatus).optional(),
  });
  static listWorkouts = z.object({
    status: z.nativeEnum(WorkoutStatus).optional(),
  });
}

export type CreateWorkoutInput = z.infer<typeof WorkoutValidationSchema.create>;
export type UpdateWorkoutInput = z.infer<typeof WorkoutValidationSchema.update>;
export type WorkoutIdInput = z.infer<typeof WorkoutValidationSchema.workoutId>;

export type AddNotesInput = z.infer<typeof WorkoutValidationSchema.addNotes>;

export type ScheduleWorkoutInput = z.infer<
  typeof WorkoutValidationSchema.scheduleWorkout
>;

export type ListUserWorkoutsInput  = z.infer<typeof WorkoutValidationSchema.listWorkouts>;

export type GenerateReportInput = z.infer<
  typeof WorkoutValidationSchema.generateReport
>;
