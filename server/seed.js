import { config } from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import mongoose from "mongoose";

config();

const seedData = async () => {
  try {
    await connectDB();

    // remove old users so we can run this file again and again
    await User.deleteMany();

    // never save a plain password, always hash it
    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Test Editor",
      email: "editor@test.com",
      password: hashedPassword,
      role: "editor",
    });

    console.log(mongoose.connection.host);
    console.log(mongoose.connection.port);
    console.log(mongoose.connection.name);
    console.log(await User.countDocuments());
    
    
    
    console.log("Seed done: user created");
    process.exit(0);
  } catch (error) {
    console.log("Seed failed:", error.message);
    process.exit(1);
  }
};

seedData();