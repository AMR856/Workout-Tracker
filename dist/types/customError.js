"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    statusCode;
    isJoi;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        // Restore prototype chain for `instanceof` to work
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.default = CustomError;
//# sourceMappingURL=customError.js.map