import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMe,
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
  registerUser as apiRegisterUser,
} from "../services/auth.api.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser || savedUser === "undefined") {
        return null;
      }

      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const data = await getMe();

        if (!isMounted) {
          return;
        }

        setUser(data.user || null);

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("user");
        }
      } catch {
        if (!isMounted) {
          return;
        }

        setUser(null);
        localStorage.removeItem("user");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const clearError = () => setError("");

  const login = async (formData) => {
    const identifier = formData.identifier?.trim();
    const password = formData.password?.trim();

    if (!identifier) {
      setError("Email or username is required");
      return false;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const payload = EMAIL_REGEX.test(identifier)
        ? { email: identifier, password }
        : { username: identifier, password };

      const data = await apiLoginUser(payload);

      setUser(data.user || null);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/home");
      return true;
    } catch (err) {
      setError(err.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    const username = formData.username?.trim();
    const email = formData.email?.trim();
    const password = formData.password?.trim();

    if (!username) {
      setError("Username is required");
      return false;
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      setError("Enter a valid email address");
      return false;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiRegisterUser({ username, email, password });

      setUser(data.user || null);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/home");
      return true;
    } catch (err) {
      setError(err.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError("");

    try {
      await apiLogoutUser();
    } catch (err) {
      setError(err.message || "Logout failed");
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      setLoading(false);
      navigate("/");
    }
  };

  return {
    user,
    loading,
    error,
    clearError,
    login,
    register,
    logout,
  };
}

export default useAuth;
