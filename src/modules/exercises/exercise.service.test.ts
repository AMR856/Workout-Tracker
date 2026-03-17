import { ExerciseService } from "./exercise.service";
import { ExerciseModel } from "./exercise.model";
import CustomError from "../../types/customError";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ExerciseCategory, MuscleGroup } from "@prisma/client";

jest.mock("./exercise.model", () => ({
  ExerciseModel: {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByCategory: jest.fn(),
    findByMuscleGroup: jest.fn(),
    update: jest.fn(),
  },
}));

const mockedExerciseModel = ExerciseModel as jest.Mocked<typeof ExerciseModel>;

describe("ExerciseService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create an exercise and return it", async () => {
      const input = {
        name: "Push Up",
        description: "A basic push up",
        category: ExerciseCategory.STRENGTH,
        muscleGroup: MuscleGroup.CHEST,
      };
      const fakeExercise = {
        ...input,
        id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockedExerciseModel.create.mockResolvedValueOnce(fakeExercise);
      const result = await ExerciseService.create(input);
      expect(result).toEqual(fakeExercise);
      expect(mockedExerciseModel.create).toHaveBeenCalledWith(input);
    });
    it("should throw CustomError on failure", async () => {
      mockedExerciseModel.create.mockRejectedValueOnce(new Error("fail"));
      await expect(
        ExerciseService.create({
          name: "Test",
          description: "desc",
          category: ExerciseCategory.STRENGTH,
          muscleGroup: MuscleGroup.CHEST,
        })
      ).rejects.toThrow(CustomError);
    });
  });

  describe("findAll", () => {
    it("should return all exercises", async () => {
      const fakeExercises = [
        {
          id: "1",
          name: "Push Up",
          description: "desc",
          category: ExerciseCategory.STRENGTH,
          muscleGroup: MuscleGroup.CHEST,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Squat",
          description: "desc",
          category: ExerciseCategory.STRENGTH,
          muscleGroup: MuscleGroup.LEGS,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockedExerciseModel.findAll.mockResolvedValueOnce(fakeExercises);
      const result = await ExerciseService.findAll();
      expect(result).toEqual(fakeExercises);
      expect(mockedExerciseModel.findAll).toHaveBeenCalled();
    });
    it("should throw CustomError on failure", async () => {
      mockedExerciseModel.findAll.mockRejectedValueOnce(new Error("fail"));
      await expect(ExerciseService.findAll()).rejects.toThrow(CustomError);
    });
  });

  describe("findById", () => {
    it("should return exercise by id", async () => {
      const fakeExercise = {
        id: "1",
        name: "Push Up",
        description: "desc",
        category: ExerciseCategory.STRENGTH,
        muscleGroup: MuscleGroup.CHEST,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockedExerciseModel.findById.mockResolvedValueOnce(fakeExercise);
      const result = await ExerciseService.findById("1");
      expect(result).toEqual(fakeExercise);
      expect(mockedExerciseModel.findById).toHaveBeenCalledWith("1");
    });
    it("should throw 400 if id not provided", async () => {
      // @ts-expect-error
      await expect(ExerciseService.findById()).rejects.toThrow(CustomError);
    });
    it("should throw 404 if not found", async () => {
      mockedExerciseModel.findById.mockResolvedValueOnce(null);
      await expect(ExerciseService.findById("2")).rejects.toThrow(CustomError);
    });
    it("should throw CustomError on failure", async () => {
      mockedExerciseModel.findById.mockRejectedValueOnce(new Error("fail"));
      await expect(ExerciseService.findById("1")).rejects.toThrow(CustomError);
    });
  });

  describe("findByCategory", () => {
    it("should return exercises by category", async () => {
      const fakeExercises = [
        {
          id: "1",
          name: "Push Up",
          description: "desc",
          category: ExerciseCategory.STRENGTH,
          muscleGroup: MuscleGroup.CHEST,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockedExerciseModel.findByCategory.mockResolvedValueOnce(fakeExercises);
      const result = await ExerciseService.findByCategory(ExerciseCategory.STRENGTH);
      expect(result).toEqual(fakeExercises);
      expect(mockedExerciseModel.findByCategory).toHaveBeenCalledWith(ExerciseCategory.STRENGTH);
    });
    it("should throw 400 if category not provided", async () => {
      // @ts-expect-error
      await expect(ExerciseService.findByCategory()).rejects.toThrow(CustomError);
    });
    it("should throw CustomError on failure", async () => {
      mockedExerciseModel.findByCategory.mockRejectedValueOnce(new Error("fail"));
      await expect(ExerciseService.findByCategory(ExerciseCategory.STRENGTH)).rejects.toThrow(CustomError);
    });
  });

  describe("findByMuscleGroup", () => {
    it("should return exercises by muscle group", async () => {
      const fakeExercises = [
        {
          id: "1",
          name: "Push Up",
          description: "desc",
          category: ExerciseCategory.STRENGTH,
          muscleGroup: MuscleGroup.CHEST,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockedExerciseModel.findByMuscleGroup.mockResolvedValueOnce(fakeExercises);
      const result = await ExerciseService.findByMuscleGroup(MuscleGroup.CHEST);
      expect(result).toEqual(fakeExercises);
      expect(mockedExerciseModel.findByMuscleGroup).toHaveBeenCalledWith(MuscleGroup.CHEST);
    });
    it("should throw 400 if muscle group not provided", async () => {
      // @ts-expect-error
      await expect(ExerciseService.findByMuscleGroup()).rejects.toThrow(CustomError);
    });
    it("should throw CustomError on failure", async () => {
      mockedExerciseModel.findByMuscleGroup.mockRejectedValueOnce(new Error("fail"));
      await expect(ExerciseService.findByMuscleGroup(MuscleGroup.CHEST)).rejects.toThrow(CustomError);
    });
  });

  describe("update", () => {
    it("should update and return exercise", async () => {
      const id = "1";
      const data = { name: "Updated" };
      const found = {
        id,
        name: "Push Up",
        description: "desc",
        category: ExerciseCategory.STRENGTH,
        muscleGroup: MuscleGroup.CHEST,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updated = {
        ...found,
        ...data,
      };
      mockedExerciseModel.findById.mockResolvedValueOnce(found);
      mockedExerciseModel.update.mockResolvedValueOnce(updated);
      const result = await ExerciseService.update(id, data);
      expect(result).toEqual(updated);
      expect(mockedExerciseModel.update).toHaveBeenCalledWith(id, data);
    });
    it("should throw 400 if id not provided", async () => {
      // @ts-expect-error
      await expect(ExerciseService.update()).rejects.toThrow(CustomError);
    });
    it("should throw 404 if not found", async () => {
      mockedExerciseModel.findById.mockResolvedValueOnce(null);
      await expect(ExerciseService.update("2", { name: "x" })).rejects.toThrow(CustomError);
    });
    it("should throw CustomError on failure", async () => {
      mockedExerciseModel.findById.mockResolvedValueOnce({
        id: "1",
        name: "Push Up",
        description: "desc",
        category: ExerciseCategory.STRENGTH,
        muscleGroup: MuscleGroup.CHEST,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockedExerciseModel.update.mockRejectedValueOnce(new Error("fail"));
      await expect(ExerciseService.update("1", { name: "x" })).rejects.toThrow(CustomError);
    });
  });
});
