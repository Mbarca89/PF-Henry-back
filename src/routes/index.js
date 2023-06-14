import Router from "express";
import productRoutes from "./Product.route.js";
import userRoutes from "./User.route.js";
import cartRoutes from "./Cart.route.js";
import orderRoutes from "./Order.route.js";

const router = Router();

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

export default router;
