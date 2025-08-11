import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SecondaryLoader } from "@/ui/SecondaryLoader";

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
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await axios.post(`${API_URL}/api/signup`, user);

      if (result.status === 201) {
        navigate("/login");
      }
    } catch (err: any) {
      alert("Signup failed. Please check your inputs.");
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
          <Input
            type="password"
            value={user.password}
            placeholder="Enter your password"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            className="w-full px-4 py-2 mt-1 border border-neutral-400 rounded-md placeholder:text-neutral-300"
          />
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
            className="w-full px-4 py-2 mt-1 border border-neutral-400rounded-md placeholder:text-neutral-300"
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
            className="w-full bg-background hover:bg-neutral-300 border border-neutral-700 cursor-pointer text-foreground font-semibold py-2 px-4 rounded-md transition duration-300"
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
