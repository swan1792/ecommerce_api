

import userModel from "../models/userModel.js";

// Get user cart
export const getUserCart = async (req, res) => {
    try {
        const userId = req.user._id; // from authUser middleware
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        const cartData = user.cartData || {};
        res.json({ success: true, cartData });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: err.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, size } = req.body;

        if (!productId || !size)
            return res.json({ success: false, message: "Product ID and size required" });

        // Use findByIdAndUpdate with $set and $inc
        const update = {
            $setOnInsert: { cartData: {} },
            $inc: {}
        };

        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        user.cartData = user.cartData || {};
        if (!user.cartData[productId]) user.cartData[productId] = {};
        if (!user.cartData[productId][size]) user.cartData[productId][size] = 1;
        else user.cartData[productId][size] += 1;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { cartData: user.cartData },
            { new: true }
        );

        res.json({ success: true, cartData: updatedUser.cartData });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: err.message });
    }
};

// Update cart item quantity (or remove if quantity = 0)
export const updateCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, size, quantity } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        if (!user.cartData || !user.cartData[productId] || !user.cartData[productId][size]) {
            return res.json({ success: false, message: "Cart item not found" });
        }

        if (quantity > 0) {
            user.cartData[productId][size] = quantity;
        } else {
            delete user.cartData[productId][size];
            if (Object.keys(user.cartData[productId]).length === 0) {
                delete user.cartData[productId];
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { cartData: user.cartData },
            { new: true }
        );

        res.json({ success: true, cartData: updatedUser.cartData });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: err.message });
    }
};

