import { WorkoutModel } from "./workout.model";
import CustomError from "../../types/customError";
import {
  AddNotesServiceInput,
  CreateWorkoutServiceInput,
  DeleteWorkoutServiceInput,
  FindWorkoutServiceInput,
  GenerateReportServiceInput,
  ListUserWorkoutsServiceInput,
  ScheduleWorkoutServiceInput,
  UpdateWorkoutServiceInput,
} from "./workout.type";
import { HttpStatusText } from "../../types/HTTPStatusText";

const handleP2025 = (err: any, label: string) => {
  if (err?.code === "P2025") {
    throw new CustomError("Workout not found", 404, HttpStatusText.FAIL);
  }
  console.error(`Error in ${label}:`, err);
  throw err;
};

export class WorkoutService {
  static async create(data: CreateWorkoutServiceInput) {
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
<<<<<<< HEAD
      console.log(err);
=======
      console.error("Error creating workout:", err);
>>>>>>> master
      throw new CustomError(
        "Failed to create workout",
        500,
        HttpStatusText.ERROR,
      );
    }
  }

  static async update(data: UpdateWorkoutServiceInput) {
    try {
      return await WorkoutModel.updateWorkout(data.workoutId, {
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
    } catch (err) {
      const e = err as any;
      console.error("Update error code:", e?.code);
      console.error("Update error message:", e?.message);
      console.error("Update error meta:", e?.meta);
      handleP2025(e, "update");
    }
  }

  static async delete(data: DeleteWorkoutServiceInput) {
    try {
      return await WorkoutModel.deleteWorkout(data.workoutId);
    } catch (err) {
      handleP2025(err, "delete");
    }
  }

  static async addNotes(data: AddNotesServiceInput) {
    try {
      return await WorkoutModel.addNotes(data.workoutId, data.notes);
    } catch (err) {
      handleP2025(err, "addNotes");
    }
  }

  static async schedule(data: ScheduleWorkoutServiceInput) {
    try {
      return await WorkoutModel.scheduleWorkout(
        data.workoutId,
        data.scheduledAt,
      );
    } catch (err) {
      handleP2025(err, "schedule");
    }
  }

  static async listUserWorkouts(data: ListUserWorkoutsServiceInput) {
    return WorkoutModel.listUserWorkouts(data.userId, data.status);
  }

  static async findById(data: FindWorkoutServiceInput) {
    try {
      const workout = await WorkoutModel.findById(data.workoutId);
      if (!workout)
        throw new CustomError("Workout not found", 404, HttpStatusText.FAIL);
      return workout;
    } catch (err) {
      handleP2025(err, "findById");
    }
  }

  static async generateReport(data: GenerateReportServiceInput) {
    const workouts = await WorkoutModel.getWorkoutReport(data.userId, {
      to: data.filters.to ? new Date(data.filters.to) : undefined,
      from: data.filters.from ? new Date(data.filters.from) : undefined,
      status: data.filters.status ? data.filters.status : undefined,
    });

    const totalWorkouts = workouts.length;
    const totalVolume = workouts.reduce((sum, w) => {
      return (
        sum +
        w.exercises.reduce(
          (exSum, e) => exSum + e.sets * e.reps * (e.weight ?? 0),
          0,
        )
      );
    }, 0);

    return {
      totalWorkouts,
      totalVolume,
      workouts,
    };
  }
}