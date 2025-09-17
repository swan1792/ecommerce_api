import express from "express";
import productController  from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";

const {addProduct, listProduct, removeProduct, singleProduct } = productController;
const productRouter = express.Router();

productRouter.post("/add", adminAuth ,upload.fields([{name: 'image1', maxCount: 1}, {name: 'image2', maxCount: 1}, {name: 'image3', maxCount: 1}, {name: 'image4', maxCount: 1}]) ,addProduct);
productRouter.get("/list", listProduct);
productRouter.get("/single", singleProduct)
productRouter.post("/remove", adminAuth ,removeProduct);
export default productRouter;
