import Router from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const router = Router();
const client = new PrismaClient();
router.get("/auth/me", (req, res) => {
    res.json({ user: req.user });
});
router.get("/student/me", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { id: userId } = req.user;
    const student = await client.student.findUnique({
        where: { userId: userId },
        select: {
            name: true,
            user: {
                select: {
                    email: true,
                },
            },
        },
    });
    if (!student || !student.user) {
        return res.status(404).json({ error: "Student not found" });
    }
    res.json({ name: student.name, email: student.user.email });
});
router.put("/student/me", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { id: userId } = req.user;
    const { name, email, phone } = req.body;
    const student = await client.student.update({
        where: { userId: userId },
        data: {
            name: name,
            phoneNumber: phone,
            user: {
                update: {
                    email: email,
                },
            },
        },
    });
    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Profile updated successfully" });
});
router.put("/student/password", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { id: userId } = req.user;
    const { password } = req.user;
    const { currentPassword, newPassword } = req.body;
    const checkPassword = await bcrypt.compare(currentPassword, password);
    if (!checkPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const user = await client.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const result = await client.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
    });
    res.json({ message: "Password updated successfully", user: result });
});
export default router;
//# sourceMappingURL=me.js.map