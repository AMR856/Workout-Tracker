import { Router } from "express";
import { WorkoutController } from "./workout.controller";
import { authMiddleware } from "../../middlewares/auth";
import { workoutOwnershipMiddleware } from "../../middlewares/workoutOwnership";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkoutStatus:
 *       type: string
 *       enum:
 *         - PENDING
 *         - COMPLETED
 *         - CANCELLED
 *
 *     ExerciseCategory:
 *       type: string
 *       enum:
 *         - CARDIO
 *         - STRENGTH
 *         - FLEXIBILITY
 *
 *     MuscleGroup:
 *       type: string
 *       enum:
 *         - CHEST
 *         - BACK
 *         - LEGS
 *         - SHOULDERS
 *         - ARMS
 *         - CORE
 *         - FULL_BODY
 *
 *     Exercise:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           $ref: '#/components/schemas/ExerciseCategory'
 *         muscleGroup:
 *           $ref: '#/components/schemas/MuscleGroup'
 *         workouts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkoutExercise'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - name
 *         - category
 *         - muscleGroup
 *         - createdAt
 *         - updatedAt
 *
 *     WorkoutExercise:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         workoutId:
 *           type: string
 *           format: uuid
 *         exerciseId:
 *           type: string
 *           format: uuid
 *         sets:
 *           type: integer
 *         reps:
 *           type: integer
 *         weight:
 *           type: number
 *           nullable: true
 *         workout:
 *           $ref: '#/components/schemas/Workout'
 *         exercise:
 *           $ref: '#/components/schemas/Exercise'
 *       required:
 *         - id
 *         - workoutId
 *         - exerciseId
 *         - sets
 *         - reps
 *
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         user:
 *           $ref: '#/components/schemas/User'
 *         title:
 *           type: string
 *         notes:
 *           type: string
 *           nullable: true
 *         scheduledAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/WorkoutStatus'
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkoutExercise'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - userId
 *         - title
 *         - status
 *         - createdAt
 *         - updatedAt
 */

router.post("/", authMiddleware, WorkoutController.create);

router.patch(
  "/:workoutId",
  authMiddleware,
  workoutOwnershipMiddleware,
  WorkoutController.update,
);

router.delete(
  "/:workoutId",
  authMiddleware,
  workoutOwnershipMiddleware,
  WorkoutController.delete,
);

router.patch(
  "/:workoutId/notes",
  authMiddleware,
  workoutOwnershipMiddleware,
  WorkoutController.addNotes,
);

router.patch(
  "/:workoutId/schedule",
  authMiddleware,
  workoutOwnershipMiddleware,
  WorkoutController.schedule,
);

router.get(
  "/reports",
  authMiddleware,
  WorkoutController.generateReport,
);

router.get(
  "/:workoutId",
  authMiddleware,
  workoutOwnershipMiddleware,
  WorkoutController.findById,
);

router.get("/", authMiddleware, WorkoutController.listUserWorkouts);



export default router;
