import userModel from "../models/user.model.js";

async function addFavorites(req, res, next) {
  try {
    const movieId = Number(req.params.movieId);

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ message: "Movie already in favorites" });
    }

    user.favorites.unshift(movieId);
    await user.save();

    res.status(200).json({
      message: "Added to favorites",
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
}

async function removeFavorites(req, res, next) {
  try {
    const movieId = Number(req.params.movieId);

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: movieId } },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Removed from favorites",
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
}

async function getFavorites(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
}

export { addFavorites, removeFavorites, getFavorites };
