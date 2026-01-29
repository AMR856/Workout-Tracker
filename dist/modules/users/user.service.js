"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_js_1 = require("./user.model.js");
const customError_js_1 = __importDefault(require("../../types/customError.js"));
class UserService {
    static async register(data) {
        const existing = await user_model_js_1.UserModel.findByEmail(data.email);
        if (existing) {
            throw new customError_js_1.default("User already exists", 409);
        }
        const hashed = await bcrypt_1.default.hash(data.password, 10);
        const user = await user_model_js_1.UserModel.create({
            email: data.email,
            password: hashed,
            username: data.username
        });
        return {
            id: user.id,
            username: user.email,
        };
    }
    static async login(data) {
        const user = await user_model_js_1.UserModel.findByEmail(data.email);
        if (!user) {
            throw new customError_js_1.default("Invalid credentials", 401);
        }
        const valid = await bcrypt_1.default.compare(data.password, user.password);
        if (!valid) {
            throw new customError_js_1.default("Invalid credentials", 401);
        }
        const token = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return { token };
    }
    static async profile(userId) {
        if (!userId) {
            throw new customError_js_1.default("User id wasn't provided", 400);
        }
        const user = await user_model_js_1.UserModel.findById(Number.parseInt(userId));
        if (!user) {
            throw new customError_js_1.default("User not found", 404);
        }
        return user;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map