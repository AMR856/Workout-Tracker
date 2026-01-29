import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "./user.model";
import CustomError from "../../types/customError";
import { LoginInput, RegisterInput } from "./user.validation";

export class UserService {
  static async register(data: RegisterInput) {
    const existing = await UserModel.findByEmail(data.email);
    if (existing) {
      throw new CustomError("User already exists", 409);
    }
    const hashed = await bcrypt.hash(data.password, 10);

    const user = await UserModel.create({
      email: data.email,
      password: hashed,
      username: data.username
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  static async login(data: LoginInput) {
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      throw new CustomError("Invalid credentials", 401);
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new CustomError("Invalid credentials", 401);
    }
    console.log(user);
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return { token };
  }

  static async profile(userId: string | undefined) {
    if (!userId){
      throw new CustomError("User id wasn't provided", 400);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return user;
  }
}
