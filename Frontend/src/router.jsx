import { createBrowserRouter, Navigate } from "react-router-dom";
import About from "./pages/About/About";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home/Home";
import Favorites from "./pages/Favorites/Favorites";
import History from "./pages/History/History";
import Watchlist from "./pages/Watchlist/Watchlist";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import Search from "./pages/Search/Search";
import MovieCategory from "./pages/MovieCategory/MovieCategory";
import Category from "./pages/Category/Category";
import ProtectedRoute from "./utils/Protected";
import PersonPage from "./pages/PersonPage/PersonPage";

const router = createBrowserRouter([
  // ── Public routes (no login required) ──────────────────────────
  { path: "/",                element: <Home /> },
  { path: "/about",           element: <About /> },
  { path: "/login",           element: <Login /> },
  { path: "/register",        element: <Register /> },
  { path: "/movie/:id",       element: <MovieDetails /> },
  { path: "/search",          element: <Search /> },
  { path: "/movies/:category",element: <MovieCategory /> },
  { path: "/category",        element: <Category /> },
  { path: "/person/:id",      element: <PersonPage /> },

  // ── Protected routes (login required) ──────────────────────────
  {
    path: "/favorites",
    element: <ProtectedRoute><Favorites /></ProtectedRoute>,
  },
  {
    path: "/history",
    element: <ProtectedRoute><History /></ProtectedRoute>,
  },
  {
    path: "/watchlist",
    element: <ProtectedRoute><Watchlist /></ProtectedRoute>,
  },

  // ── Catch-all: redirect unknown routes to home ──────────────────
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
