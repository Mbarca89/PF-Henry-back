import Router from 'express';
import getProductById from '../controllers/ProductById.controller';
const productByIdRoutes = Router();

productByIdRoutes.get("/:id", getProductById)


export default productByIdRoutes;