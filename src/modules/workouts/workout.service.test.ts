import { WorkoutService } from "./workout.service";
import { WorkoutModel } from "./workout.model";
import CustomError from "../../types/customError";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("./workout.model", () => ({
  WorkoutModel: {
    createWorkout: jest.fn(),
    findById: jest.fn(),
    updateWorkout: jest.fn(),
    deleteWorkout: jest.fn(),
    addNotes: jest.fn(),
    scheduleWorkout: jest.fn(),
    listUserWorkouts: jest.fn(),
    getWorkoutReport: jest.fn(),
  },
}));

const mockedWorkoutModel = WorkoutModel as jest.Mocked<typeof WorkoutModel>;

describe("WorkoutService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create workout", async () => {
      mockedWorkoutModel.createWorkout.mockResolvedValue({ id: "1" } as any);

      const result = await WorkoutService.create({
        userId: "1",
        title: "test",
        notes: "note",
        scheduledAt: new Date(),
        exercises: [{ exerciseId: "e1", sets: 3, reps: 10, weight: 50 }],
      });
      
      expect(result).toEqual({ id: "1" });

      expect(mockedWorkoutModel.createWorkout).toHaveBeenCalled();
    });

    it("should throw if creation fails", async () => {
      mockedWorkoutModel.createWorkout.mockRejectedValue(new Error());

      await expect(
        WorkoutService.create({
          userId: "1",
          title: "test",
          notes: "note",
          scheduledAt: new Date(),
          exercises: [],
        }),
      ).rejects.toThrow(CustomError);
      expect(mockedWorkoutModel.createWorkout).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update workout", async () => {
      mockedWorkoutModel.findById.mockResolvedValue({ id: "1" } as any);
      mockedWorkoutModel.updateWorkout.mockResolvedValue({ id: "2" } as any);

      const result = await WorkoutService.update({
        workoutId: "1",
        title: "updated",
      } as any);

      expect(result).toEqual({ id: "2" });
    });

    it("should throw if workout not found", async () => {
      mockedWorkoutModel.findById.mockResolvedValue(null);

      await expect(
        WorkoutService.update({ workoutId: "1" } as any),
      ).rejects.toThrow(CustomError);
    });
  });

  describe("delete", () => {
    it("should delete workout", async () => {
      mockedWorkoutModel.findById.mockResolvedValue({ id: "1" } as any);
      mockedWorkoutModel.deleteWorkout.mockResolvedValue(true as any);

      const result = await WorkoutService.delete({ workoutId: "1" });

      expect(result).toBeTruthy();
    });

    it("should throw if workout not found", async () => {
      mockedWorkoutModel.findById.mockResolvedValue(null);

      await expect(
        WorkoutService.delete({ workoutId: "1" }),
      ).rejects.toThrow(CustomError);
    });
  });

  describe("addNotes", () => {
    it("should add notes", async () => {
      mockedWorkoutModel.findById.mockResolvedValue({ id: "1" } as any);
      mockedWorkoutModel.addNotes.mockResolvedValue({ id: "1" } as any);

      const result = await WorkoutService.addNotes({
        workoutId: "1",
        notes: "note",
      });

      expect(result).toEqual({ id: "1" });
    });

    it("should throw if workout not found", async () => {
      mockedWorkoutModel.findById.mockResolvedValue(null);

      await expect(
        WorkoutService.addNotes({ workoutId: "1", notes: "test" }),
      ).rejects.toThrow(CustomError);
    });
  });

  describe("schedule", () => {
    it("should schedule workout", async () => {
      mockedWorkoutModel.findById.mockResolvedValue({ id: "1" } as any);
      mockedWorkoutModel.scheduleWorkout.mockResolvedValue({ id: "1" } as any);

      const result = await WorkoutService.schedule({
        workoutId: "1",
        scheduledAt: new Date(),
      });

      expect(result).toEqual({ id: "1" });
    });

    it("should throw if workout not found", async () => {
      mockedWorkoutModel.findById.mockResolvedValue(null);

      await expect(
        WorkoutService.schedule({
          workoutId: "1",
          scheduledAt: new Date(),
        }),
      ).rejects.toThrow(CustomError);
    });
  });

  describe("listUserWorkouts", () => {
    it("should list workouts", async () => {
      mockedWorkoutModel.listUserWorkouts.mockResolvedValue([{ id: "1" }] as any);

      const result = await WorkoutService.listUserWorkouts({
        userId: "1",
      });

      expect(result).toEqual([{ id: "1" }]);
    });
  });

  describe("findById", () => {
    it("should return workout", async () => {
      mockedWorkoutModel.findById.mockResolvedValue({ id: "1" } as any);

      const result = await WorkoutService.findById({ workoutId: "1" });

      expect(result).toEqual({ id: "1" });
    });

    it("should throw if not found", async () => {
      mockedWorkoutModel.findById.mockResolvedValue(null);

      await expect(
        WorkoutService.findById({ workoutId: "1" }),
      ).rejects.toThrow(CustomError);
    });
  });

  describe("generateReport", () => {
    it("should generate report", async () => {
      mockedWorkoutModel.getWorkoutReport.mockResolvedValue([
        {
          exercises: [{ sets: 2, reps: 10, weight: 50 }],
        },
      ] as any);

      const result = await WorkoutService.generateReport({
        userId: "1",
        filters: {},
      });

      expect(result.totalWorkouts).toBe(1);
      expect(result.totalVolume).toBe(2 * 10 * 50);
    });
  });
});
