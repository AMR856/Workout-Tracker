import { WorkoutStatus } from "@prisma/client";
import {
  AddNotesInput,
  CreateWorkoutInput,
  GenerateReportInput,
  ListUserWorkoutsInput,
  ScheduleWorkoutInput,
  UpdateWorkoutInput,
  WorkoutIdInput,
} from "./workout.validation";
import { Request } from "express";

export interface CreateWorkoutRequest<
  P = {},
  ResBody = any,
  ReqBody = CreateWorkoutInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {
  user: { id: string };
}

export interface UpdateWorkoutRequest<
  P = { workoutId: string },
  ResBody = any,
  ReqBody = UpdateWorkoutInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface DeleteWorkoutRequest<
  P = { workoutId: string },
  ResBody = any,
  ReqBody = any,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface AddNotesRequset<
  P = { workoutId: string },
  ResBody = any,
  ReqBody = { notes: string },
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface ScheduleWorkoutRequest<
  P = { workoutId: string },
  ResBody = any,
  ReqBody = ScheduleWorkoutInput,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface FindWorkoutRequest<
  P = { workoutId: string },
  ResBody = any,
  ReqBody = any,
  Query = {},
> extends Request<P, ResBody, ReqBody, Query> {}

export interface GenerateReportRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  Query = { from?: string; to?: string; status?: WorkoutStatus },
> extends Request<P, ResBody, ReqBody, Query> {
  user: { id: string };
}

export interface ListUserWorkoutsRequest<
  P = { workoutId: string },
  ResBody = any,
  ReqBody = any,
  Query = { status: WorkoutStatus },
> extends Request<P, ResBody, ReqBody, Query> {
  user: { id: string };
}

export type CreateWorkoutServiceInput = CreateWorkoutInput & {
  userId: string;
};

export type UpdateWorkoutServiceInput = UpdateWorkoutInput & {
  workoutId: string;
};

export type DeleteWorkoutServiceInput = WorkoutIdInput;

export type AddNotesServiceInput = AddNotesInput & {
  workoutId: string;
};

export type ScheduleWorkoutServiceInput = ScheduleWorkoutInput & {
  workoutId: string;
};

export type FindWorkoutServiceInput = WorkoutIdInput;

export type GenerateReportServiceInput = { filters: GenerateReportInput } & {
  userId: string;
};

export type ListUserWorkoutsServiceInput =  ListUserWorkoutsInput & {
  userId: string;
};
