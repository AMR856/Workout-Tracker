import request from "supertest";
import express from "express";
import { ExerciseController } from "./exercise.controller";
import { ExerciseService } from "./exercise.service";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { ExerciseCategory, MuscleGroup } from "@prisma/client";

jest.mock("./exercise.service");

const app = express();
app.use(express.json());

app.post("/exercises", ExerciseController.create);
app.get("/exercises", ExerciseController.findAll);
app.get("/exercises/category", ExerciseController.findByCategory);
app.get("/exercises/muscle-group", ExerciseController.findByMuscleGroup);
app.get("/exercises/:id", ExerciseController.findById);
app.put("/exercises/:id", ExerciseController.update);

describe("ExerciseController", () => {
  const mockCreate = ExerciseService.create as any;
  const mockFindAll = ExerciseService.findAll as any;
  const mockFindById = ExerciseService.findById as any;
  const mockFindByCategory = ExerciseService.findByCategory as any;
  const mockFindByMuscleGroup = ExerciseService.findByMuscleGroup as any;
  const mockUpdate = ExerciseService.update as any;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /exercises", () => {
    it("should create an exercise and return 201", async () => {
      mockCreate.mockResolvedValue({
        id: "1",
        name: "Push Up",
        description: "desc",
        category: ExerciseCategory.STRENGTH,
        muscleGroup: MuscleGroup.CHEST,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const res = await request(app)
        .post("/exercises")
        .send({
          name: "Push Up",
          description: "A basic push up",
          category: ExerciseCategory.STRENGTH,
          muscleGroup: MuscleGroup.CHEST,
        });
      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({ id: "1" });
    });
    it("should call next on error", async () => {
      mockCreate.mockRejectedValue(new Error("fail"));
      const res = await request(app)
        .post("/exercises")
        .send({});
      expect(res.status).not.toBe(201);
    });
  });

  describe("GET /exercises", () => {
    it("should return all exercises", async () => {
      mockFindAll.mockResolvedValue([
        {
          id: "1",
          name: "Push Up",
          description: "desc",
          category: ExerciseCategory.STRENGTH,
          muscleGroup: MuscleGroup.CHEST,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      const res = await request(app).get("/exercises");
      expect(res.status).toBe(200);
      expect(res.body.data[0]).toMatchObject({ id: "1" });
    });
  });

  describe("GET /exercises/:id", () => {
    it("should return exercise by id", async () => {
      mockFindById.mockResolvedValue({
        id: "1",
        name: "Push Up",
        description: "desc",
        category: ExerciseCategory.STRENGTH,
        muscleGroup: MuscleGroup.CHEST,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const res = await request(app).get("/exercises/1");
      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({ id: "1" });
    });
  });

  describe("GET /exercises/category", () => {
    it("should return exercises by category", async () => {
      mockFindByCategory.mockResolvedValue([
        {
          id: "1",
          name: "Push Up",
          description: "desc",
          category: ExerciseCategory.STRENGTH,
          muscleGroup: MuscleGroup.CHEST,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      const res = await request(app).get("/exercises/category").query({ category: ExerciseCategory.STRENGTH });
      expect(res.status).toBe(200);
      expect(res.body.data[0]).toMatchObject({ id: "1" });
    });
  });

  describe("GET /exercises/muscle-group", () => {
    it("should return exercises by muscle group", async () => {
      mockFindByMuscleGroup.mockResolvedValue([
        {
          id: "1",
          name: "Push Up",
          description: "desc",
          category: ExerciseCategory.STRENGTH,
          muscleGroup: MuscleGroup.CHEST,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      const res = await request(app).get("/exercises/muscle-group").query({ muscleGroup: MuscleGroup.CHEST });
      expect(res.status).toBe(200);
      expect(res.body.data[0]).toMatchObject({ id: "1" });
    });
  });

  describe("PUT /exercises/:id", () => {
    it("should update and return exercise", async () => {
      mockUpdate.mockResolvedValue({
        id: "1",
        name: "Updated",
        description: "desc",
        category: ExerciseCategory.STRENGTH,
        muscleGroup: MuscleGroup.CHEST,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const res = await request(app)
        .put("/exercises/1")
        .send({ name: "Updated" });
      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({ id: "1", name: "Updated" });
    });
  });
});
