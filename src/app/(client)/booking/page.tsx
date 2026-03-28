import { getAvailableCars } from "@/lib/car-data";
import { BookingExperience } from "./_components/BookingExperience";

export default async function BookingPage() {
  const cars = await getAvailableCars();

  return <BookingExperience initialCars={cars} />;
}
