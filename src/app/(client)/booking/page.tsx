import { auth } from "@clerk/nextjs/server";
import { getAvailableCars } from "@/lib/car-data";
import { BookingExperience } from "./_components/BookingExperience";

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const { userId } = await auth();
  const cars = await getAvailableCars(undefined, userId);

  return <BookingExperience initialCars={cars} />;
}
