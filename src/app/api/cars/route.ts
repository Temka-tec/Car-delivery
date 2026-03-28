import { NextResponse } from "next/server";
import { getAvailableCars } from "@/lib/car-data";

export async function GET() {
  const cars = await getAvailableCars();
  return NextResponse.json(cars);
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Энэ endpoint одоогоор унших зориулалттай байна.",
    },
    { status: 405 },
  );
}
