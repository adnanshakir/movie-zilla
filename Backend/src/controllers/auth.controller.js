import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
}

function clearAuthCookie(res) {
  // Clear common variants to avoid stale cookies surviving env/config changes.
  const variants = [
    { path: "/" },
    { path: "/", sameSite: "lax" },
    { path: "/", sameSite: "strict" },
    { path: "/", sameSite: "none", secure: true },
    { path: "/", sameSite: "none", secure: false },
  ];

  variants.forEach((opts) => {
    res.clearCookie("token", opts);
    res.cookie("token", "", {
      ...opts,
      httpOnly: true,
      expires: new Date(0),
      maxAge: 0,
    });
  });
}

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegistered) {
    return res.status(400).json({
      message: "User already exists with this username or email",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token, getCookieOptions());

  return res.status(201).json({
    message: "User registered successfully!",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel
    .findOne({
      $or: [{ email }, { username }],
    })
    .select("+password");

  if (!user) {
    return res.status(401).json({
      message: "User doesn't exists",
    });
  }

  const isPassValid = await bcrypt.compare(password, user.password);

  if (!isPassValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token, getCookieOptions());
  return res.status(200).json({
    message: "Logged in successfully!",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function getMe(req, res) {
  const user = await userModel.findById(req.user.id);

  res.set("Cache-Control", "no-store");

  res.status(200).json({
    message: "User details fecthed!",
    user,
  });
}

async function logoutUser(req, res) {
  clearAuthCookie(res);
  res.set("Cache-Control", "no-store");

  return res.status(200).json({
    message: "Logout successfully!",
  });
}

export { registerUser, loginUser, getMe, logoutUser };
