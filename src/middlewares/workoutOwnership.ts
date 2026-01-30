import { Request, Response, NextFunction } from "express";
import CustomError from "../types/customError";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function workoutOwnershipMiddleware(
  req: Request<{ workoutId: string }>,
  res: Response,
  next: NextFunction,
) {
  console.log(req.method);
  console.log(req.url);
  console.log(req);
  const userId = (req as any).user?.id;
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

  (req as any).workout = workout;

  next();
}