import { Request, Response, NextFunction } from "express";
import { WorkoutService } from "./workout.service";
import {
  createWorkoutSchema,
  updateWorkoutSchema,
  CreateWorkoutInput,
  UpdateWorkoutInput,
} from "./workout.validation";

export class WorkoutController {
  static async create(
    req: Request<{}, {}, CreateWorkoutInput>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = createWorkoutSchema.parse(req.body);
      const workout = await WorkoutService.create(data);
      res.status(201).json({ status: "success", data: workout });
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: Request<{ workoutId: string }, {}, UpdateWorkoutInput>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const workoutId = req.workout!.id;
      const data = updateWorkoutSchema.parse(req.body);
      const workout = await WorkoutService.update(workoutId, data);
      res.json({ status: "success", data: workout });
    } catch (err) {
      next(err);
    }
  }

  static async delete(
    req: Request<{ workoutId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const workoutId = req.workout!.id;
      await WorkoutService.delete(workoutId);
      res.json({ status: "success", message: "Workout deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async addNotes(
    req: Request<{ workoutId: string }, {}, { notes: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const workoutId = req.workout!.id;
      const { notes } = req.body;
      const workout = await WorkoutService.addNotes(workoutId, notes);
      res.json({ status: "success", data: workout });
    } catch (err) {
      next(err);
    }
  }

  static async schedule(
    req: Request<{ workoutId: string }, {}, { scheduledAt: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const workoutId = req.workout!.id;
      const scheduledAt = new Date(req.body.scheduledAt);
      const workout = await WorkoutService.schedule(workoutId, scheduledAt);
      res.json({ status: "success", data: workout });
    } catch (err) {
      next(err);
    }
  }

  static async listUserWorkouts(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user!.id;

      const { status } = req.query;

      const workouts = await WorkoutService.listUserWorkouts(
        userId,
        status as string | undefined,
      );

      res.json({ status: "success", data: workouts });
    } catch (err) {
      next(err);
    }
  }

  static async findById(
    req: Request<{ workoutId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const workoutId = req.workout!.id;
      const workout = await WorkoutService.findById(workoutId);
      res.json({ status: "success", data: workout });
    } catch (err) {
      next(err);
    }
  }
}
