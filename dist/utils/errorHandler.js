"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode ?? 500;
    let message = err.message ?? "Internal Server Error";
    if (err.isJoi)
        statusCode = 400;
    if (err.name === "JsonWebTokenError")
        statusCode = 401;
    res.status(statusCode).json({
        status: "error",
        message,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map