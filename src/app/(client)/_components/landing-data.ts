export const navItems = [
  { href: "#cars", label: "Машинууд" },
  { href: "#drivers", label: "Жолоочид" },
  { href: "#companies", label: "Компаниуд" },
  { href: "#about", label: "Тухай" },
] as const;

export const stats = [
  { value: "120+", label: "Идэвхтэй машин" },
  { value: "85+", label: "Жолооч" },
  { value: "12", label: "Компани" },
  { value: "4.9★", label: "Үнэлгээ" },
] as const;

export const companies = [
  {
    name: "Altai Motors",
    detail: "8 машин · Улаанбаатар",
    mark: "A",
    className: "bg-[var(--color-gold)] text-[var(--color-ink)]",
  },
  {
    name: "Steppe Drive",
    detail: "12 машин · Дархан",
    mark: "S",
    className: "bg-[#1A6B8A] text-white",
  },
  {
    name: "Gobi Rentals",
    detail: "6 машин · Өмнөговь",
    mark: "G",
    className: "bg-[#3A5A2A] text-white",
  },
] as const;

export const cars = [
  {
    slug: "toyota-alphard-2022",
    icon: "SUV",
    badge: "Сул",
    badgeClassName:
      "border border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.15)] text-[var(--color-gold)]",
    name: "Toyota Alphard",
    detail: "2022 · Цагаан · Автомат",
    tags: ["7 суудал", "Кондиционер", "GPS"],
    price: "₮180,000",
    priceValue: 180000,
    year: "2022",
    color: "Цагаан",
    transmission: "Автомат",
    rating: 4.9,
    reviewCount: 48,
    location: "Улаанбаатар",
    engine: "3.5L V6",
    insurance: "Бүтэн даатгалтай",
    gallery: ["🚙", "🛋️", "🔙", "📍"],
    features: [
      { label: "Суудал", value: "7 суудал", icon: "💺" },
      { label: "Хурдны хайрцаг", value: "Автомат", icon: "⚙️" },
      { label: "Хөдөлгүүр", value: "3.5L V6", icon: "🛢️" },
      { label: "Кондиционер", value: "Тийм", icon: "❄️" },
      { label: "GPS", value: "Тийм", icon: "📍" },
      { label: "Даатгал", value: "Бүтэн", icon: "🛡️" },
    ],
    driver: {
      initial: "Б",
      name: "Болд Батаа",
      detail: "B ангилал · 8 жил",
      rating: "4.9★",
      trips: 120,
      phone: "+976 9911 2233",
    },
    destinations: [
      { name: "Хөвсгөл нуур", distanceKm: 480, days: "3-4 өдөр" },
      { name: "Тэрэлж", distanceKm: 120, days: "1 өдөр" },
      { name: "Өмнөговь", distanceKm: 550, days: "4-5 өдөр" },
      { name: "Дархан", distanceKm: 220, days: "2-3 өдөр" },
    ],
    reviews: [
      {
        initial: "С",
        name: "Сарантуяа Б",
        date: "3 сарын 15",
        rating: "★★★★★",
        text: "Хөвсгөл хүртэл маш тав тухтай явсан. Машин цэвэрхэн, жолооч цагтаа ирсэн.",
      },
      {
        initial: "Г",
        name: "Ганбаатар О",
        date: "3 сарын 8",
        rating: "★★★★★",
        text: "Тэрэлж рүү гэр бүлээрээ явсан, зайтай суудалтай, үйлчилгээ сайн байсан.",
      },
    ],
  },
  {
    slug: "toyota-hiace-2021",
    icon: "VAN",
    badge: "Сул",
    badgeClassName:
      "border border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.15)] text-[var(--color-gold)]",
    name: "Toyota Hiace",
    detail: "2021 · Мөнгөлөг · Автомат",
    tags: ["10 суудал", "4WD"],
    price: "₮220,000",
    priceValue: 220000,
    year: "2021",
    color: "Мөнгөлөг",
    transmission: "Автомат",
    rating: 4.7,
    reviewCount: 31,
    location: "Дархан",
    engine: "2.8L Turbo Diesel",
    insurance: "Стандарт даатгалтай",
    gallery: ["🚐", "💺", "🧳", "🛣️"],
    features: [
      { label: "Суудал", value: "10 суудал", icon: "💺" },
      { label: "Хурдны хайрцаг", value: "Автомат", icon: "⚙️" },
      { label: "Хөдөлгүүр", value: "2.8L Turbo", icon: "🛢️" },
      { label: "4WD", value: "Тийм", icon: "🛞" },
      { label: "Ачаа", value: "Их багтаамж", icon: "🧳" },
      { label: "Даатгал", value: "Стандарт", icon: "🛡️" },
    ],
    driver: {
      initial: "О",
      name: "Очирбат Г",
      detail: "D ангилал · 11 жил",
      rating: "4.7★",
      trips: 85,
      phone: "+976 8800 4455",
    },
    destinations: [
      { name: "Эрдэнэт", distanceKm: 380, days: "3 өдөр" },
      { name: "Булган", distanceKm: 330, days: "2-3 өдөр" },
      { name: "Арвайхээр", distanceKm: 420, days: "3-4 өдөр" },
      { name: "Хархорин", distanceKm: 360, days: "3 өдөр" },
    ],
    reviews: [
      {
        initial: "Н",
        name: "Номин Э",
        date: "3 сарын 11",
        rating: "★★★★★",
        text: "Олуулаа аялалд явахад яг тохирсон. Ачаа их багтсан.",
      },
      {
        initial: "Т",
        name: "Төгөлдөр Ж",
        date: "2 сарын 28",
        rating: "★★★★☆",
        text: "Замын урт аялалд тухтай байсан, жолооч туршлагатай.",
      },
    ],
  },
  {
    slug: "lexus-lx570-2023",
    icon: "LUX",
    badge: "Premium",
    badgeClassName:
      "border border-[rgba(150,100,255,0.4)] bg-[rgba(100,60,200,0.15)] text-[#AA88FF]",
    name: "Lexus LX570",
    detail: "2023 · Хар · Автомат",
    tags: ["5 суудал", "Luxury"],
    price: "₮350,000",
    priceValue: 350000,
    year: "2023",
    color: "Хар",
    transmission: "Автомат",
    rating: 5,
    reviewCount: 89,
    location: "Улаанбаатар",
    engine: "5.7L V8",
    insurance: "Premium хамгаалалт",
    gallery: ["🏎️", "✨", "🪑", "🌃"],
    features: [
      { label: "Суудал", value: "5 суудал", icon: "💺" },
      { label: "Хурдны хайрцаг", value: "Автомат", icon: "⚙️" },
      { label: "Хөдөлгүүр", value: "5.7L V8", icon: "🛢️" },
      { label: "Luxury", value: "VIP салон", icon: "🍷" },
      { label: "4WD", value: "Тийм", icon: "🛞" },
      { label: "Даатгал", value: "Premium", icon: "🛡️" },
    ],
    driver: {
      initial: "Д",
      name: "Дорж Нямаа",
      detail: "B ангилал · 15 жил",
      rating: "5.0★",
      trips: 200,
      phone: "+976 9505 2233",
    },
    destinations: [
      { name: "Тэрэлж Resort", distanceKm: 120, days: "1 өдөр" },
      { name: "Хустай", distanceKm: 100, days: "1 өдөр" },
      { name: "Шарын гол", distanceKm: 240, days: "2 өдөр" },
      { name: "Өмнөговь VIP tour", distanceKm: 550, days: "4-5 өдөр" },
    ],
    reviews: [
      {
        initial: "А",
        name: "Алтангэрэл П",
        date: "3 сарын 12",
        rating: "★★★★★",
        text: "Бизнес зочдоо тосоход маш цэвэрхэн, дээд зэрэглэлийн мэдрэмж төрүүлсэн.",
      },
      {
        initial: "М",
        name: "Мишээл С",
        date: "3 сарын 2",
        rating: "★★★★★",
        text: "Хотын болон хотоос гарсан аялалд аль алинд нь маш тухтай байсан.",
      },
    ],
  },
] as const;

export const flowSteps = [
  {
    title: "Бүртгүүлэх",
    description: "Clerk-р хялбар бүртгэл",
  },
  {
    title: "Машин сонгох",
    description: "Сул машинаас захиалга",
  },
  {
    title: "Жолооч хүлээн авна",
    description: "Мэдэгдэл автоматаар очно",
  },
  {
    title: "Аяллаа эхлүүл",
    description: "Дуусмагц төлбөр тооцоо",
  },
] as const;

export const driverSteps = [
  "Хэрэглэгчээр бүртгүүлэх (Clerk)",
  'Профайл → "Жолооч болох" товч',
  "Утас, имэйл, зураг, жолооны үнэмлэх",
  "Машины мэдээлэл, зураг оруулах",
  "Бидэнд имэйлээр хүсэлт ирнэ → Баталгаажуулна",
] as const;

export type LandingCar = (typeof cars)[number];

export const getCarBySlug = (slug: string) =>
  cars.find((car) => car.slug === slug);
