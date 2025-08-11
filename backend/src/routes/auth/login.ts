import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import Router from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../../schemas/loginSchema.js";
import { protectedAuth } from "../../middleware/protectedAuth.js";

dotenv.config();

const client = new PrismaClient();
const router = Router();

router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(401)
      .json({ errors: result.error });
  }

  const { email, password } = result.data;

  try {
    const user = await client.user.findUnique({
      where: {
        email: email,
      },
      include: {
        student: true,
      },
    });
    if (!user) {
      return res.status(404).json();
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json();
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "Internal server error" });
    }
    const token = jwt.sign({ email: user.email, id: user.id }, jwtSecret, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.student?.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  return res.status(200).json({ message: "Logout successful" });
});

router.get("/auth/me", protectedAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
