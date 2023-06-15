import Router from "express";
import productRoutes from "./Product.route.js";
import userRoutes from "./User.route.js";
import cartRoutes from "./Cart.route.js";
import orderRoutes from "./Order.route.js";
import categoryRoutes from "./Category.route.js";

const router = Router();

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);

export default router;
