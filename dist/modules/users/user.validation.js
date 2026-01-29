"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email("It has to be an email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    username: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email("It has to be an email"),
    password: zod_1.z.string(),
});
//# sourceMappingURL=user.validation.js.map