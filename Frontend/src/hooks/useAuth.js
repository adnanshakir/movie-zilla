import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getMe,
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
  registerUser as apiRegisterUser,
} from "../services/auth.api.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shared across all hook instances to ignore stale auth responses.
let authStateVersion = 0;
let hasRunBootstrapAuthCheck = false;
let didLogoutThisPageLoad = false;
const MANUAL_LOGOUT_FLAG = "manualLogout";

function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const clearClientAuthState = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("history");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
  };

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

    const shouldRunBootstrapCheck =
      !hasRunBootstrapAuthCheck &&
      !didLogoutThisPageLoad &&
      sessionStorage.getItem(MANUAL_LOGOUT_FLAG) !== "1" &&
      location.pathname === "/";

    if (!shouldRunBootstrapCheck) {
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    hasRunBootstrapAuthCheck = true;

    const checkAuth = async () => {
      const requestVersion = authStateVersion;

      try {
        const data = await getMe();

        if (!isMounted || requestVersion !== authStateVersion) {
          return;
        }

        setUser(data.user || null);

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          clearClientAuthState();
        }
      } catch {
        if (!isMounted || requestVersion !== authStateVersion) {
          return;
        }

        setUser(null);
        clearClientAuthState();
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
  }, [location.pathname]);

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
      sessionStorage.removeItem(MANUAL_LOGOUT_FLAG);

      setUser(data.user || null);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate(location.state?.from?.pathname ?? "/", { replace: true });
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
      sessionStorage.removeItem(MANUAL_LOGOUT_FLAG);

      setUser(data.user || null);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate(location.state?.from?.pathname ?? "/", { replace: true });
      return true;
    } catch (err) {
      setError(err.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Invalidate any in-flight getMe request from other mounted components.
    authStateVersion += 1;
    didLogoutThisPageLoad = true;
    hasRunBootstrapAuthCheck = true;
    sessionStorage.setItem(MANUAL_LOGOUT_FLAG, "1");

    setLoading(true);
    setError("");

    try {
      await apiLogoutUser();
    } catch (err) {
      setError(err.message || "Logout failed");
    } finally {
      setUser(null);
      clearClientAuthState();
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
