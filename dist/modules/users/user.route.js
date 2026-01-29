"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_js_1 = require("../../middlewares/auth.js");
const router = (0, express_1.Router)();
router.post("/register", user_controller_1.UserController.register);
router.post("/login", user_controller_1.UserController.login);
router.get("/profile", auth_js_1.authMiddleware, user_controller_1.UserController.profile);
exports.default = router;
//# sourceMappingURL=user.route.js.map