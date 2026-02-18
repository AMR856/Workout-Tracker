import request from "supertest";
import express from "express";
import { WorkoutController } from "./workout.controller";
import { WorkoutService } from "./workout.service";
import { afterEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("./workout.service");

const app = express();
app.use(express.json());

const mockUser = (req: any, res: any, next: any) => {
  req.user = { id: "1" };
  next();
};

app.post("/workouts", mockUser, WorkoutController.create);
app.put("/workouts/:workoutId", WorkoutController.update);
app.delete("/workouts/:workoutId", WorkoutController.delete);
app.patch("/workouts/:workoutId/notes", WorkoutController.addNotes);
app.patch("/workouts/:workoutId/schedule", WorkoutController.schedule);
app.get("/workouts", mockUser, WorkoutController.listUserWorkouts);
app.get("/workouts/:workoutId", WorkoutController.findById);
app.get("/report", mockUser, WorkoutController.generateReport);

describe("WorkoutController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("POST /workouts should create workout", async () => {
    (WorkoutService.create as jest.Mock).mockResolvedValue({ id: "1" } as never);

    const res = await request(app).post("/workouts").send({
      title: "test",
      exercises: [],
    });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("1");
  });

  it("PUT /workouts/:id should update workout", async () => {
    (WorkoutService.update as jest.Mock).mockResolvedValue({ id: "1" } as never);

    const res = await request(app)
      .put("/workouts/1")
      .send({ title: "updated" });

    expect(res.status).toBe(200);
  });

  it("DELETE /workouts/:id should delete workout", async () => {
    (WorkoutService.delete as jest.Mock).mockResolvedValue(true as never);

    const res = await request(app).delete("/workouts/1");

    expect(res.status).toBe(204);
  });

  it("PATCH /workouts/:id/notes should add notes", async () => {
    (WorkoutService.addNotes as jest.Mock).mockResolvedValue({ id: "1" } as never);

    const res = await request(app)
      .patch("/workouts/1/notes")
      .send({ notes: "hello" });

    expect(res.status).toBe(200);
  });

  it("PATCH /workouts/:id/schedule should schedule", async () => {
    (WorkoutService.schedule as jest.Mock).mockResolvedValue({ id: "1" } as never);

    const res = await request(app)
      .patch("/workouts/1/schedule")
      .send({ scheduledAt: new Date() });

    expect(res.status).toBe(200);
  });

  it("GET /workouts should list workouts", async () => {
    (WorkoutService.listUserWorkouts as jest.Mock).mockResolvedValue([
      { id: "1" },
    ] as never);

    const res = await request(app).get("/workouts");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it("GET /workouts/:id should get workout", async () => {
    (WorkoutService.findById as jest.Mock).mockResolvedValue({ id: "1" } as never);

    const res = await request(app).get("/workouts/1");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("1");
  });

  it("GET /report should return report", async () => {
    (WorkoutService.generateReport as jest.Mock).mockResolvedValue({
      totalWorkouts: 1,
      totalVolume: 100,
      workouts: [],
    } as never);

    const res = await request(app).get("/report");

    expect(res.status).toBe(200);
    expect(res.body.data.totalWorkouts).toBe(1);
  });
});
