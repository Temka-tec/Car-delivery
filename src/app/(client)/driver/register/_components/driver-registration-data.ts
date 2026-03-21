export const progressSteps = [
  { label: "Хэрэглэгч", status: "done" },
  { label: "Жолооч мэдээлэл", status: "active" },
  { label: "Машины мэдээлэл", status: "upcoming" },
  { label: "Хүсэлт илгээх", status: "upcoming" },
] as const;

export const personalFields = [
  {
    label: "Овог",
    required: true,
    placeholder: "Болд",
    type: "text",
    hint: "",
  },
  {
    label: "Нэр",
    required: true,
    placeholder: "Батаа",
    type: "text",
    hint: "",
  },
  {
    label: "Утасны дугаар",
    required: true,
    placeholder: "+976 9900 0000",
    type: "tel",
    hint: "",
  },
  {
    label: "И-мэйл хаяг",
    required: true,
    placeholder: "bataa@example.com",
    type: "email",
    hint: "Clerk бүртгэлийн имэйлтэй ижил байна",
  },
  {
    label: "Регистрийн дугаар",
    required: true,
    placeholder: "УА12345678",
    type: "text",
    hint: "",
  },
  {
    label: "Төрсөн огноо",
    required: true,
    placeholder: "",
    type: "date",
    hint: "",
  },
] as const;

export const documentPhotoSlots = [
  { icon: "📋", title: "Урд тал", subtitle: "Тодорхой, бүтэн" },
  { icon: "🔄", title: "Ар тал", subtitle: "Тодорхой, бүтэн" },
  { icon: "🤳", title: "Selfie + үнэмлэх", subtitle: "Нэгэн зэрэг" },
] as const;

export const carPhotoSlots = [
  { icon: "🚗", title: "Урд тал", subtitle: "Гаднаас" },
  { icon: "🔙", title: "Ар тал", subtitle: "Дугаар харагдах" },
  { icon: "🛋️", title: "Дотор тал", subtitle: "Сандал, хүрд" },
] as const;
