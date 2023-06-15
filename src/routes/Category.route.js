import Router from "express";
import {
  postCategory,
  getAllCategories,
} from "../controllers/Category.controller.js";

const categoryRoutes = Router();

categoryRoutes.post("/", postCategory);
categoryRoutes.get("/", getAllCategories);

export default categoryRoutes;
