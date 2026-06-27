import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "./user.model";
import CustomError from "../../types/customError";
import {
  LoginServiceInput,
  ProfileServiceInput,
  RegisterServiceInput,
} from "./user.type";
import { HttpStatusText } from "../../types/HTTPStatusText";

export class UserService {
  static async login(data: LoginServiceInput) {
    try {
      const user = await UserModel.findByEmail(data.email);
      if (!user) throw new CustomError("Invalid credentials", 401, HttpStatusText.FAIL);

      const valid = await bcrypt.compare(data.password, user.password);
      if (!valid) throw new CustomError("Invalid credentials", 401, HttpStatusText.FAIL);

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" },
      );
      return { email: user.email, username: user.username, token };
    } catch (err: any) {
      if (err instanceof CustomError) throw err;
      console.error("Login error:", err?.message);
      throw new CustomError("Login failed", 500, HttpStatusText.ERROR);
    }
  }

  static async register(data: RegisterServiceInput) {
    try {
      let user = await UserModel.findByEmail(data.email);
      if (!user) {
        const hashed = await bcrypt.hash(data.password, 8);
        user = await UserModel.create({
          email: data.email,
          password: hashed,
          username: data.username || null,
        });
      }
      return { id: user.id, email: user.email, username: user.username };
    } catch (err: any) {
      if (err instanceof CustomError) throw err;
      console.error("Register error:", err?.message);
      throw new CustomError("Registration failed", 500, HttpStatusText.ERROR);
    }
  }
  
  static async profile(data: ProfileServiceInput) {
    if (!data.userId) {
      throw new CustomError(
        "User id wasn't provided",
        400,
        HttpStatusText.FAIL,
      );
    }
    const user = await UserModel.findById(data.userId);
    if (!user) {
      throw new CustomError("User not found", 404, HttpStatusText.FAIL);
    }
    return user;
  }
}
