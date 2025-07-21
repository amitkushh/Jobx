import express from "express";
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js"

const companyRoutes = express.Router();

companyRoutes.post("/register", isAuthenticated, registerCompany);
companyRoutes.get("/get", isAuthenticated, getCompany)
companyRoutes.get("/get/:id", isAuthenticated, getCompanyById)
companyRoutes.put("/update/:id", isAuthenticated, updateCompany)


export default companyRoutes;
