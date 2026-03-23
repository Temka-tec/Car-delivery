import { Schema, model, models } from "mongoose";

const CarSchema = new Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String },
    plate: { type: String, required: true, unique: true },
    seats: { type: Number, required: true },
    transmission: { type: String },
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED", "OFFLINE", "MAINTENANCE"],
      default: "AVAILABLE",
    },
    dailyRate: { type: Number, required: true },
    photos: [String],
    features: [String],
    driverId: { type: Schema.Types.ObjectId, ref: "DriverProfile" },
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true },
);

export const Car = models.Car || model("Car", CarSchema);
