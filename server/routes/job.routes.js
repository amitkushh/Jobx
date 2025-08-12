import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const jobRoutes = express.Router();

jobRoutes.post("/post", isAuthenticated, postJob);
jobRoutes.get("/get", isAuthenticated, getAllJobs);
jobRoutes.get("/get/:id", isAuthenticated, getJobById);
jobRoutes.get("/get-admin-jobs", isAuthenticated, getAdminJobs);

export default jobRoutes;
