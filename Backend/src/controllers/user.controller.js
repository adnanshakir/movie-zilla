import userModel from "../models/user.model.js";

async function getProfile(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

async function getFavorites(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({ watchHistory: user.watchHistory });
  } catch (err) {
    next(err);
  }
}

export { getProfile, getFavorites, getHistory };
