"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_js_1 = require("./user.service.js");
const user_validation_js_1 = require("./user.validation.js");
class UserController {
    static async register(req, res, next) {
        try {
            const data = user_validation_js_1.registerSchema.parse(req.body);
            const user = await user_service_js_1.UserService.register(data);
            res.status(201).json({
                status: "success",
                data: user,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async login(req, res, next) {
        try {
            const data = user_validation_js_1.loginSchema.parse(req.body);
            const result = await user_service_js_1.UserService.login(data);
            res.json({
                status: "success",
                data: result,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async profile(req, res, next) {
        try {
            const userId = req.user?.id;
            const user = await user_service_js_1.UserService.profile(userId);
            res.json({
                status: "success",
                data: user,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map