import Router from "express";
import {
  postCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/Category.controller.js";

const categoryRoutes = Router();

categoryRoutes.post("/", postCategory);
categoryRoutes.get("/", getAllCategories);
categoryRoutes.put("/", updateCategory);
categoryRoutes.get("/detail/:id", getCategoryById);
categoryRoutes.delete("/:id", deleteCategory);

export default categoryRoutes;
