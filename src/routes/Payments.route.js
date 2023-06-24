import { Router } from "express";
import {createOrder,receiveWebhook, success} from "../controllers/Payments.controller.js"
const paymentRoutes = Router();

paymentRoutes.post("/create-order",createOrder )
paymentRoutes.post("/webhook",receiveWebhook )
paymentRoutes.get("/success/:orderId", success);
paymentRoutes.get("/failure", (req, res)=> res.send("failure"));
paymentRoutes.get("/pending", (req, res)=> res.send("pending"));




export default paymentRoutes