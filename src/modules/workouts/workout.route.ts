import { Router } from "express";
import { WorkoutController } from "./workout.controller";
import { authMiddleware } from "../../middlewares/auth";
import { workoutOwnershipMiddleware } from "../../middlewares/workoutOwnership";

const router = Router();

router.post("/", authMiddleware, WorkoutController.create);

router.patch("/:workoutId", authMiddleware, workoutOwnershipMiddleware,WorkoutController.update);

router.delete("/:workoutId", authMiddleware, workoutOwnershipMiddleware,WorkoutController.delete);

router.patch("/:workoutId/notes", authMiddleware, workoutOwnershipMiddleware,WorkoutController.addNotes);

router.patch("/:workoutId/schedule", authMiddleware, workoutOwnershipMiddleware,WorkoutController.schedule);

router.get("/:workoutId", authMiddleware, workoutOwnershipMiddleware,WorkoutController.findById);

router.get("/workouts", authMiddleware, WorkoutController.listUserWorkouts);

export default router;