import { cars } from "../../_components/landing-data";

export const searchDefaults = {
  startDate: "2026-03-25",
  endDate: "2026-03-28",
  direction: "Улаанбаатар → Хөвсгөл",
  seats: "7-8",
  priceMax: 300000,
};

export const filterGroups = [
  {
    title: "Марк",
    options: [
      { label: "Toyota", count: 8, checked: true },
      { label: "Lexus", count: 3, checked: false },
      { label: "Hyundai", count: 5, checked: true },
      { label: "Mitsubishi", count: 4, checked: false },
      { label: "Benz", count: 2, checked: false },
    ],
  },
  {
    title: "Суудлын тоо",
    options: [
      { label: "4-5 суудал", count: 9, checked: false },
      { label: "7-8 суудал", count: 7, checked: true },
      { label: "10+ суудал", count: 3, checked: false },
    ],
  },
  {
    title: "Хурдны хайрцаг",
    options: [
      { label: "Автомат", count: 16, checked: true },
      { label: "Механик", count: 3, checked: false },
    ],
  },
  {
    title: "Нэмэлт",
    options: [
      { label: "GPS", checked: false },
      { label: "4WD", checked: false },
      { label: "Кондиционер", checked: false },
      { label: "WiFi", checked: false },
    ],
  },
] as const;

export const bookingCars = cars.map((car, index) => ({
  id: car.slug,
  icon: car.icon,
  name: car.name,
  year: car.year,
  meta: `${car.color} · ${car.transmission} · ${car.engine} · ${car.features[0]?.value ?? car.tags[0]}`,
  features: car.features.slice(0, 4).map((feature) => `${feature.icon} ${feature.value}`),
  driver: {
    initial: car.driver.initial,
    name: car.driver.name,
    stats: `${car.driver.rating} · ${car.driver.trips} аялал`,
  },
  rating: car.rating.toFixed(1),
  ratingCount: String(car.reviewCount),
  price: car.priceValue,
  badge: car.badge === "Сул" ? "● Сул" : `● ${car.badge}`,
  selected: index === 0,
  premium: car.badge !== "Сул",
})) as const;
