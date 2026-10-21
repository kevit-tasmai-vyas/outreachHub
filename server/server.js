import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "../server/config/db.js";

config();
connectDB();

const app = express();

app.use(cors());
app.use(express());

// test route
app.get("/", (req, res) => {
  res.send("OutreachHub server is running");
});

// routes will be added here later
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/contacts", require("./routes/contactRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});