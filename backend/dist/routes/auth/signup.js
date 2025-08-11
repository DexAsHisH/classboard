import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import Router from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();
const client = new PrismaClient();
const router = Router();
router.post("/signup", async (req, res) => {
    const { email, password, fullname, programName, joiningYear, discipline, phoneNumber, } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await client.user.create({
            data: {
                email,
                password: hashedPassword,
                student: {
                    create: {
                        name: fullname,
                        ProgramName: programName,
                        joiningYear: parseInt(joiningYear),
                        discipline,
                        phoneNumber,
                    },
                },
            },
            include: {
                student: true,
            },
        });
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: "Internal server error" });
        }
        const token = jwt.sign({ email: user.email, id: user.id }, jwtSecret, {
            expiresIn: "1d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({ message: "Signup successful", user });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
export default router;
//# sourceMappingURL=signup.js.map