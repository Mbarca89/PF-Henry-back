import Router from "express";
import { postOrder, getOrder, getUserOrders } from "../controllers/Order.controller.js";

const orderRoutes = Router();

orderRoutes.post("/", postOrder);
orderRoutes.get("/:orderId", getOrder);
orderRoutes.get("/user/:userId", getUserOrders);


export default orderRoutes;
