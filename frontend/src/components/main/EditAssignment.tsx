import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type Course = {
  id: number;
  courseCode: string;
  courseName: string;
};

export function EditAssignment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    courseId: "",
    status: "ONGOING" as "ONGOING" | "COMPLETED",
  });

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await axios.get(`${API_URL}/api/courses`, {
        withCredentials: true,
      });
      setCourses(response.data || []);
    } catch (error) {
      setError("Failed to load courses");
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof typeof assignmentData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setAssignmentData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSelectChange =
    (field: keyof typeof assignmentData) => (value: string) => {
      setAssignmentData((prev) => ({
        ...prev,
        [field]:
          field === "courseId" ? value : (value as "ONGOING" | "COMPLETED"),
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const submitData = {
        ...assignmentData,
        courseId: parseInt(assignmentData.courseId),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assignments`,
        submitData,
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setSuccess(true);

        setAssignmentData({
          title: "",
          courseId: "",
          status: "ONGOING",
        });

        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
        }, 1500);
      } else {
        setError("Failed to add new assignment");
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to add assignment");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);

    setAssignmentData({
      title: "",
      courseId: "",
      status: "ONGOING",
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="text-neutral-300 bg-neutral-800 hover:text-neutral-50 hover:bg-neutral-900 cursor-pointer border border-neutral-700 rounded-sm tracking-widest leading-7">
          +Add Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Assignment</DialogTitle>
            <DialogDescription>
              Fill in the details of the assignment you want to add.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                name="title"
                value={assignmentData.title}
                onChange={handleInputChange("title")}
                placeholder="e.g. Database Design Project"
                disabled={isLoading}
                className="placeholder:text-sm"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="courseId">Course</Label>
              {coursesLoading ? (
                <div className="text-sm text-gray-500 p-2">
                  Loading courses...
                </div>
              ) : (
                <Select
                  value={assignmentData.courseId}
                  onValueChange={handleSelectChange("courseId")}
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.courseCode} - {course.courseName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={assignmentData.status}
                onValueChange={handleSelectChange("status")}
                disabled={isLoading}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                Assignment added successfully!
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleCancel}
              className="mr-2 cursor-pointer"
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={isLoading || coursesLoading || courses.length === 0}
              className="cursor-pointer"
            >
              {isLoading ? "Adding Assignment..." : "Add Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
