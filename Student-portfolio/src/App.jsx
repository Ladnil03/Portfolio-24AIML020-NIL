import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RouteFallback from "./components/RouteFallback";
import { lazyWithMinDelay } from "./utils/lazyWithMinDelay";
import { isAuthenticated, getStoredUser, logout as authLogout } from "./services/authService";

// Route-based lazy loading with minimum delay (300ms) to prevent UI flashing
const Home = lazy(lazyWithMinDelay(() => import("./Pages/Home"), 300));
const Tasks = lazy(lazyWithMinDelay(() => import("./Pages/Tasks"), 300));
const Projects = lazy(lazyWithMinDelay(() => import("./Pages/Projects"), 300));
const Contact = lazy(lazyWithMinDelay(() => import("./Pages/Contact"), 300));
const Login = lazy(lazyWithMinDelay(() => import("./Pages/Login"), 300));
const Register = lazy(lazyWithMinDelay(() => import("./Pages/Register"), 300));
const NotFound = lazy(lazyWithMinDelay(() => import("./Pages/NotFound"), 300));

/**
 * ProtectedRoute — redirects to /login if not authenticated
 */
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme !== "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <Router>
      <div id="top" className="flex min-h-screen flex-col bg-paper text-ink">
        <Header theme={theme} toggleTheme={toggleTheme} user={user} onLogout={handleLogout} />

        <main id="main" className="flex-1">
          <Suspense fallback={<RouteFallback title="Loading page content..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onLogin={handleLogin} />} />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;