import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  markPaid,
  allOrders,
  userOrders,
  updateStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middlewares/adminAuth.js";
import authUser from "../middlewares/authUser.js";

const orderRouter = express.Router();

// Admin
orderRouter.get("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// User
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/mark-paid", authUser, markPaid);
orderRouter.get("/userorders", authUser, userOrders);

export default orderRouter;
