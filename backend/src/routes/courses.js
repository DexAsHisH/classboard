import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const client = new PrismaClient();
const router = Router();


router.get("/courses", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { id } = req.user;

  try {
    const student = await client.student.findUnique({
      where: {
        userId: id,
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student record not found" });
    }
    const courses = await client.course.findMany({
      where: {
        studentId: student.id,
      },
    });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});
router.post("/courses", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { courseName, courseCode, studentGrade, creditUnits, gradePoints } =
    req.body;

  if (
    !courseName ||
    !courseCode ||
    !studentGrade ||
    !creditUnits ||
    !gradePoints
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const student = await client.student.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const course = await client.course.create({
      data: {
        courseName,
        courseCode,
        studentGrade,
        creditUnits,
        gradePoints,
        studentId: student.id,
      },
    });

    res.status(201).json(course);
  } catch (error) {
    if (isPrismaError(error) && error.code === "P2002") {
      return res.status(400).json({ error: "Course code already exists" });
    }

    res.status(500).json({ error: "Failed to create course" });
  }
});
function isPrismaError(error) {
  return typeof error === "object" && error !== null && "code" in error;
}

export default router;
