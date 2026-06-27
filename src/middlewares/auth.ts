import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../types/customError";
import { HttpStatusText } from "../types/HTTPStatusText";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new CustomError("Unauthorized", 401, HttpStatusText.FAIL);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token!, process.env.JWT_SECRET!);
    res.locals.user = payload;
    next();
  } catch {
    throw new CustomError("Invalid token", 401, HttpStatusText.FAIL);
  }
}