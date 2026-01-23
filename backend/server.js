import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("DB Connected!!");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
    process.exit(1);
  });
