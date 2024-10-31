"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_service_1 = require("../service/auth.service");
const users_service_1 = require("../../users/service/users.service");
exports.authRouter = express_1.default.Router();
// Login route
exports.authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await auth_service_1.authService.login(email, password);
        if (token) {
            res.status(200).send(token);
        }
        else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.authRouter.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users_service_1.usersService.createUser("user", email, password, "user");
        const token = await auth_service_1.authService.login(email, password);
        if (token) {
            res.status(200).send(token);
        }
        else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Token verification route
exports.authRouter.post("/verify", (req, res) => {
    try {
        const { token } = req.body;
        const decoded = auth_service_1.authService.verifyToken(token);
        if (decoded) {
            res.status(200).json(decoded);
        }
        else {
            res.status(401).json({ error: "Invalid token" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//# sourceMappingURL=auth.controller.js.map