import { PrismaClient } from "@prisma/client";
import Router from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginSchema } from "../schemas/loginSchema.js";
const client = new PrismaClient();
const router = Router();
router.post('/login', async (req, res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: 'Invalid request data', errors: result.error });
    }
    const { email, password } = result.data;
    try {
        const user = await client.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ message: 'Login successful' });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
});
export default router;
//# sourceMappingURL=login.js.map