"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_service_1 = require("../../users/service/users.service"); // Adjust the path as needed
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use a secure secret in production
const JWT_EXPIRES_IN = "1h"; // Token expiration time
class AuthService {
    constructor() { }
    async login(email, password) {
        const user = await users_service_1.usersService.getUserByEmail(email);
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        const token = this.generateToken(user);
        return { token, user };
    }
    generateToken(user) {
        const payload = {
            email: user.email,
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return token;
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map