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

export const bookingCars = [
  {
    id: "alphard",
    icon: "🚙",
    name: "Toyota Alphard",
    year: "2022",
    meta: "Цагаан · Автомат · 3.5L · 7 суудал",
    features: ["🛡️ Даатгалтай", "📍 GPS", "❄️ Кондиционер", "🎵 Premium audio"],
    driver: {
      initial: "Б",
      name: "Болд Батаа",
      stats: "4.9★ · 120 аялал",
    },
    rating: "4.9",
    ratingCount: "48",
    price: 180000,
    badge: "● Сул",
    selected: true,
    premium: false,
  },
  {
    id: "hiace",
    icon: "🚐",
    name: "Toyota Hiace",
    year: "2021",
    meta: "Мөнгөлөг · Автомат · 2.8L · 10 суудал",
    features: ["🛡️ Даатгалтай", "4WD", "❄️ Кондиционер"],
    driver: {
      initial: "О",
      name: "Очирбат Г",
      stats: "4.7★ · 85 аялал",
    },
    rating: "4.7",
    ratingCount: "31",
    price: 220000,
    badge: "● Сул",
    selected: false,
    premium: false,
  },
  {
    id: "lx570",
    icon: "🏎️",
    name: "Lexus LX570",
    year: "2023",
    meta: "Хар · Автомат · 5.7L · 5 суудал",
    features: ["🛡️ Даатгалтай", "📍 GPS", "4WD", "🍷 Luxury"],
    driver: {
      initial: "Д",
      name: "Дорж Нямаа",
      stats: "5.0★ · 200 аялал",
    },
    rating: "5.0",
    ratingCount: "89",
    price: 350000,
    badge: "● Premium",
    selected: false,
    premium: true,
  },
] as const;
