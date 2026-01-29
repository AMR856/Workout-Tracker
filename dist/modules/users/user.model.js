"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
exports.UserModel = {
    findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    },
    findById(id) {
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
    create(data) {
        return prisma.user.create({ data });
    },
};
//# sourceMappingURL=user.model.js.map