import express, { Request, Response } from "express";
import { authService } from "../service/auth.service";
import { usersService } from "../../users/service/users.service";

export const authRouter = express.Router();

// Login route
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    if (token) {
      res.status(200).send(token);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await usersService.createUser("user", email, password, "user");

    const token = await authService.login(email, password);

    if (token) {
      res.status(200).send(token);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Token verification route
authRouter.post("/verify", (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const decoded = authService.verifyToken(token);
    if (decoded) {
      res.status(200).json(decoded);
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
