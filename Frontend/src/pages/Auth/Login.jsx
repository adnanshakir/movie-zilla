import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await loginUser();

    if (res.success) {
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/home");
    }
  };
  return <div>Login</div>;
};

export default Login;
