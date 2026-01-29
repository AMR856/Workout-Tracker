import jwt from "jsonwebtoken";
export declare function signToken(user: {
    id: number;
    email: string;
}): string;
export declare function verifyToken(token: string): string | jwt.JwtPayload;
//# sourceMappingURL=jwt.d.ts.map