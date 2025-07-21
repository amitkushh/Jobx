import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.post("/logout", isAuthenticated, logout)
userRoutes.put("/profile/update", isAuthenticated, updateProfile);

export default userRoutes;
