import { Request, Response, NextFunction } from "express";
import CustomError from "../types/customError";
import { PrismaClient } from "@prisma/client";
import { HttpStatusText } from "../types/HTTPStatusText";

const prisma = new PrismaClient();

export async function workoutOwnershipMiddleware(
  req: Request<{ workoutId: string }>,
  res: Response,
  next: NextFunction,
) {
  const userId = res.locals.user.id;
  const { workoutId } = req.params;

  if (!userId) {
    return next(new CustomError("Unauthorized", 401, HttpStatusText.FAIL));
  }

  const workout = await prisma.workout.findFirst({
    where: {
      id: workoutId,
      userId,
    },
  });

  if (!workout) {
    return next(new CustomError("Workout not found", 404, HttpStatusText.FAIL));
  }

  res.locals.workout = workout;

  next();
}