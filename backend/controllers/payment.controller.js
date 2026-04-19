import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    
    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      user: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "pending",
    });

    res.json(order);
  } catch (error) {
    //console.error("Razorpay Order Error Details:", error);
    res.status(500).json({ error: error.message || "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === signature) {
      const payment = await Payment.findOne({ orderId: razorpayOrderId });
      if (!payment) {
        return res.status(404).json({ error: "Payment record not found" });
      }

      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "completed";
      await payment.save();

      // Upgrade User to Pro
      const user = await User.findById(payment.user);
      if (user) {
        user.isPro = true;
        // Also set isPremium for backward compatibility if used
        user.isPremium = true; 
        await user.save();
      }

      res.json({ success: true, message: "Payment verified and Pro status activated!" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    //console.error("Payment Verification Error:", error);
    res.status(500).json({ error: "Server error during verification" });
  }
};

export const cancelPro = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isPro = false;
    user.isPremium = false;
    await user.save();

    res.json({ success: true, message: "Pro membership cancelled successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel membership" });
  }
};
