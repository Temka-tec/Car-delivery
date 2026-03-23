// src/app/api/cars/route.ts
import { connectDB } from "@/lib/mongoose";
import { Car } from "@/models/Car";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const cars = await Car.find({ status: "AVAILABLE" })
    .populate("driverId")
    .lean();
  return NextResponse.json(cars);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const car = await Car.create(body);
  return NextResponse.json(car);
}
