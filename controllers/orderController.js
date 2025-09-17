import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place order (COD)
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, paymentMethod } = req.body;
    const userId = req.user._id;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod, // "COD"
      payment: false,
      date: Date.now(),
      status: "Pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed (COD)", order: newOrder });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Create Stripe PaymentIntent and order
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id;

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    // Save order in DB with PaymentIntent ID
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false, // not paid yet
      paymentIntentId: paymentIntent.id,
      date: Date.now(),
      status: "Pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    res.json({
      success: true,
      message: "Stripe order created",
      order: newOrder,
      clientSecret: paymentIntent.client_secret, // frontend confirms payment
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Mark order as paid (after Stripe confirms)
const markPaid = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status: "Paid", payment: true });
    res.json({ success: true, message: "Order marked as paid" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all orders (Admin)
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user orders
const userOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update order status (Admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, placeOrderStripe, markPaid, allOrders, userOrders, updateStatus };

