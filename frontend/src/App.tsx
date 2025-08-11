import { useAuth } from "./context/AuthContext";  
import { Header } from "./components/main/Header";
import { NavBar } from "./components/main/NavBar";
import { Assignments } from "./pages/Assignments";
import { useState } from "react";
import CGPA from "./pages/CGPA";
import { Courses } from "./pages/Courses";
import { Dashboard } from "./pages/Dashboard";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Logout from "./auth/Logout";

function App() {
  const { isLoggedIn, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex text-xl items-center justify-center h-screen bg-foreground text-neutral-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-foreground text-background">
      {isLoggedIn && <Header 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />}
      <div className="flex flex-1 min-h-0">
        {isLoggedIn && <NavBar 
        isMobileMenuOpen={isMobileMenuOpen} 
        closeMobileMenu={() => setIsMobileMenuOpen(false)} 
      />}
        <main className="flex-1 overflow-auto">
          <Routes>
       
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Home />} />
            
          
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />} />

            
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/courses" element={isLoggedIn ? <Courses /> : <Navigate to="/" />} />
            <Route path="/assignments" element={isLoggedIn ? <Assignments /> : <Navigate to="/" />} />
            <Route path="/cgpa" element={isLoggedIn ? <CGPA /> : <Navigate to="/" />} />
            <Route path="/logout" element={isLoggedIn ? <Logout /> : <Navigate to="/" />} />

           
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

