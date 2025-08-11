import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  user: any;
  logout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const res = await axios.get(`${API_URL}/api/auth/me`);

          if (res.data.user) {
            setIsLoggedIn(true);
            setUser(res.data.user);

            localStorage.setItem("userData", JSON.stringify(res.data.user));
          } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            delete axios.defaults.headers.common["Authorization"];
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        delete axios.defaults.headers.common["Authorization"];
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      delete axios.defaults.headers.common["Authorization"];

      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {}
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, loading, user, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
