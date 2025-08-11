import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SecondaryLoader } from "@/ui/SecondaryLoader";
import { Eye, EyeOff } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });

      if (result.status === 200) {
        localStorage.setItem("authToken", result.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.data.token}`;
        localStorage.setItem("userData", JSON.stringify(result.data.user));
        setIsLoggedIn(true);
        navigate("/dashboard");
      }
    } catch (err: any) {
      let errorMessage = "Login failed. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password.";
      } else if (err.response?.status === 404) {
        errorMessage = "Account not found. Please check your email.";
      } else if (err.response?.status === 400) {
        errorMessage = "Please enter valid email and password.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen flex items-center justify-center px-4">
      <div className="bg-neutral-900 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-background tracking-wider">
          Login to your Account!
        </h2>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-background">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-neutral-400 rounded-md shadow-sm placeholder:text-neutral-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-background">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 pr-12 border border-neutral-400 rounded-md shadow-sm placeholder:text-neutral-300"
                placeholder="••••••••"
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
          </div>

          {isLoading ? (
            <SecondaryLoader />
          ) : (
            <button
              type="submit"
              className="w-full bg-background hover:bg-neutral-300 border border-neutral-700 cursor-pointer text-foreground font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              Login
            </button>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-neutral-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-background hover:text-neutral-300 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
