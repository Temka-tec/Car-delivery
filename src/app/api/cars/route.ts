import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "MongoDB setup removed. This endpoint is currently unavailable.",
    },
    { status: 503 },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      error: "MongoDB setup removed. This endpoint is currently unavailable.",
    },
    { status: 503 },
  );
}
