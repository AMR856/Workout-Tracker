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
      throw new CustomError(
        "Failed to create workout",
        500,
        HttpStatusText.ERROR,
      );
    }
  }

  static async update(data: UpdateWorkoutServiceInput) {
    const workout = await WorkoutModel.findById(data.workoutId);
    if (!workout)
      throw new CustomError("Workout not found", 404, HttpStatusText.FAIL);

    return WorkoutModel.updateWorkout(data.workoutId, {
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

  static async delete(data: DeleteWorkoutServiceInput) {
    const workout = await WorkoutModel.findById(data.workoutId);
    if (!workout)
      throw new CustomError("Workout not found", 404, HttpStatusText.FAIL);

    return WorkoutModel.deleteWorkout(data.workoutId);
  }

  static async addNotes(data: AddNotesServiceInput) {
    const workout = await WorkoutModel.findById(data.workoutId);
    if (!workout)
      throw new CustomError("Workout not found", 404, HttpStatusText.FAIL);

    return WorkoutModel.addNotes(data.workoutId, data.notes);
  }

  static async schedule(data: ScheduleWorkoutServiceInput) {
    const workout = await WorkoutModel.findById(data.workoutId);
    if (!workout)
      throw new CustomError("Workout not found", 404, HttpStatusText.FAIL);

    return WorkoutModel.scheduleWorkout(data.workoutId, data.scheduledAt);
  }

  static async listUserWorkouts(data: ListUserWorkoutsServiceInput) {
    return WorkoutModel.listUserWorkouts(data.userId, data.status);
  }

  static async findById(data: FindWorkoutServiceInput) {
    const workout = await WorkoutModel.findById(data.workoutId);
    if (!workout)
      throw new CustomError("Workout not found", 404, HttpStatusText.FAIL);
    return workout;
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

// {
//     "email": "amrsouriya477@gmail.com",
//     "password":"linguaugilguil"
// }
