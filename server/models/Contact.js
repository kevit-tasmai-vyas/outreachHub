import { Schema, model } from "mongoose";

export const DEFAULT_IMAGE = "../../assets/images/profile_default.jpeg";

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    tags: [{ type: String, lowercase: true, trim: true }],
    image: { type: String, trim: true, default: DEFAULT_IMAGE },
  },
  { timestamps: true }
);

export default model("Contact", contactSchema);