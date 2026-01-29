import { Request, Response, NextFunction } from "express";
import { RegisterInput, LoginInput } from "./user.validation.js";
export declare class UserController {
    static register(req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction): Promise<void>;
    static login(req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction): Promise<void>;
    static profile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map