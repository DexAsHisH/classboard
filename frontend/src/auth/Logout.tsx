import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type LogoutProps = {
  onClick?: () => void;
};

export default function Logout({ onClick }: LogoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();

      navigate("/");
    } catch (error) {
      logout();
      navigate("/");
    }
  };

  return (
    <span className="w-full" onClick={onClick ?? handleLogout}>
      Logout
    </span>
  );
}
