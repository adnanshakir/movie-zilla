import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer.jsx";
import Hero from "../../components/hero/Hero";
import About from "../../components/About/About";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/home");
    }
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Footer />
    </>
  );
};

export default Landing;
