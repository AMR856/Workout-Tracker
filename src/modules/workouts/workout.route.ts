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

/**
 * @swagger
 * /workouts:
 *   post:
 *     summary: Create a new workout
 *     description: >
 *       Creates a new workout for the authenticated user with a list of exercises.
 *       Each exercise is linked to an existing exercise by ID.
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Push Day Workout
 *               notes:
 *                 type: string
 *                 example: Focus on progressive overload
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-02-10T18:00:00.000Z
 *               exercises:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   properties:
 *                     exerciseId:
 *                       type: string
 *                       format: uuid
 *                       example: ae2bd07c-9acf-4a74-8c9a-23c5daa3fed4
 *                     sets:
 *                       type: integer
 *                       example: 4
 *                     reps:
 *                       type: integer
 *                       example: 10
 *                     weight:
 *                       type: number
 *                       nullable: true
 *                       example: 80
 *                   required:
 *                     - exerciseId
 *                     - sets
 *                     - reps
 *             required:
 *               - title
 *               - exercises
 *     responses:
 *       201:
 *         description: Workout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post("/", authMiddleware, WorkoutController.create);

/**
 * @swagger
 * /workouts/{workoutId}:
 *   patch:
 *     summary: Update a workout
 *     description: >
 *       Updates workout details such as title, notes, status, schedule, or exercises.
 *       If exercises are provided, existing exercises are fully replaced.
 *       Ownership is validated via middleware.
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the workout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Push Day
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: Reduced volume this session
 *               status:
 *                 $ref: '#/components/schemas/WorkoutStatus'
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: 2026-02-20T19:00:00.000Z
 *               exercises:
 *                 type: array
 *                 description: >
 *                   If provided, replaces all existing exercises for the workout.
 *                 items:
 *                   type: object
 *                   properties:
 *                     exerciseId:
 *                       type: string
 *                       format: uuid
 *                       example: 91dc8299-1f0d-4ae5-be46-36dc0aa21c5e
 *                     sets:
 *                       type: integer
 *                       example: 4
 *                     reps:
 *                       type: integer
 *                       example: 8
 *                     weight:
 *                       type: number
 *                       nullable: true
 *                       example: 75
 *                   required:
 *                     - exerciseId
 *                     - sets
 *                     - reps
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Internal server error
 */


router.patch(
  "/:workoutId",
  authMiddleware,
  workoutOwnershipMiddleware,
  WorkoutController.update,
);

/**
 * @swagger
 * /workouts/{workoutId}:
 *   delete:
 *     summary: Delete a workout
 *     description: >
 *       Deletes a workout owned by the authenticated user.
 *       Ownership is validated via middleware.
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the workout to delete
 *     responses:
 *       204:
 *         description: Workout deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Internal server error
 */


router.delete(
  "/:workoutId",
  authMiddleware,
  workoutOwnershipMiddleware,
  WorkoutController.delete,
);

/**
 * @swagger
 * /workouts/{workoutId}/notes:
 *   patch:
 *     summary: Add or update workout notes
 *     description: >
 *       Adds or updates notes for a workout owned by the authenticated user.
 *       Ownership is validated via middleware.
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the workout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: Felt strong today, increase weight next session
 *             required:
 *               - notes
 *     responses:
 *       200:
 *         description: Workout notes updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Internal server error
 */


router.patch(
  "/:workoutId/notes",
  authMiddleware,
  workoutOwnershipMiddleware,
  WorkoutController.addNotes,
);

/**
 * @swagger
 * /workouts/{workoutId}/schedule:
 *   patch:
 *     summary: Schedule a workout
 *     description: >
 *       Schedules a workout at a specific date and time.
 *       This action also resets the workout status to PENDING.
 *       Ownership is validated via middleware.
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the workout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-02-15T18:30:00.000Z
 *             required:
 *               - scheduledAt
 *     responses:
 *       200:
 *         description: Workout scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Internal server error
 */


router.patch(
  "/:workoutId/schedule",
  authMiddleware,
  workoutOwnershipMiddleware,
  WorkoutController.schedule,
);

/**
 * @swagger
 * /workouts/reports:
 *   get:
 *     summary: Get workout report
 *     description: >
 *       Retrieves a detailed workout report for the authenticated user.
 *       Filters are optional and can be used independently.
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: >
 *           Start date (inclusive). If omitted, results are not filtered by start date.
 *         example: 2026-01-01T00:00:00.000Z
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: >
 *           End date (inclusive). If omitted, results are not filtered by end date.
 *         example: 2026-02-01T23:59:59.999Z
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/WorkoutStatus'
 *         description: Filter workouts by status
 *     responses:
 *       200:
 *         description: Workout report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */



router.get(
  "/reports",
  authMiddleware,
  WorkoutController.generateReport,
);

/**
 * @swagger
 * /workouts/{workoutId}:
 *   get:
 *     summary: Get workout by ID
 *     description: >
 *       Retrieves a single workout by its ID.
 *       Ownership is validated via middleware.
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the workout
 *     responses:
 *       200:
 *         description: Workout retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Internal server error
 */


router.get(
  "/:workoutId",
  authMiddleware,
  workoutOwnershipMiddleware,
  WorkoutController.findById,
);

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: List user workouts
 *     description: >
 *       Retrieves all workouts for the authenticated user.
 *       Results can optionally be filtered by workout status.
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           $ref: '#/components/schemas/WorkoutStatus'
 *         description: Filter workouts by status
 *     responses:
 *       200:
 *         description: Workouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get("/", authMiddleware, WorkoutController.listUserWorkouts);

export default router;
