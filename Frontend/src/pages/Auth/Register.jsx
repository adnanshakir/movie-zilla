import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import useAuth from "../../hooks/useAuth.js";
import "./register.scss";

const Register = () => {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
    await register(formData);
  };

  return (
    <div className="auth-page">
      <Navbar />

      <main className="auth-page__main">
        <section className="auth-card auth-card--register">
          <span className="auth-card__eyebrow">Create Account</span>
          <h1 className="auth-card__title">Start Your Watchlist</h1>
          <p className="auth-card__subtitle">
            Create your account to save favorites and track what you watch.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-form__field">
              <span>Username</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                autoComplete="username"
              />
            </label>

            <label className="auth-form__field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </label>

            <label className="auth-form__field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
              />
            </label>

            {error ? <p className="auth-form__error">{error}</p> : null}

            <button className="btn btn--primary btn--lg auth-form__submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="auth-form__meta">
              Already have an account? <Link to="/login" className="auth-form__inline-link">Login</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Register;