import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import useAuth from "../../hooks/useAuth.js";
import "./login.scss";

const Login = () => {
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (error) {
      clearError();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(formData);
  };

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-page__main">
        <section className="auth-card auth-card--login">
          <span className="auth-card__eyebrow">Account Access</span>
          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">
            Sign in to continue discovering movies.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-form__field">
              <span>Email or Username</span>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter your email or username"
                autoComplete="username"
              />
            </label>

            <label className="auth-form__field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </label>

            {error ? <p className="auth-form__error">{error}</p> : null}

            <button className="btn btn--primary btn--lg auth-form__submit" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <Link to="/register" className="auth-form__link">
              Create account
            </Link>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;
