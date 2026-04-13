import express from "express";
import { createOrder, verifyPayment, cancelPro } from "../controllers/payment.controller.js";
import { isLoggedIn } from "../middlewares/isAuthenticated.middleware.js";

const router = express.Router();

router.post("/orders", isLoggedIn, createOrder);
router.post("/verify", isLoggedIn, verifyPayment);
router.post("/cancel", isLoggedIn, cancelPro);

export default router;
