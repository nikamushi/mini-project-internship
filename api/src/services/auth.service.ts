import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";
import { activityLogService } from "./activity-log.service";

function publicUser(user: { id: number; name: string; email: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function signToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const email = input.email.toLowerCase().trim();
    const existing = await userRepository.findByEmail(email);
    if (existing) throw ApiError.conflict("Email sudah terdaftar.", "EMAIL_ALREADY_EXISTS");

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await userRepository.create({
      name: input.name.trim(),
      email,
      passwordHash,
    });
    return { user: publicUser(user), token: signToken(user.id) };
  },

  async login(input: { email: string; password: string }) {
    const user = await userRepository.findByEmail(input.email.toLowerCase().trim());
    const valid =
      user && user.isActive && (await bcrypt.compare(input.password, user.passwordHash));

    if (!valid)
      throw ApiError.unauthorized("Email atau password tidak valid.", "INVALID_CREDENTIALS");

    await activityLogService.createLog({
      actorId: user.id,
      action: "USER_LOGIN",
      entity: "USER",
      entityId: user.id,
    });
    return { user: publicUser(user), token: signToken(user.id) };
  },

  async me(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.unauthorized();
    return publicUser(user);
  },
};
