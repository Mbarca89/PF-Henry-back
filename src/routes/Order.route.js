import Router from "express";
import { postOrder, getOrder, getUserOrders, getOrderData } from "../controllers/Order.controller.js";

const orderRoutes = Router();

orderRoutes.post("/", postOrder);
orderRoutes.get("/:orderId", getOrder);
orderRoutes.get("/user/:userId", getUserOrders);
orderRoutes.get("/data/:period", getOrderData);


export default orderRoutes;
