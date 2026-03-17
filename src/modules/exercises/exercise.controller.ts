import { Request, Response, NextFunction } from "express";
import {
  CreateExerciseRequest,
  UpdateExerciseRequest,
  GetExerciseByIdRequest,
  GetExerciseByMuscleGroupRequest,
  GetExerciseByCategory,
  DeleteExerciseRequest,
} from "./exercise.type";
import { HttpStatusText } from "../../types/HTTPStatusText";
import { ExerciseService } from "./exercise.service";
import { ExerciseCategory, MuscleGroup } from "@prisma/client";

export class ExerciseController {
  static async create(
    req: CreateExerciseRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const exercise = await ExerciseService.create(req.body);
      res.status(201).json({
        status: HttpStatusText.SUCCESS,
        data: exercise,
      });
    } catch (err) {
      next(err);
    }
  }

  static async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const exercises = await ExerciseService.findAll();
      res.json({
        status: HttpStatusText.SUCCESS,
        data: exercises,
      });
    } catch (err) {
      next(err);
    }
  }

  static async findById(
    req: GetExerciseByIdRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const exercise = await ExerciseService.findById(req.params.id);
      res.json({
        status: HttpStatusText.SUCCESS,
        data: exercise,
      });
    } catch (err) {
      next(err);
    }
  }

  static async findByCategory(
    req: GetExerciseByCategory,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const exercises = await ExerciseService.findByCategory(
        req.query.category as ExerciseCategory,
      );
      res.json({
        status: HttpStatusText.SUCCESS,
        data: exercises,
      });
    } catch (err) {
      next(err);
    }
  }

  static async findByMuscleGroup(
    req: GetExerciseByMuscleGroupRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const exercises = await ExerciseService.findByMuscleGroup(
        req.query.muscleGroup as MuscleGroup,
      );
      res.json({
        status: HttpStatusText.SUCCESS,
        data: exercises,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: UpdateExerciseRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const exercise = await ExerciseService.update(req.params.id, req.body);
      res.json({
        status: HttpStatusText.SUCCESS,
        data: exercise,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(
    req: DeleteExerciseRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const exercise = await ExerciseService.delete(req.params.id);
      res.json({
        status: HttpStatusText.SUCCESS,
        data: exercise,
      });
    } catch (err) {
      next(err);
    }
  }
}