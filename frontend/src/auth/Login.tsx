import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SecondaryLoader } from "@/ui/SecondaryLoader";

const API_URL = import.meta.env.VITE_API_URL;
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
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
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-neutral-950 min-h-screen flex items-center justify-center px-4">
      <div className=" bg-neutral-900 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-background tracking-wider ">
          Login to your Account!
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-neutral-400 rounded-md shadow-sm placeholder:text-neutral-300"
              placeholder="••••••••"
            />
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
        {error && (
          <p className=" text-center text-red-600 text-sm mt-5">
            Login failed!
          </p>
        )}
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
