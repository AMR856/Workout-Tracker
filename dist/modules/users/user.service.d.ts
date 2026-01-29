import { LoginInput, RegisterInput } from "./user.validation.js";
export declare class UserService {
    static register(data: RegisterInput): Promise<{
        id: any;
        username: any;
    }>;
    static login(data: LoginInput): Promise<{
        token: string;
    }>;
    static profile(userId: string | undefined): Promise<any>;
}
//# sourceMappingURL=user.service.d.ts.map