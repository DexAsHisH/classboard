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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function EditCourse() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseCode: "",
    studentGrade: "",
    creditUnits: 0,
    gradePoints: 0,
  });

  const handleInputChange =
    (field: keyof typeof courseData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "number"
          ? Number(event.target.value)
          : event.target.value;

      setCourseData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await axios.post(`${API_URL}/api/courses`, courseData, {
        withCredentials: true,
      });

      if (res.status === 201) {
        setSuccess(true);

        setCourseData({
          courseName: "",
          courseCode: "",
          studentGrade: "",
          creditUnits: 0,
          gradePoints: 0,
        });
      } else {
        setError("Failed to add new course");
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to add course");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);

    setCourseData({
      courseName: "",
      courseCode: "",
      studentGrade: "",
      creditUnits: 0,
      gradePoints: 0,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-neutral-300 bg-neutral-700 hover:text-neutral-50 hover:bg-neutral-900 cursor-pointer border border-neutral-700 rounded-sm tracking-widest leading-7">
          + Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>
              Fill in the details of the course you want to add.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                name="courseName"
                value={courseData.courseName}
                onChange={handleInputChange("courseName")}
                placeholder="Enter course name"
                disabled={isLoading}
                className="placeholder:text-sm"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Input
                id="courseCode"
                name="courseCode"
                value={courseData.courseCode}
                onChange={handleInputChange("courseCode")}
                placeholder="Enter course code"
                disabled={isLoading}
                className="placeholder:text-sm"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="creditUnits">Credit Units</Label>
              <Input
                id="creditUnits"
                name="creditUnits"
                type="number"
                value={courseData.creditUnits || ""}
                onChange={handleInputChange("creditUnits")}
                placeholder="Enter credit units"
                disabled={isLoading}
                className="placeholder:text-sm"
                required
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="studentGrade">Student Grade</Label>
              <Input
                id="studentGrade"
                name="studentGrade"
                type="text"
                value={courseData.studentGrade}
                onChange={handleInputChange("studentGrade")}
                placeholder="Enter student grade (e.g., A, B, C)"
                disabled={isLoading}
                className="placeholder:text-sm"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gradePoints">Grade Points</Label>
              <Input
                id="gradePoints"
                name="gradePoints"
                type="number"
                value={courseData.gradePoints || ""}
                onChange={handleInputChange("gradePoints")}
                placeholder="Enter grade points"
                disabled={isLoading}
                className="placeholder:text-sm"
                required
                min="0"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
                Course added successfully!
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleCancel}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding Course..." : "Add Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
