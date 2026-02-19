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
  static async register(data: RegisterServiceInput) {
    let user = await UserModel.findByEmail(data.email);

    if (!user) {
      const hashed = await bcrypt.hash(data.password, 10);

      user = await UserModel.create({
        email: data.email,
        password: hashed,
        username: data.username,
      });
    }
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
  static async login(data: LoginServiceInput) {
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      throw new CustomError("Invalid credentials", 401, HttpStatusText.FAIL);
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new CustomError("Invalid credentials", 401, HttpStatusText.FAIL);
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    return {
      email: user.email,
      username: user.username,
      token,
    };
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
