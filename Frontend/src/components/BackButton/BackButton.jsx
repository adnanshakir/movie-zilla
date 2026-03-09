import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./backButton.scss";

// Navigates back on click or Escape key press.
// Pass disabled=true to suppress the Escape listener (e.g. when a modal is open).
const BackButton = ({ disabled = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (disabled) return;
    const handleKey = (e) => {
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate, disabled]);

  return (
    <button
      className="back-btn"
      onClick={() => navigate(-1)}
      aria-label="Go back"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
};

export default BackButton;
