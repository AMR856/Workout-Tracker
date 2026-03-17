import { ExerciseModel } from "./exercise.model";
import CustomError from "../../types/customError";

import { HttpStatusText } from "../../types/HTTPStatusText";
import { ExerciseCategory, MuscleGroup } from "@prisma/client";
import { CreateExerciseInput, UpdateExerciseInput } from "./exercise.validation";

export class ExerciseService {
  static async create(data: CreateExerciseInput) {
    try {
      const exercise = await ExerciseModel.create({
        name: data.name,
        description: data.description,
        category: data.category as ExerciseCategory,
        muscleGroup: data.muscleGroup as MuscleGroup,
      });
      return exercise;
    } catch (err) {
      throw new CustomError(
        "Failed to create exercise",
        500,
        HttpStatusText.FAIL,
      );
    }
  }

  static async findAll() {
    try {
      const exercises = await ExerciseModel.findAll();
      return exercises;
    } catch (err) {
      throw new CustomError(
        "Failed to fetch exercises",
        500,
        HttpStatusText.FAIL,
      );
    }
  }

  static async findById(id: string) {
    try {
      if (!id) {
        throw new CustomError(
          "Exercise id wasn't provided",
          400,
          HttpStatusText.FAIL,
        );
      }

      const exercise = await ExerciseModel.findById(id);
      if (!exercise) {
        throw new CustomError(
          "Exercise not found",
          404,
          HttpStatusText.FAIL,
        );
      }

      return exercise;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        "Failed to fetch exercise",
        500,
        HttpStatusText.FAIL,
      );
    }
  }

  static async findByCategory(category: ExerciseCategory) {
    try {
      if (!category) {
        throw new CustomError(
          "Category wasn't provided",
          400,
          HttpStatusText.FAIL,
        );
      }

      const exercises = await ExerciseModel.findByCategory(category);
      return exercises;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        "Failed to fetch exercises by category",
        500,
        HttpStatusText.FAIL,
      );
    }
  }

  static async findByMuscleGroup(muscleGroup: MuscleGroup) {
    try {
      if (!muscleGroup) {
        throw new CustomError(
          "Muscle group wasn't provided",
          400,
          HttpStatusText.FAIL,
        );
      }

      const exercises = await ExerciseModel.findByMuscleGroup(muscleGroup);
      return exercises;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        "Failed to fetch exercises by muscle group",
        500,
        HttpStatusText.FAIL,
      );
    }
  }

  static async update(id: string, data: UpdateExerciseInput) {
    try {
      if (!id) {
        throw new CustomError(
          "Exercise id wasn't provided",
          400,
          HttpStatusText.FAIL,
        );
      }

      const exerciseExists = await ExerciseModel.findById(id);
      if (!exerciseExists) {
        throw new CustomError(
          "Exercise not found",
          404,
          HttpStatusText.FAIL,
        );
      }

      const updateData: any = { ...data };
      if (data.category) {
        updateData.category = data.category as ExerciseCategory;
      }
      if (data.muscleGroup) {
        updateData.muscleGroup = data.muscleGroup as MuscleGroup;
      }

      const exercise = await ExerciseModel.update(id, updateData);
      return exercise;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        "Failed to update exercise",
        500,
        HttpStatusText.FAIL,
      );
    }
  }

  static async delete(id: string) {
    try {
      if (!id) {
        throw new CustomError(
          "Exercise id wasn't provided",
          400,
          HttpStatusText.FAIL,
        );
      }

      const exerciseExists = await ExerciseModel.findById(id);
      if (!exerciseExists) {
        throw new CustomError(
          "Exercise not found",
          404,
          HttpStatusText.FAIL,
        );
      }

      const exercise = await ExerciseModel.delete(id);
      return exercise;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        "Failed to delete exercise",
        500,
        HttpStatusText.FAIL,
      );
    }
  }
}