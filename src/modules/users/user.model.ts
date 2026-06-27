import { prisma } from '../../config/prisma';

export const UserModel = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });
  },

  create(data: {
    email: string;
    password: string;
    username: string | null;
  }) {
    return prisma.user.create({ data });
  },
};
