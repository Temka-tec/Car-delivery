import { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startedAt: { type: Date },
    endedAt: { type: Date },
    destination: { type: String },
    notes: { type: String },
    totalPrice: { type: Number },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export const Booking = models.Booking || model("Booking", BookingSchema);
