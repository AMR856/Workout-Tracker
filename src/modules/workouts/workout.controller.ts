import { Request, Response, NextFunction } from "express";
import { WorkoutService } from "./workout.service";
import { CreateWorkoutInput } from "./workout.validation";
import { HttpStatusText } from "../../types/HTTPStatusText";
import { WorkoutStatus } from "@prisma/client";
import {
  AddNotesRequset,
  CreateWorkoutRequest,
  DeleteWorkoutRequest,
  GenerateReportRequest,
  ListUserWorkoutsRequest,
  ScheduleWorkoutRequest,
  UpdateWorkoutRequest,
} from "./workout.type";

export class WorkoutController {
  static async create(
    req: Request<{}, {}, CreateWorkoutInput>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = (req as CreateWorkoutRequest).user.id;

      const workout = await WorkoutService.create({
        ...req.body,
        userId,
      });

      res.status(201).json({
        status: HttpStatusText.SUCCESS,
        data: workout,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: UpdateWorkoutRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { workoutId } = req.params;
      const data = req.body;

      const workout = await WorkoutService.update({
        workoutId,
        ...data,
      });

      res.status(200).json({
        status: HttpStatusText.SUCCESS,
        data: workout,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(
    req: DeleteWorkoutRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { workoutId } = req.params;

      await WorkoutService.delete({ workoutId });

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  static async addNotes(
    req: AddNotesRequset,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { workoutId } = req.params;
      const { notes } = req.body;

      const workout = await WorkoutService.addNotes({ workoutId, notes });

      res.status(200).json({ status: HttpStatusText.SUCCESS, data: workout });
    } catch (err) {
      next(err);
    }
  }

  static async schedule(
    req: ScheduleWorkoutRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { workoutId } = req.params;
      const scheduledAt = new Date(req.body.scheduledAt);

      const workout = await WorkoutService.schedule({ workoutId, scheduledAt });

      res.status(200).json({ status: HttpStatusText.SUCCESS, data: workout });
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
      const userId = (req as ListUserWorkoutsRequest).user.id;
      const { status } = req.query;

      const workouts = await WorkoutService.listUserWorkouts({
        userId,
        status: status as WorkoutStatus | undefined,
      });

      res.status(200).json({ status: HttpStatusText.SUCCESS, data: workouts });
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
      const { workoutId } = req.params;

      const workout = await WorkoutService.findById({ workoutId });

      res.status(200).json({ status: HttpStatusText.SUCCESS, data: workout });
    } catch (err) {
      next(err);
    }
  }
  static async generateReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as GenerateReportRequest).user.id;
      const { from, to, status } = (req as GenerateReportRequest).query;

      const report = await WorkoutService.generateReport({
        userId: userId,
        filters: {
          from: from,
          to: to,
          status: status,
        },
      });

      res.status(200).json({ status: HttpStatusText.SUCCESS, data: report });
    } catch (err) {
      next(err);
    }
  }
}
