import { EditCourse } from "@/components/main/EditCourse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

type Course = {
  courseCode: string | null | undefined;
  courseName: string | null | undefined;
  creditUnits: number | null | undefined;
  studentGrade: string | null | undefined;
  gradePoints: number | null | undefined;
};

export const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGradeColorClass = (grade: string | null | undefined): string => {
    if (!grade) return "bg-neutral-100 text-neutral-600 border-neutral-200";

    const gradeUpper = grade.toUpperCase();
    if (gradeUpper.startsWith("A"))
      return "bg-green-50 text-green-700 border-green-200";
    if (gradeUpper.startsWith("B"))
      return "bg-blue-50 text-blue-700 border-blue-200";
    if (gradeUpper.startsWith("C"))
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (gradeUpper.startsWith("D"))
      return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const calculateStats = () => {
    const validCourses = courses.filter(
      (course) =>
        course.creditUnits &&
        course.gradePoints !== null &&
        course.gradePoints !== undefined
    );

    const totalCredits = validCourses.reduce(
      (sum, course) => sum + (course.creditUnits || 0),
      0
    );
    const totalGradePoints = validCourses.reduce(
      (sum, course) =>
        sum + (course.gradePoints || 0) * (course.creditUnits || 0),
      0
    );
    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    const gradeDistribution = courses.reduce(
      (acc, course) => {
        const grade = course.studentGrade?.toUpperCase();
        if (grade) {
          if (grade.startsWith("A")) acc.A++;
          else if (grade.startsWith("B")) acc.B++;
          else if (grade.startsWith("C")) acc.C++;
          else if (grade.startsWith("D")) acc.D++;
          else acc.F++;
        }
        return acc;
      },
      { A: 0, B: 0, C: 0, D: 0, F: 0 }
    );

    const highPerformance = gradeDistribution.A + gradeDistribution.B;
    const completionRate =
      Math.round(
        (courses.filter((c) => c.studentGrade).length / courses.length) * 100
      ) || 0;

    return {
      totalCredits,
      gpa,
      gradeDistribution,
      totalCourses: courses.length,
      highPerformance,
      completionRate,
    };
  };

  const stats = calculateStats();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/api/courses`, {
          withCredentials: true,
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }

        setCourses(response.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-3 sm:p-6 overflow-auto min-h-screen">
        <div className="flex items-center justify-center h-64 sm:h-full">
          <div className="flex flex-col items-center space-y-4">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400 animate-pulse" />
            <div className="text-neutral-400 text-sm sm:text-md">
              Loading courses...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-3 sm:p-6 overflow-auto min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 sm:px-4 py-2 rounded-md border border-red-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs sm:text-sm">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-3 sm:p-6 overflow-auto min-h-screen">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600" />
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-neutral-300">
                Courses
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage and track your academic progress
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs text-neutral-400">Current GPA</p>
              <p className="text-lg font-medium text-neutral-100">
                {stats.gpa.toFixed(2)}
              </p>
            </div>
            <EditCourse />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Total Courses</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {stats.totalCourses}
          </p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">GPA</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {stats.gpa.toFixed(2)}
          </p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Credits</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {stats.totalCredits}
          </p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-900">A+B Grades</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {stats.highPerformance}
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-sm mb-4 sm:mb-6">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-neutral-800">
          <h2 className="text-base sm:text-lg font-medium text-neutral-300">
            Course Details
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Overview of all your enrolled courses
          </p>
        </div>

        <div className="block sm:hidden">
          {courses.length === 0 ? (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <BookOpen className="w-8 h-8 text-neutral-300" />
                <div>
                  <p className="text-neutral-300 font-medium">
                    No courses found
                  </p>
                  <p className="text-neutral-300 text-sm">
                    Add your first course to get started
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {courses.map((course, index) => (
                <div
                  key={course.courseCode || `course-${index}`}
                  className="bg-neutral-800 rounded-lg p-3 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-300 text-sm truncate">
                        {course.courseName || "N/A"}
                      </h3>
                      <code className="bg-neutral-300 px-2 py-1 rounded text-xs font-mono text-neutral-900 inline-block mt-1">
                        {course.courseCode || "N/A"}
                      </code>
                    </div>
                    <div className="text-right ml-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getGradeColorClass(
                          course.studentGrade
                        )}`}
                      >
                        {(course.studentGrade ?? "") || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Credits: {course.creditUnits || "N/A"}</span>
                    <span>
                      Points:{" "}
                      {course.gradePoints != null
                        ? course.gradePoints.toFixed(2)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-900">
                <TableHead className="text-neutral-300 font-medium">
                  Course Name
                </TableHead>
                <TableHead className="text-neutral-300 font-medium">
                  Course Code
                </TableHead>
                <TableHead className="text-center text-neutral-300 font-medium">
                  Credits
                </TableHead>
                <TableHead className="text-center text-neutral-300 font-medium">
                  Grade
                </TableHead>
                <TableHead className="text-center text-neutral-300 font-medium">
                  Points
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <BookOpen className="w-8 h-8 text-neutral-300" />
                      <div>
                        <p className="text-neutral-300 font-medium">
                          No courses found
                        </p>
                        <p className="text-neutral-300 text-sm">
                          Add your first course to get started
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course, index) => (
                  <TableRow
                    key={course.courseCode || `course-${index}`}
                    className="hover:bg-neutral-800"
                  >
                    <TableCell className="font-medium text-neutral-300">
                      {course.courseName || "N/A"}
                    </TableCell>
                    <TableCell className="text-neutral-900">
                      <code className="bg-neutral-300 px-2 py-1 rounded text-xs font-mono">
                        {course.courseCode || "N/A"}
                      </code>
                    </TableCell>
                    <TableCell className="text-center text-neutral-300">
                      {course.creditUnits || "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getGradeColorClass(
                          course.studentGrade
                        )}`}
                      >
                        {(course.studentGrade ?? "") || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-neutral-300 font-mono text-sm">
                      {course.gradePoints != null
                        ? course.gradePoints.toFixed(2)
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {courses.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-900 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-neutral-300 mb-3 sm:mb-4">
            Grade Distribution
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
            {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
              <div
                key={grade}
                className="text-center bg-neutral-800 rounded-lg p-3"
              >
                <div className="text-lg sm:text-xl font-medium text-neutral-300">
                  {count}
                </div>
                <div className="text-xs text-neutral-500">
                  {grade} Grade{count !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
