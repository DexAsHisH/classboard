import { PrismaClient } from "@prisma/client";
import Router from "express";

const client = new PrismaClient();
const router = Router();

router.get("/dashboard/me", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const user = await client.student.findUnique({
      where: { userId: userId },
      include: { user: true },
    });

    if (!user || !user.user) {
      return res
        .status(404)
        .json({ message: "User or student profile not found" });
    }

    const responseData = {
      name: user.name,
      email: user.user?.email || req.user.email,
      phone: user.phoneNumber,
      ProgramName: user.ProgramName,
      joiningYear: user.joiningYear,
      discipline: user.discipline,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as any).message
          : String(error),
    });
  }
});

router.get("/dashboard/guardian", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    console.log("User ID:", userId);

    const user = await client.student.findUnique({
      where: { userId: userId },
      include: { user: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User or student profile not found" });
    }

    const guardianData = {
      name: user.guardianName,
      email: user.guardianEmail,
      phone: user.guardianPhone,
    };

    return res.status(200).json(guardianData);
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error:
        typeof err === "object" && err !== null && "message" in err
          ? (err as any).message
          : String(err),
    });
  }
});

router.put("/dashboard/guardian", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userId = req.user.id;

    const updatedGuardian = await client.student.update({
      where: { userId: userId },
      data: {
        guardianName: name,
        guardianEmail: email,
        guardianPhone: phone,
      },
    });

    return res.status(200).json(updatedGuardian);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
