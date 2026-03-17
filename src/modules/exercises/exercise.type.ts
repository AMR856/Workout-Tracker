import { CreateExerciseInput, GetByCategoryInput, GetByMuscleGroupInput, UpdateExerciseInput } from "./exercise.validation";
import { Request } from "express";

export interface CreateExerciseRequest<
  P = {},
  ResBody = any,
  ReqBody = CreateExerciseInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface UpdateExerciseRequest<
  P = { id: string },
  ResBody = any,
  ReqBody = UpdateExerciseInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface GetExerciseByIdRequest<
  P = { id: string },
  ResBody = any,
  ReqBody = any,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface GetExerciseByCategory<
  P = {},
  ResBody = any,
  ReqBody = any,
  Query = GetByCategoryInput,
> extends Request<P, ResBody, ReqBody, Query> {}

export interface GetExerciseByMuscleGroupRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  Query = GetByMuscleGroupInput,
> extends Request<P, ResBody, ReqBody, Query> {}

export interface DeleteExerciseRequest<
  P = { id: string },
  ResBody = any,
  ReqBody = any,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}
