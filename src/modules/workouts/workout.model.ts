import { PrismaClient, WorkoutStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const WorkoutModel = {
  async createWorkout(data: {
    userId: string;
    title: string;
    notes?: string | undefined;
    scheduledAt?: Date | undefined;
    exercises: {
      exerciseId: string;
      sets: number;
      reps: number;
      weight?: number;
    }[];
  }) {
    console.log(data);
    return prisma.workout.create({
      data: {
        userId: data.userId,
        title: data.title,
        notes: data.notes ?? null,
        scheduledAt: data.scheduledAt ?? null,
        exercises: {
          create: data.exercises.map((e) => ({
            sets: e.sets,
            reps: e.reps,
            weight: e.weight ?? null,
            exercise: {
              connect: { id: e.exerciseId },
            },
          })),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });
  },

  async updateWorkout(
    workoutId: string,
    data: {
      title?: string | undefined;
      notes?: string | undefined;
      scheduledAt?: Date | undefined;
      status?: WorkoutStatus | undefined;
      exercises?: {
        exerciseId: string;
        sets: number;
        reps: number;
        weight?: number | undefined;
      }[];
    },
  ) {
    return prisma.$transaction(async (tx) => {
      if (data.exercises !== undefined) {
        await tx.workoutExercise.deleteMany({
          where: { workoutId },
        });

        await tx.workoutExercise.createMany({
          data: data.exercises.map((e) => ({
            workoutId,
            exerciseId: e.exerciseId,
            sets: e.sets,
            reps: e.reps,
            weight: e.weight ?? null,
          })),
        });
      }

      return tx.workout.update({
        where: { id: workoutId },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.notes !== undefined && { notes: data.notes ?? null }),
          ...(data.scheduledAt !== undefined && {
            scheduledAt: data.scheduledAt ?? null,
          }),
          ...(data.status !== undefined && { status: data.status }),
        },
        include: {
          exercises: {
            include: { exercise: true },
          },
        },
      });
    });
  },

  addNotes(workoutId: string, notes: string) {
    return prisma.workout.update({
      where: { id: workoutId },
      data: { notes },
    });
  },

  async deleteWorkout(workoutId: string) {
    return prisma.$transaction([
      prisma.workoutExercise.deleteMany({
        where: { workoutId },
      }),
      prisma.workout.delete({
        where: { id: workoutId },
      }),
    ]);
  },

  scheduleWorkout(workoutId: string, scheduledAt: Date) {
    return prisma.workout.update({
      where: { id: workoutId },
      data: {
        scheduledAt,
        status: WorkoutStatus.PENDING,
      },
    });
  },

  listUserWorkouts(userId: string, status?: WorkoutStatus) {
    return prisma.workout.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      orderBy: {
        scheduledAt: "asc",
      },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });
  },

  findById(workoutId: string) {
    return prisma.workout.findUnique({
      where: { id: workoutId },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });
  },

  updateWorkoutStatus(workoutId: string, status: WorkoutStatus) {
    return prisma.workout.update({
      where: { id: workoutId },
      data: { status },
    });
  },

  getWorkoutReport(
    userId: string,
    filters: { from?: Date | undefined; to?: Date | undefined; status?: WorkoutStatus| undefined },
  ) {
    return prisma.workout.findMany({
      where: {
        userId,
        ...(filters.status && { status: filters.status }),
        scheduledAt: {
          ...(filters.from && { gte: filters.from }),
          ...(filters.to && { lte: filters.to }),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
      orderBy: { scheduledAt: "asc" },
    });
  },
};
