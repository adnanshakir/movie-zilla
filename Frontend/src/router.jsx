import { createBrowserRouter } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import About from "./pages/About/About";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home/Home";
import Favorites from "./pages/Favorites/Favorites";
import History from "./pages/History/History";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import Search from "./pages/Search/Search";
import MovieCategory from "./pages/MovieCategory/MovieCategory";
import ProtectedRoute from "./utils/Protected";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/about", element: <About /> },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },

  {
    path: "/favorites",
    element: (
      <ProtectedRoute>
        <Favorites />
      </ProtectedRoute>
    ),
  },

  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <History />
      </ProtectedRoute>
    ),
  },

  {
    path: "/movie/:id",
    element: (
      <ProtectedRoute>
        <MovieDetails />
      </ProtectedRoute>
    ),
  },

  {
    path: "/search",
    element: (
      <ProtectedRoute>
        <Search />
      </ProtectedRoute>
    ),
  },

  {
    path: "/movies/:category",
    element: (
      <ProtectedRoute>
        <MovieCategory />
      </ProtectedRoute>
    ),
  },
]);

export default router;
