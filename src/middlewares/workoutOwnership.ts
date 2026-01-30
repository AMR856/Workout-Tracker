import { Request, Response, NextFunction } from "express";
import CustomError from "../types/customError";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function workoutOwnershipMiddleware(
  req: Request<{ workoutId: string }>,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id;
  const { workoutId } = req.params;

  if (!userId) {
    return next(new CustomError("Unauthorized", 401));
  }

  const workout = await prisma.workout.findFirst({
    where: {
      id: workoutId,
      userId,
    },
  });

  if (!workout) {
    return next(new CustomError("Workout not found", 404));
  }

  // Optional: attach workout for reuse
  (req as any).workout = workout;

  next();
}