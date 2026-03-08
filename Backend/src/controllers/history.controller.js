import userModel from "../models/user.model.js";

async function addHistory(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const movieId = Number(req.params.movieId);

    if (!user.watchHistory.includes(movieId)) {
      user.watchHistory.unshift(movieId);
    }

    // limit to 20 items
    user.watchHistory = user.watchHistory.slice(0, 20);

    await user.save();

    res.status(200).json({ watchHistory: user.watchHistory });
  } catch (err) {
    next(err);
  }
}

async function removeHistory(req, res, next) {
  try {
    const movieId = Number(req.params.movieId);

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { $pull: { watchHistory: movieId } },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ watchHistory: user.watchHistory });
  } catch (err) {
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ watchHistory: user.watchHistory });
  } catch (err) {
    next(err);
  }
}

export { addHistory, removeHistory, getHistory };
