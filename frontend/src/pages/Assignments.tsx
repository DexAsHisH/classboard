import { EditAssignment } from "@/components/main/EditAssignment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  BookOpen,
  AlertCircle,
  Filter,
  Search,
  X,
  GraduationCap,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
type Assignment = {
  id: number;
  title: string;
  status: "ONGOING" | "COMPLETED";
  courseId: number;
  course: {
    id: number;
    courseCode: string;
    courseName: string;
  };
};

export const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [courseIdFilter, setCourseIdFilter] = useState<string>("ALL_COURSES");
  const [assignmentIdFilter, setAssignmentIdFilter] = useState<string>("");

  const getStatusBadgeClass = (status: "ONGOING" | "COMPLETED") => {
    return status === "COMPLETED"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  const calculateStats = () => {
    const completed = assignments.filter(
      (a) => a.status === "COMPLETED"
    ).length;
    const ongoing = assignments.filter((a) => a.status === "ONGOING").length;
    const completionRate =
      assignments.length > 0
        ? Math.round((completed / assignments.length) * 100)
        : 0;
    const uniqueCourses = new Set(assignments.map((a) => a.course.courseCode))
      .size;

    return {
      total: assignments.length,
      completed,
      ongoing,
      completionRate,
      uniqueCourses,
    };
  };

  const stats = calculateStats();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/api/assignments`, {
          withCredentials: true,
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch assignments: ${response.status}`);
        }

        setAssignments(response.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch assignments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const statusMatch =
        statusFilter === "ALL" || assignment.status === statusFilter;
      const courseIdMatch =
        courseIdFilter === "ALL_COURSES" ||
        assignment.course.courseCode
          .toLowerCase()
          .includes(courseIdFilter.toLowerCase());
      const assignmentIdMatch =
        !assignmentIdFilter ||
        assignment.id.toString().includes(assignmentIdFilter) ||
        assignment.title
          .toLowerCase()
          .includes(assignmentIdFilter.toLowerCase());

      return statusMatch && courseIdMatch && assignmentIdMatch;
    });
  }, [assignments, statusFilter, courseIdFilter, assignmentIdFilter]);

  const uniqueCourseCodes = useMemo(() => {
    const codes = assignments.map((a) => a.course.courseCode);
    return [...new Set(codes)].sort();
  }, [assignments]);

  const clearFilters = () => {
    setStatusFilter("ALL");
    setCourseIdFilter("ALL_COURSES");
    setAssignmentIdFilter("");
  };

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    courseIdFilter !== "ALL_COURSES" ||
    assignmentIdFilter !== "";

  if (loading) {
    return (
      <div className="flex-1 p-3 sm:p-6 overflow-auto min-h-screen">
        <div className="flex items-center justify-center h-64 sm:h-full">
          <div className="flex flex-col items-center space-y-4">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400 animate-pulse" />
            <div className="text-neutral-400 text-sm sm:text-md">
              Loading assignments...
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
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600" />
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-neutral-300">
                Assignments
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Track your assignment progress and deadlines
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs text-neutral-400">Completion Rate</p>
              <p className="text-lg font-medium text-neutral-100">
                {stats.completionRate}%
              </p>
            </div>
            <EditAssignment />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Total</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {stats.total}
          </p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Completed</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {stats.completed}
          </p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Ongoing</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {stats.ongoing}
          </p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Courses</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {stats.uniqueCourses}
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg mb-4 sm:mb-6">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <h3 className="text-sm font-medium text-neutral-300">Filters</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="p-3 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs text-neutral-400">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-neutral-300 text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-400">Course</label>
              <Select value={courseIdFilter} onValueChange={setCourseIdFilter}>
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-neutral-300 text-sm h-9">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_COURSES">All Courses</SelectItem>
                  {uniqueCourseCodes.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-400">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search assignments..."
                  value={assignmentIdFilter}
                  onChange={(e) => setAssignmentIdFilter(e.target.value)}
                  className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-300 placeholder:text-neutral-500 text-sm h-9"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 sm:mt-4 text-xs text-neutral-500">
              Showing {filteredAssignments.length} of {assignments.length}{" "}
              assignments
            </div>
          )}
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-sm mb-4 sm:mb-6">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-neutral-800">
          <h2 className="text-base sm:text-lg font-medium text-neutral-300">
            Assignment Details
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Overview of all your assignments
          </p>
        </div>

        <div className="block lg:hidden">
          {filteredAssignments.length === 0 ? (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <FileText className="w-8 h-8 text-neutral-300" />
                <div>
                  <p className="text-neutral-300 font-medium text-sm">
                    {assignments.length === 0
                      ? "No assignments found"
                      : "No assignments match the current filters"}
                  </p>
                  <p className="text-neutral-300 text-xs">
                    {assignments.length === 0
                      ? "Add your first assignment to get started"
                      : "Try adjusting your filters to see more results"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-neutral-800 rounded-lg p-3 space-y-2"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-neutral-300 px-2 py-1 rounded text-xs font-mono text-neutral-900">
                          #{assignment.id}
                        </code>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border gap-1 ${getStatusBadgeClass(
                            assignment.status
                          )}`}
                        >
                          {assignment.status === "COMPLETED" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {assignment.status}
                        </span>
                      </div>
                      <h3 className="font-medium text-neutral-300 text-sm">
                        {assignment.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <code className="bg-neutral-300 px-2 py-1 rounded text-xs font-mono text-neutral-900">
                        {assignment.course.courseCode}
                      </code>
                    </div>
                    <div className="text-neutral-400 truncate ml-2 max-w-32">
                      {assignment.course.courseName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-900">
                <TableHead className="text-neutral-300 font-medium">
                  ID
                </TableHead>
                <TableHead className="text-neutral-300 font-medium">
                  Title
                </TableHead>
                <TableHead className="text-neutral-300 font-medium">
                  Course
                </TableHead>
                <TableHead className="text-neutral-300 font-medium">
                  Course Name
                </TableHead>
                <TableHead className="text-center text-neutral-300 font-medium">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <FileText className="w-8 h-8 text-neutral-300" />
                      <div>
                        <p className="text-neutral-300 font-medium">
                          {assignments.length === 0
                            ? "No assignments found"
                            : "No assignments match the current filters"}
                        </p>
                        <p className="text-neutral-300 text-sm">
                          {assignments.length === 0
                            ? "Add your first assignment to get started"
                            : "Try adjusting your filters to see more results"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssignments.map((assignment) => (
                  <TableRow
                    key={assignment.id}
                    className="hover:bg-neutral-800"
                  >
                    <TableCell className="text-neutral-900 font-mono text-sm">
                      <code className="bg-neutral-300 px-2 py-1 rounded text-xs font-mono">
                        #{assignment.id}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium text-neutral-300">
                      {assignment.title}
                    </TableCell>
                    <TableCell className="text-neutral-900">
                      <code className="bg-neutral-300 px-2 py-1 rounded text-xs font-mono">
                        {assignment.course.courseCode}
                      </code>
                    </TableCell>
                    <TableCell className="text-neutral-300 text-sm">
                      {assignment.course.courseName}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border gap-1 ${getStatusBadgeClass(
                          assignment.status
                        )}`}
                      >
                        {assignment.status === "COMPLETED" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {assignment.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {assignments.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-900 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-neutral-300 mb-3 sm:mb-4">
            Assignment Summary
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center bg-neutral-800 rounded-lg p-3">
              <div className="text-lg sm:text-xl font-medium text-neutral-300">
                {stats.completed}
              </div>
              <div className="text-xs text-neutral-500">Completed</div>
            </div>
            <div className="text-center bg-neutral-800 rounded-lg p-3">
              <div className="text-lg sm:text-xl font-medium text-neutral-300">
                {stats.ongoing}
              </div>
              <div className="text-xs text-neutral-500">Ongoing</div>
            </div>
            <div className="text-center bg-neutral-800 rounded-lg p-3">
              <div className="text-lg sm:text-xl font-medium text-neutral-300">
                {stats.completionRate}%
              </div>
              <div className="text-xs text-neutral-500">Completion Rate</div>
            </div>
            <div className="text-center bg-neutral-800 rounded-lg p-3">
              <div className="text-lg sm:text-xl font-medium text-neutral-300">
                {stats.uniqueCourses}
              </div>
              <div className="text-xs text-neutral-500">Active Courses</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
