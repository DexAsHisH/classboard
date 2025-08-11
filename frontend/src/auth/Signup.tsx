import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SecondaryLoader } from "@/ui/SecondaryLoader";
import { Eye, EyeOff } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const [user, setUser] = useState({
    email: "",
    fullname: "",
    password: "",
    programName: "",
    joiningYear: "",
    discipline: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setUser((prev) => ({ ...prev, password: newPassword }));
    if (newPassword) {
      validatePassword(newPassword);
    } else {
      setPasswordError("");
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validatePassword(user.password)) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await axios.post(`${API_URL}/api/signup`, user);

      if (result.status === 201) {
        navigate("/login");
      }
    } catch (err: any) {
      let errorMessage = "Signup failed. Please check your inputs.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 409) {
        errorMessage = "An account with this email already exists.";
      } else if (err.response?.status === 400) {
        errorMessage = "Please fill in all required fields correctly.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-background">
          Create an Account
        </h2>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div>
          <Label className="block text-background">Full Name</Label>
          <Input
            type="text"
            value={user.fullname}
            placeholder="Enter your full name"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, fullname: e.target.value }))
            }
            required
            className="w-full px-4 py-2 mt-1 border border-neutral-400 rounded-md placeholder:text-neutral-300"
          />
        </div>

        <div>
          <Label className="block text-background">Email</Label>
          <Input
            type="email"
            value={user.email}
            placeholder="Enter your email"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            className="w-full px-4 py-2 mt-1 border border-neutral-400 rounded-md placeholder:text-neutral-300"
          />
        </div>

        <div>
          <Label className="block text-background">Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={user.password}
              placeholder="Enter your password (min 6 characters)"
              onChange={handlePasswordChange}
              required
              className={`w-full px-4 py-2 pr-12 mt-1 border rounded-md placeholder:text-neutral-300 ${
                passwordError
                  ? "border-red-500 focus:border-red-500"
                  : "border-neutral-400"
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 mt-0.5"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-400 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <div>
          <Label className="block text-background">Program Name</Label>
          <Input
            type="text"
            value={user.programName}
            placeholder="e.g. B.Tech"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, programName: e.target.value }))
            }
            required
            className="w-full px-4 py-2 mt-1 border border-neutral-400 rounded-md placeholder:text-neutral-300"
          />
        </div>

        <div>
          <Label className="block text-background">Joining Year</Label>
          <Input
            type="number"
            value={user.joiningYear}
            placeholder="e.g. 2023"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, joiningYear: e.target.value }))
            }
            required
            className="w-full px-4 py-2 mt-1 border border-neutral-400 rounded-md placeholder:text-neutral-300"
          />
        </div>

        <div>
          <Label className="block text-background">Discipline</Label>
          <Input
            type="text"
            value={user.discipline}
            placeholder="e.g. Computer Science"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, discipline: e.target.value }))
            }
            required
            className="w-full px-4 py-2 mt-1 border border-neutral-400 rounded-md placeholder:text-neutral-300"
          />
        </div>

        <div>
          <Label className="block text-background">
            Phone Number (optional)
          </Label>
          <Input
            type="text"
            value={user.phoneNumber}
            placeholder="e.g. 1234567890"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            className="w-full px-4 py-2 mt-1 border border-neutral-400 rounded-md placeholder:text-neutral-300"
          />
        </div>

        {isLoading ? (
          <SecondaryLoader />
        ) : (
          <button
            type="submit"
            disabled={!!passwordError}
            className={`w-full font-semibold py-2 px-4 rounded-md transition duration-300 ${
              passwordError
                ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                : "bg-background hover:bg-neutral-300 border border-neutral-700 cursor-pointer text-foreground"
            }`}
          >
            Signup
          </button>
        )}
        <p className="mt-4 text-sm text-neutral-400 flex items-center justify-center gap-1">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-background hover:text-neutral-300 font-medium"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
