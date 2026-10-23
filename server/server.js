import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"

config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);



// test route
app.get("/", (req, res) => {
  res.send("OutreachHub server is running");
});

// routes will be added here later
// app.use("/api/contacts", require("./routes/contactRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});