import Router from "express";
import { postOrder } from "../controllers/Order.controller.js";

const orderRoutes = Router();

orderRoutes.post("/", postOrder);

export default orderRoutes;
