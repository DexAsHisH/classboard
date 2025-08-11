import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const client = new PrismaClient();

type JwtPayload = {
  id: number;
  email: string;
};

export const protectedAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token" });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "Internal server error" });
    }
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = await client.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid User" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
