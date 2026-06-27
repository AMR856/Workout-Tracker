import { ExerciseCategory, MuscleGroup } from '@prisma/client';
import { prisma } from '../../config/prisma';


export const ExerciseModel = {
  create(data: {
    name: string;
    description: string;
    category: ExerciseCategory;
    muscleGroup: MuscleGroup;
  }) {
    return prisma.exercise.create({
      data,
    });
  },

  findAll() {
    return prisma.exercise.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.exercise.findUnique({
      where: { id },
    });
  },

  findByCategory(category: ExerciseCategory) {
    return prisma.exercise.findMany({
      where: { category },
    });
  },

  findByMuscleGroup(muscleGroup: MuscleGroup) {
    return prisma.exercise.findMany({
      where: { muscleGroup },
    });
  },

  update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      category: ExerciseCategory;
      muscleGroup: MuscleGroup;
    }>
  ) {
    return prisma.exercise.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.exercise.delete({
      where: { id },
    });
  },
};