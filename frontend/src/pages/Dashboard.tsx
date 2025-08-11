import { useEffect, useState } from "react";
import {
  User,
  UserCheck,
  GraduationCap,
  Bell,
  Edit,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  Award,
  Target,
  BookMarked,
  FileText,
  Star,
  Trophy,
  Activity,
  Brain,
  Lightbulb,
  Users,
  Coffee,
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const Dashboard = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    programName: "",
    joiningYear: "",
    discipline: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingGuardian, setEditingGuardian] = useState(false);
  const [guardianData, setGuardianData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [tempGuardianData, setTempGuardianData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const quickStats = {
    cgpa: 3.67,
    completedCourses: 12,
    totalCourses: 16,
    pendingAssignments: 4,
  };

  const recentActivities = [
    {
      icon: Award,
      text: "Completed Database Design Project",
      time: "2 hours ago",
      color: "text-green-500",
    },
    {
      icon: FileText,
      text: "New assignment in Web Development",
      time: "1 day ago",
      color: "text-blue-500",
    },
    {
      icon: Trophy,
      text: "Achieved 95% in Linear Algebra",
      time: "3 days ago",
      color: "text-yellow-500",
    },
    {
      icon: BookMarked,
      text: "Started Machine Learning course",
      time: "1 week ago",
      color: "text-purple-500",
    },
  ];

  const upcomingDeadlines = [
    {
      task: "Software Engineering Case Study",
      course: "CS501",
      dueDate: "Tomorrow",
      urgent: true,
    },
    {
      task: "Statistics Homework 4",
      course: "STAT301",
      dueDate: "3 days",
      urgent: false,
    },
    {
      task: "ML Model Implementation",
      course: "CS601",
      dueDate: "1 week",
      urgent: false,
    },
  ];

  const motivationalQuotes = [
    "The expert in anything was once a beginner.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
  ];

  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const studyTips = [
    {
      icon: Brain,
      title: "Study Smart",
      tip: "Take breaks every 45 minutes to improve focus and retention.",
    },
    {
      icon: Users,
      title: "Study Groups",
      tip: "Join study groups to discuss concepts and solve problems together.",
    },
    {
      icon: Coffee,
      title: "Stay Energized",
      tip: "Maintain a healthy sleep schedule and stay hydrated.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [userResponse, guardianResponse] = await Promise.all([
          axios.get(`${API_URL}/api/dashboard/me`, { withCredentials: true }),
          axios.get(`${API_URL}/api/dashboard/guardian`, {
            withCredentials: true,
          }),
        ]);

        if (userResponse.status !== 200) {
          throw new Error("Failed to fetch user data");
        }

        if (guardianResponse.status !== 200) {
          throw new Error("Failed to fetch guardian data");
        }
        const userData = userResponse.data;
        setUserData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          programName: userData.ProgramName || "",
          joiningYear: userData.joiningYear || "",
          discipline: userData.discipline || "",
        });
        const guardianInfo = {
          name: guardianResponse.data.name || "",
          email: guardianResponse.data.email || "",
          phone: guardianResponse.data.phone || "",
        };

        setGuardianData(guardianInfo);
        setTempGuardianData(guardianInfo);
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "message" in err &&
          typeof (err as any).message === "string"
        ) {
          setError((err as any).message);
        } else {
          setError("Failed to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGuardianEditToggle = () => {
    if (editingGuardian) {
      handleGuardianSave();
    } else {
      setTempGuardianData({ ...guardianData });
      setEditingGuardian(true);
    }
  };

  const handleGuardianSave = async () => {
    try {
      setError(null);

      if (!tempGuardianData.name.trim()) {
        setError("Guardian name is required");
        return;
      }

      if (!tempGuardianData.email.trim()) {
        setError("Guardian email is required");
        return;
      }

      if (!tempGuardianData.phone.trim()) {
        setError("Guardian phone is required");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/dashboard/guardian`,
        {
          name: tempGuardianData.name.trim(),
          email: tempGuardianData.email.trim(),
          phone: tempGuardianData.phone.trim(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setGuardianData({ ...tempGuardianData });
        setEditingGuardian(false);
        setError(null);
      } else {
        throw new Error("Failed to save guardian data");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to save guardian data");
      } else if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as any).message === "string"
      ) {
        setError((err as any).message);
      } else {
        setError("Failed to save guardian data");
      }
    }
  };

  const handleGuardianCancel = () => {
    setTempGuardianData({ ...guardianData });
    setEditingGuardian(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex-1 p-3 sm:p-6 overflow-auto min-h-screen">
        <div className="flex items-center justify-center h-64 sm:h-full">
          <div className="flex flex-col items-center space-y-4">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400 animate-pulse" />
            <div className="text-neutral-400 text-sm sm:text-md">
              Loading Dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !editingGuardian) {
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
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Welcome back, {userData.name || "Student"}!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs text-neutral-400">Current CGPA</p>
              <p className="text-lg font-medium text-neutral-100">
                {quickStats.cgpa}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && editingGuardian && (
        <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 px-3 sm:px-4 py-2 rounded-md border border-red-200">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs sm:text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Current CGPA</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {quickStats.cgpa}
          </p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Completed</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {quickStats.completedCourses}/{quickStats.totalCourses}
          </p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Pending Tasks</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            {quickStats.pendingAssignments}
          </p>
        </div>

        <div className="bg-neutral-300 border border-neutral-900 hover:bg-neutral-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
            <span className="text-xs text-neutral-900">Semester</span>
          </div>
          <p className="text-lg sm:text-xl font-medium text-neutral-900 mt-1">
            Fall 2024
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <h2 className="text-base sm:text-lg font-medium text-neutral-300">
              Personal Details
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
                <span className="text-xs sm:text-sm text-neutral-400">
                  Name:
                </span>
              </div>
              <span className="text-xs sm:text-sm text-neutral-300 ml-5 sm:ml-0">
                {userData.name || "Not available"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
                <span className="text-xs sm:text-sm text-neutral-400">
                  Email:
                </span>
              </div>
              <span className="text-xs sm:text-sm text-neutral-300 ml-5 sm:ml-0 break-all">
                {userData.email || "Not available"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
                <span className="text-xs sm:text-sm text-neutral-400">
                  Phone:
                </span>
              </div>
              <span className="text-xs sm:text-sm text-neutral-300 ml-5 sm:ml-0">
                {userData.phone || "Not available"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <h2 className="text-base sm:text-lg font-medium text-neutral-300">
                Guardian Details
              </h2>
            </div>
            <div className="flex gap-2">
              {editingGuardian && (
                <button
                  onClick={handleGuardianCancel}
                  className="px-2 sm:px-3 py-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleGuardianEditToggle}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors text-neutral-200"
              >
                <Edit className="w-3 h-3" />
                {editingGuardian ? "Save" : "Edit"}
              </button>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
                <span className="text-xs sm:text-sm text-neutral-400">
                  Name:
                </span>
              </div>
              {editingGuardian ? (
                <input
                  type="text"
                  value={tempGuardianData.name}
                  onChange={(e) =>
                    setTempGuardianData({
                      ...tempGuardianData,
                      name: e.target.value,
                    })
                  }
                  className="px-2 py-1 border border-neutral-600 rounded text-xs focus:outline-none focus:border-blue-500 bg-neutral-800 text-neutral-200 w-full"
                  placeholder="Enter guardian name"
                />
              ) : (
                <span className="text-xs sm:text-sm text-neutral-300 ml-5">
                  {guardianData.name || "Not available"}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
                <span className="text-xs sm:text-sm text-neutral-400">
                  Email:
                </span>
              </div>
              {editingGuardian ? (
                <input
                  type="email"
                  value={tempGuardianData.email}
                  onChange={(e) =>
                    setTempGuardianData({
                      ...tempGuardianData,
                      email: e.target.value,
                    })
                  }
                  className="px-2 py-1 border border-neutral-600 rounded text-xs focus:outline-none focus:border-blue-500 bg-neutral-800 text-neutral-200 w-full"
                  placeholder="Enter guardian email"
                />
              ) : (
                <span className="text-xs sm:text-sm text-neutral-300 ml-5 break-all">
                  {guardianData.email || "Not available"}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
                <span className="text-xs sm:text-sm text-neutral-400">
                  Phone:
                </span>
              </div>
              {editingGuardian ? (
                <input
                  type="tel"
                  value={tempGuardianData.phone}
                  onChange={(e) =>
                    setTempGuardianData({
                      ...tempGuardianData,
                      phone: e.target.value,
                    })
                  }
                  className="px-2 py-1 border border-neutral-600 rounded text-xs focus:outline-none focus:border-blue-500 bg-neutral-800 text-neutral-200 w-full"
                  placeholder="Enter guardian phone"
                />
              ) : (
                <span className="text-xs sm:text-sm text-neutral-300 ml-5">
                  {guardianData.phone || "Not available"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <h2 className="text-base sm:text-lg font-medium text-neutral-300">
              Degree Program
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
                <span className="text-xs sm:text-sm text-neutral-400">
                  Program:
                </span>
              </div>
              <span className="text-xs sm:text-sm text-neutral-300 ml-5 sm:ml-0">
                {userData.programName || "Not available"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
                <span className="text-xs sm:text-sm text-neutral-400">
                  Discipline:
                </span>
              </div>
              <span className="text-xs sm:text-sm text-neutral-300 ml-5 sm:ml-0">
                {userData.discipline || "Not available"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
                <span className="text-xs sm:text-sm text-neutral-400">
                  Joining Year:
                </span>
              </div>
              <span className="text-xs sm:text-sm text-neutral-300 ml-5 sm:ml-0">
                {userData.joiningYear || "Not available"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-medium text-neutral-300">
              Recent Activities
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {recentActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 hover:bg-neutral-800 rounded-md transition-colors"
                >
                  <IconComponent
                    className={`w-4 h-4 mt-0.5 ${activity.color} flex-shrink-0`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-neutral-300 text-xs sm:text-sm">
                      {activity.text}
                    </p>
                    <p className="text-neutral-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <h2 className="text-base sm:text-lg font-medium text-neutral-300">
              Upcoming Deadlines
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-neutral-800 rounded-md gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-neutral-300 text-xs sm:text-sm font-medium truncate">
                    {deadline.task}
                  </p>
                  <p className="text-neutral-500 text-xs">{deadline.course}</p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      deadline.urgent
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {deadline.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <h2 className="text-base sm:text-lg font-medium text-neutral-300">
              Daily Motivation
            </h2>
          </div>
          <div className="text-neutral-400 italic text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
            "{currentQuote}"
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Keep pushing forward!</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            <h2 className="text-base sm:text-lg font-medium text-neutral-300">
              Notifications
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start gap-3 p-2 bg-blue-50 rounded-md border border-blue-200">
              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-blue-800 text-xs sm:text-sm">
                Grade posted for Database Project
              </span>
            </div>
            <div className="flex items-start gap-3 p-2 bg-yellow-50 rounded-md border border-yellow-200">
              <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span className="text-yellow-800 text-xs sm:text-sm">
                Assignment due in 2 days
              </span>
            </div>
            <div className="flex items-start gap-3 p-2 bg-green-50 rounded-md border border-green-200">
              <Trophy className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-green-800 text-xs sm:text-sm">
                Top performer this month
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {studyTips.map((tip, index) => {
          const IconComponent = tip.icon;
          return (
            <div
              key={index}
              className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 sm:p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
                <h3 className="text-xs sm:text-sm font-medium text-neutral-300">
                  {tip.title}
                </h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {tip.tip}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
