const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const UserModel = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },
// f055342b-2f6f-457f-acb6-28c4639de87f
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
    username: string | undefined;
  }) {
    return prisma.user.create({ data });
  },
};
