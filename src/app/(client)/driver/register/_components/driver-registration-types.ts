export type StepId = 1 | 2 | 3;

export type DriverRegistrationValues = {
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  registerNumber: string;
  birthDate: string;
  homeAddress: string;
  licenseNumber: string;
  licenseClass: string;
  licenseIssuedAt: string;
  licenseExpiry: string;
  drivingExperience: string;
  accidentHistory: string;
  carMake: string;
  carModel: string;
  carYear: string;
  carColor: string;
  plateNumber: string;
  seatCount: string;
  transmission: string;
  dailyRate: string;
  carNotes: string;
};

export type UploadFieldName =
  | "profilePhoto"
  | "licenseFront"
  | "licenseBack"
  | "licenseSelfie"
  | "carFront"
  | "carBack"
  | "carInterior";

export type UploadFiles = Record<UploadFieldName, File | null>;

export const stepTabs = [
  { id: 1 as StepId, label: "Хувийн мэдээлэл" },
  { id: 2 as StepId, label: "Баримт бичиг" },
  { id: 3 as StepId, label: "Машины мэдээлэл" },
];

export const sectionTitleClasses =
  "grid grid-cols-[28px_1fr] items-center gap-3 border-b border-white/8 pb-2";

export const personalFieldNames: Record<string, string> = {
  Овог: "lastName",
  Нэр: "firstName",
  "Утасны дугаар": "phone",
  "И-мэйл хаяг": "email",
  "Регистрийн дугаар": "registerNumber",
  "Төрсөн огноо": "birthDate",
};

export const initialFormValues: DriverRegistrationValues = {
  lastName: "",
  firstName: "",
  phone: "",
  email: "",
  registerNumber: "",
  birthDate: "",
  homeAddress: "",
  licenseNumber: "",
  licenseClass: "",
  licenseIssuedAt: "",
  licenseExpiry: "",
  drivingExperience: "",
  accidentHistory: "Үгүй",
  carMake: "",
  carModel: "",
  carYear: "",
  carColor: "",
  plateNumber: "",
  seatCount: "4",
  transmission: "Автомат",
  dailyRate: "",
  carNotes: "",
};

export const mongolianRegisterLetters = [
  "А",
  "Б",
  "В",
  "Г",
  "Д",
  "Е",
  "Ё",
  "Ж",
  "З",
  "И",
  "Й",
  "К",
  "Л",
  "М",
  "Н",
  "О",
  "Ө",
  "П",
  "Р",
  "С",
  "Т",
  "У",
  "Ү",
  "Ф",
  "Х",
  "Ц",
  "Ч",
  "Ш",
  "Щ",
  "Ъ",
  "Ы",
  "Ь",
  "Э",
  "Ю",
  "Я",
] as const;

export const initialUploadFiles: UploadFiles = {
  profilePhoto: null,
  licenseFront: null,
  licenseBack: null,
  licenseSelfie: null,
  carFront: null,
  carBack: null,
  carInterior: null,
};

export const uploadFieldLabels: Record<UploadFieldName, string> = {
  profilePhoto: "Профайл зураг",
  licenseFront: "Үнэмлэхийн урд тал",
  licenseBack: "Үнэмлэхийн ар тал",
  licenseSelfie: "Selfie + үнэмлэх",
  carFront: "Машины урд зураг",
  carBack: "Машины ар зураг",
  carInterior: "Машины дотор зураг",
};

export const acceptedImageTypes = "image/jpeg,image/png,image/webp";

export const demoTextFile = (name: string) =>
  new File(["demo"], name, { type: "image/jpeg" });

export const formatFileSize = (size: number) => {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
};
