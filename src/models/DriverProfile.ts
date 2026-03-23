import { Schema, model, models } from "mongoose";

const DriverProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clerkId: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    licenseClass: { type: String },
    licenseExpiry: { type: Date },
    photoUrl: { type: String },
    licensePhotoF: { type: String },
    licensePhotoB: { type: String },
    experience: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    isOnline: { type: Boolean, default: false },
    phone: { type: String },
  },
  { timestamps: true },
);

export const DriverProfile =
  models.DriverProfile || model("DriverProfile", DriverProfileSchema);
