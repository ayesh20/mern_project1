import express from 'express';
import { createProduct, deleteProduct, getProductInfo, getProducts, searchProducts, updateProduct } from '../controllers/productController.js';


const productRouter = express.Router();
productRouter.post("/",createProduct)
productRouter.get("/search/:query", searchProducts);
productRouter.get("/:page/:limit",getProducts)
productRouter.get("/",getProducts)
productRouter.get("/all",getProducts)
productRouter.get("/:productId", getProductInfo) 
productRouter.delete("/:productId", deleteProduct)
productRouter.put("/:productId", updateProduct)



export default productRouter;