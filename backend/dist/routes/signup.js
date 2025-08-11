import { PrismaClient } from "@prisma/client";
import Router from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const client = new PrismaClient();
const router = Router();
router.post('/signup', async (req, res) => {
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
        const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        return res.status(201).json({ message: 'Signup successful', user });
    }
    catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=signup.js.map