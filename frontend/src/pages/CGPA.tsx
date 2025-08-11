import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  GraduationCap,
  TrendingUp,
  Award,
  BookOpen,
  Calculator,
  Target,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

type Course = {
  courseCode: string | null | undefined;
  courseName: string | null | undefined;
  creditUnits: number | null | undefined;
  studentGrade: string | null | undefined;
  gradePoints: number | null | undefined;
};

type CGPAStats = {
  totalCreditUnits: number;
  totalGradePoints: number;
  cgpa: number;
  completedCourses: number;
  totalCourses: number;
};

const CGPA = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cgpaStats, setCgpaStats] = useState<CGPAStats>({
    totalCreditUnits: 0,
    totalGradePoints: 0,
    cgpa: 0,
    completedCourses: 0,
    totalCourses: 0,
  });

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

  const getCGPAGrade = (cgpa: number): { grade: string; color: string } => {
    if (cgpa >= 9.0) return { grade: "A+", color: "text-green-500" };
    if (cgpa >= 8.0) return { grade: "A", color: "text-green-400" };
    if (cgpa >= 7.0) return { grade: "B+", color: "text-blue-400" };
    if (cgpa >= 6.0) return { grade: "B", color: "text-blue-300" };
    if (cgpa >= 5.0) return { grade: "C", color: "text-yellow-400" };
    return { grade: "D", color: "text-orange-400" };
  };

  const calculateCGPA = (coursesData: Course[]): CGPAStats => {
    const completedCourses = coursesData.filter(
      (course) =>
        course.studentGrade &&
        course.gradePoints !== null &&
        course.gradePoints !== undefined
    );

    const totalCreditUnits = completedCourses.reduce(
      (sum, course) => sum + (course.creditUnits || 0),
      0
    );

    const totalGradePoints = completedCourses.reduce(
      (sum, course) =>
        sum + (course.gradePoints || 0) * (course.creditUnits || 0),
      0
    );

    const cgpa = totalCreditUnits > 0 ? totalGradePoints / totalCreditUnits : 0;

    return {
      totalCreditUnits,
      totalGradePoints,
      cgpa: Math.round(cgpa * 100) / 100,
      completedCourses: completedCourses.length,
      totalCourses: coursesData.length,
    };
  };

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

        const coursesData = response.data;
        setCourses(coursesData);
        setCgpaStats(calculateCGPA(coursesData));
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
              Calculating your CGPA...
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

  const completedCourses = courses.filter(
    (course) =>
      course.studentGrade &&
      course.gradePoints !== null &&
      course.gradePoints !== undefined
  );

  const cgpaGrade = getCGPAGrade(cgpaStats.cgpa);
  const progressPercentage =
    cgpaStats.totalCourses > 0
      ? Math.round((cgpaStats.completedCourses / cgpaStats.totalCourses) * 100)
      : 0;

  return (
    <div className="flex-1 p-3 sm:p-6 overflow-auto min-h-screen">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600" />
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-neutral-300">
                CGPA Calculator
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Track your cumulative academic performance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs text-neutral-400">Current Grade</p>
              <p className={`text-lg font-medium ${cgpaGrade.color}`}>
                {cgpaGrade.grade}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Current CGPA</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {cgpaStats.cgpa.toFixed(2)}
          </p>
          <p className="text-xs text-neutral-600">Out of 10.00</p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Credit Units</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {cgpaStats.totalCreditUnits}
          </p>
          <p className="text-xs text-neutral-600">Completed</p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Courses</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {cgpaStats.completedCourses}
          </p>
          <p className="text-xs text-neutral-600">
            of {cgpaStats.totalCourses}
          </p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Progress</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {progressPercentage}%
          </p>
          <p className="text-xs text-neutral-600">Complete</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-sm">
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-medium text-neutral-300">
                  Completed Courses
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500">
                  Courses contributing to your CGPA ({completedCourses.length})
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 self-start sm:self-auto">
                Contributing to CGPA
              </Badge>
            </div>
          </div>

          <div className="block sm:hidden">
            {completedCourses.length === 0 ? (
              <div className="p-6 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <BookOpen className="w-8 h-8 text-neutral-300" />
                  <div>
                    <p className="text-neutral-300 font-medium">
                      No completed courses found
                    </p>
                    <p className="text-neutral-500 text-sm">
                      Complete some courses to see your CGPA calculation
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 space-y-3">
                {completedCourses.map((course, index) => {
                  const qualityPoints =
                    (course.gradePoints || 0) * (course.creditUnits || 0);
                  return (
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
                            {course.studentGrade || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-neutral-400">
                        <div>
                          Credits:{" "}
                          <span className="text-neutral-300">
                            {course.creditUnits || "N/A"}
                          </span>
                        </div>
                        <div>
                          Points:{" "}
                          <span className="text-neutral-300">
                            {course.gradePoints != null
                              ? course.gradePoints.toFixed(2)
                              : "N/A"}
                          </span>
                        </div>
                        <div>
                          Quality:{" "}
                          <span className="text-neutral-300">
                            {qualityPoints.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                    Grade Points
                  </TableHead>
                  <TableHead className="text-center text-neutral-300 font-medium">
                    Quality Points
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <BookOpen className="w-8 h-8 text-neutral-300" />
                        <div>
                          <p className="text-neutral-300 font-medium">
                            No completed courses found
                          </p>
                          <p className="text-neutral-500 text-sm">
                            Complete some courses to see your CGPA calculation
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  completedCourses.map((course, index) => {
                    const qualityPoints =
                      (course.gradePoints || 0) * (course.creditUnits || 0);
                    return (
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
                            {course.studentGrade || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-neutral-300 font-mono text-sm">
                          {course.gradePoints != null
                            ? course.gradePoints.toFixed(2)
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-center text-neutral-300 font-mono text-sm">
                          {qualityPoints.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {completedCourses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* CGPA Calculation */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <h3 className="text-base sm:text-lg font-medium text-neutral-300">
                  CGPA Calculation
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-neutral-400">
                    Total Quality Points:
                  </span>
                  <span className="text-neutral-300 font-medium">
                    {cgpaStats.totalGradePoints.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-neutral-400">Total Credit Units:</span>
                  <span className="text-neutral-300 font-medium">
                    {cgpaStats.totalCreditUnits}
                  </span>
                </div>
                <div className="border-t border-neutral-700 pt-3 mt-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-neutral-300 font-semibold">
                      CGPA:
                    </span>
                    <div className="text-left sm:text-right">
                      <div className="text-base sm:text-lg font-medium text-neutral-300">
                        {cgpaStats.totalGradePoints.toFixed(2)} ÷{" "}
                        {cgpaStats.totalCreditUnits} ={" "}
                        {cgpaStats.cgpa.toFixed(2)}
                      </div>
                      <div className={`text-xs sm:text-sm ${cgpaGrade.color}`}>
                        Grade: {cgpaGrade.grade}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <h3 className="text-base sm:text-lg font-medium text-neutral-300">
                  Performance Summary
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-md">
                  <span className="text-neutral-300 text-xs sm:text-sm">
                    Academic Standing
                  </span>
                  <span
                    className={`font-medium text-xs sm:text-sm ${cgpaGrade.color}`}
                  >
                    {cgpaStats.cgpa >= 7.0
                      ? "Excellent"
                      : cgpaStats.cgpa >= 6.0
                      ? "Good"
                      : cgpaStats.cgpa >= 5.0
                      ? "Satisfactory"
                      : "Needs Improvement"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-md">
                  <span className="text-neutral-300 text-xs sm:text-sm">
                    Course Completion
                  </span>
                  <span className="text-blue-400 font-medium text-xs sm:text-sm">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-md">
                  <span className="text-neutral-300 text-xs sm:text-sm">
                    Total Quality Points
                  </span>
                  <span className="text-green-400 font-medium text-xs sm:text-sm">
                    {cgpaStats.totalGradePoints.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CGPA;
