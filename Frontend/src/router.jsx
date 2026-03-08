import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import MovieDetails from "./pages/MovieDetails/MovieDetails";
import Search from "./pages/Search/Search";
import Favorites from "./pages/Favorites/Favorites";
import History from "./pages/History/History";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/movie/:id", element: <MovieDetails /> },
  { path: "/search", element: <Search /> },
  { path: "/favorites", element: <Favorites /> },
  { path: "/history", element: <History /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
