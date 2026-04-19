export const searchDefaults = {
  startDate: "",
  endDate: "",
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
