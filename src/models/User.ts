import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    phone: { type: String },
    role: {
      type: String,
      enum: ["USER", "DRIVER", "COMPANY_ADMIN", "SUPER_ADMIN"],
      default: "USER",
    },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true },
);

export const User = models.User || model("User", UserSchema);
