import { WorkoutModel } from "./workout.model";
import CustomError from "../../types/customError";
import { CreateWorkoutInput, UpdateWorkoutInput } from "./workout.validation";

export class WorkoutService {
  static async create(data: CreateWorkoutInput) {
    try {
      return await WorkoutModel.createWorkout({
        userId: data.userId,
        title: data.title,
        notes: data.notes,
        scheduledAt: data.scheduledAt,
        exercises: data.exercises.map((e) => ({
          exerciseId: e.exerciseId,
          sets: e.sets,
          reps: e.reps,
          ...(e.weight !== undefined && { weight: e.weight }),
        })),
      });
    } catch (err) {
      throw new CustomError("Failed to create workout", 500);
    }
  }

  static async update(workoutId: string, data: UpdateWorkoutInput) {
    const workout = await WorkoutModel.findById(workoutId);
    if (!workout) throw new CustomError("Workout not found", 404);

    return WorkoutModel.updateWorkout(workoutId, {
      title: data.title,
      notes: data.notes,
      status: data.status,
      scheduledAt: data.scheduledAt,
      ...(data.exercises !== undefined && {
        exercises: data.exercises.map((e) => ({
          exerciseId: e.exerciseId,
          sets: e.sets,
          reps: e.reps,
          ...(e.weight !== undefined && { weight: e.weight }),
        })),
      }),
    });
  }

  static async delete(workoutId: string) {
    const workout = await WorkoutModel.findById(workoutId);
    if (!workout) throw new CustomError("Workout not found", 404);

    return WorkoutModel.deleteWorkout(workoutId);
  }

  static async addNotes(workoutId: string, notes: string) {
    const workout = await WorkoutModel.findById(workoutId);
    if (!workout) throw new CustomError("Workout not found", 404);

    return WorkoutModel.addNotes(workoutId, notes);
  }

  static async schedule(workoutId: string, scheduledAt: Date) {
    const workout = await WorkoutModel.findById(workoutId);
    if (!workout) throw new CustomError("Workout not found", 404);

    return WorkoutModel.scheduleWorkout(workoutId, scheduledAt);
  }

  static async listUserWorkouts(userId: string, status?: string) {
    return WorkoutModel.listUserWorkouts(userId, status as any);
  }

  static async findById(workoutId: string) {
    const workout = await WorkoutModel.findById(workoutId);
    if (!workout) throw new CustomError("Workout not found", 404);
    return workout;
  }
}
