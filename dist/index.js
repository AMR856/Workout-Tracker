"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorHandler_1 = require("./utils/errorHandler");
const user_route_1 = __importDefault(require("./modules/users/user.route"));
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(errorHandler_1.errorHandler);
app.use(body_parser_1.default.json());
app.use("/users", user_route_1.default);
// npx nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts
app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
//# sourceMappingURL=index.js.map