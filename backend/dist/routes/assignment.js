import { PrismaClient } from "@prisma/client";
import Router from "express";
const client = new PrismaClient();
const router = Router();
router.get("/assignments", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }
        const student = await client.student.findUnique({
            where: {
                userId: userId,
            },
            select: {
                id: true,
            },
        });
        if (!student) {
            return res.status(404).json({ error: "Student profile not found." });
        }
        const assignments = await client.assignment.findMany({
            where: {
                course: {
                    studentId: student.id,
                },
            },
            include: {
                course: {
                    select: {
                        id: true,
                        courseCode: true,
                        courseName: true,
                    },
                },
            },
            orderBy: [
                {
                    status: "asc",
                },
                {
                    id: "desc",
                },
            ],
        });
        const formattedAssignments = assignments.map((assignment) => ({
            id: assignment.id,
            title: assignment.title,
            status: assignment.status,
            courseId: assignment.courseId,
            course: {
                id: assignment.course.id,
                courseCode: assignment.course.courseCode,
                courseName: assignment.course.courseName,
            },
        }));
        res.status(200).json(formattedAssignments);
    }
    catch (error) {
        res.status(500).json({
            error: "Internal server error while fetching assignments.",
            details: error instanceof Error ? error.message : undefined,
        });
    }
});
router.post("/assignments", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }
        const { title, courseId, status } = req.body;
        if (!title || !courseId) {
            return res.status(400).json({
                error: "Missing required fields. Title and Course ID are required.",
            });
        }
        if (status && !["ONGOING", "COMPLETED"].includes(status)) {
            return res.status(400).json({
                error: "Invalid status. Status must be either 'ONGOING' or 'COMPLETED'.",
            });
        }
        const student = await client.student.findUnique({
            where: {
                userId: userId,
            },
            select: {
                id: true,
            },
        });
        if (!student) {
            return res.status(404).json({ error: "Student profile not found." });
        }
        const course = await client.course.findFirst({
            where: {
                id: parseInt(courseId),
                studentId: student.id,
            },
            select: {
                id: true,
                courseCode: true,
                courseName: true,
            },
        });
        if (!course) {
            return res.status(404).json({
                error: "Course not found or does not belong to the current student.",
            });
        }
        const newAssignment = await client.assignment.create({
            data: {
                title: title.trim(),
                status: status || "ONGOING",
                courseId: parseInt(courseId),
            },
            include: {
                course: {
                    select: {
                        id: true,
                        courseCode: true,
                        courseName: true,
                    },
                },
            },
        });
        const formattedAssignment = {
            id: newAssignment.id,
            title: newAssignment.title,
            status: newAssignment.status,
            courseId: newAssignment.courseId,
            course: {
                id: newAssignment.course.id,
                courseCode: newAssignment.course.courseCode,
                courseName: newAssignment.course.courseName,
            },
        };
        res.status(201).json(formattedAssignment);
    }
    catch (error) {
        if (typeof error === "object" && error !== null && "code" in error) {
            const prismaError = error;
            if (prismaError.code === "P2002") {
                return res.status(400).json({
                    error: "An assignment with similar details already exists.",
                });
            }
            if (prismaError.code === "P2003") {
                return res.status(400).json({
                    error: "Invalid course ID provided.",
                });
            }
        }
        res.status(500).json({
            error: "Internal server error while creating assignment.",
            details: error instanceof Error ? error.message : undefined,
        });
    }
});
export default router;
//# sourceMappingURL=assignment.js.map