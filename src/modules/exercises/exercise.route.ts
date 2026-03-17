import { Router } from "express";
import { ExerciseController } from "./exercise.controller";
import { authMiddleware } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { ExerciseValidationSchema } from "./exercise.validation";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: Barbell Squat
 *         description:
 *           type: string
 *           example: A compound movement targeting legs
 *         category:
 *           type: string
 *           enum: [STRENGTH, CARDIO, FLEXIBILITY, FUNCTIONAL]
 *           example: STRENGTH
 *         muscleGroup:
 *           type: string
 *           enum: [CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, FOREARMS, LEGS, GLUTES, ABS, CARDIO]
 *           example: LEGS
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - name
 *         - description
 *         - category
 *         - muscleGroup
 *
 *     CreateExerciseInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Barbell Squat
 *         description:
 *           type: string
 *           example: A compound movement targeting legs
 *         category:
 *           type: string
 *           enum: [STRENGTH, CARDIO, FLEXIBILITY, FUNCTIONAL]
 *           example: STRENGTH
 *         muscleGroup:
 *           type: string
 *           enum: [CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, FOREARMS, LEGS, GLUTES, ABS, CARDIO]
 *           example: LEGS
 *       required:
 *         - name
 *         - description
 *         - category
 *         - muscleGroup
 *
 *     UpdateExerciseInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Barbell Squat
 *         description:
 *           type: string
 *           example: A compound movement targeting legs
 *         category:
 *           type: string
 *           enum: [STRENGTH, CARDIO, FLEXIBILITY, FUNCTIONAL]
 *           example: STRENGTH
 *         muscleGroup:
 *           type: string
 *           enum: [CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, FOREARMS, LEGS, GLUTES, ABS, CARDIO]
 *           example: LEGS
 */

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Get all exercises
 *     tags:
 *       - Exercises
 *     responses:
 *       200:
 *         description: List of all exercises
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
 *                     $ref: '#/components/schemas/Exercise'
 */
router.get("/", ExerciseController.findAll);

/**
 * @swagger
 * /exercises/{id}:
 *   get:
 *     summary: Get exercise by ID
 *     tags:
 *       - Exercises
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: Exercise found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       404:
 *         description: Exercise not found
 */
router.get("/:id", ExerciseController.findById);

/**
 * @swagger
 * /exercises/by-category:
 *   get:
 *     summary: Get exercises by category
 *     tags:
 *       - Exercises
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [STRENGTH, CARDIO, FLEXIBILITY, FUNCTIONAL]
 *         description: Exercise category
 *     responses:
 *       200:
 *         description: List of exercises in category
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
 *                     $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Invalid category
 */
router.get(
  "/by-category",
  validate(ExerciseValidationSchema.getByCategory, "query"),
  ExerciseController.findByCategory,
);

/**
 * @swagger
 * /exercises/by-muscle-group:
 *   get:
 *     summary: Get exercises by muscle group
 *     tags:
 *       - Exercises
 *     parameters:
 *       - in: query
 *         name: muscleGroup
 *         required: true
 *         schema:
 *           type: string
 *           enum: [CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, FOREARMS, LEGS, GLUTES, ABS, CARDIO]
 *         description: Muscle group
 *     responses:
 *       200:
 *         description: List of exercises for muscle group
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
 *                     $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Invalid muscle group
 */
router.get(
  "/by-muscle-group",
  validate(ExerciseValidationSchema.getByMuscleGroup, "query"),
  ExerciseController.findByMuscleGroup,
);

/**
 * @swagger
 * /exercises:
 *   post:
 *     summary: Create a new exercise (admin only)
 *     tags:
 *       - Exercises
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExerciseInput'
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authMiddleware,
  validate(ExerciseValidationSchema.create),
  ExerciseController.create,
);

/**
 * @swagger
 * /exercises/{id}:
 *   put:
 *     summary: Update exercise (admin only)
 *     tags:
 *       - Exercises
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Exercise ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExerciseInput'
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */
router.put(
  "/:id",
  authMiddleware,
  validate(ExerciseValidationSchema.update),
  ExerciseController.update,
);

/**
 * @swagger
 * /exercises/{id}:
 *   delete:
 *     summary: Delete exercise (admin only)
 *     tags:
 *       - Exercises
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: Exercise deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */
router.delete("/:id", authMiddleware, ExerciseController.delete);

export default router;