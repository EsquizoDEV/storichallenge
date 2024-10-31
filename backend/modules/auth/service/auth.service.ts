import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, usersService } from "../../users/service/users.service"; // Adjust the path as needed

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use a secure secret in production
const JWT_EXPIRES_IN = "1h"; // Token expiration time

interface JwtPayload {
  email: string;
  role: "user" | "admin";
}

class AuthService {
  constructor() {}

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: User } | null> {
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const token = this.generateToken(user);
    return { token, user };
  }

  private generateToken(user: { email: string; role: string }): string {
    const payload: JwtPayload = {
      email: user.email,
      role: user.role as "user" | "admin",
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return token;
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
