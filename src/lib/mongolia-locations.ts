type LocationGroup = {
  aimag: string;
  short: string;
  departures: string[];
};

export const mongoliaLocations: LocationGroup[] = [
  {
    aimag: "Улаанбаатар",
    short: "УБ.",
    departures: [
      "УБ.Сүхбаатар дүүрэг",
      "УБ.Чингэлтэй дүүрэг",
      "УБ.Баянзүрх дүүрэг",
      "УБ.Хан-Уул дүүрэг",
      "УБ.Сонгинохайрхан дүүрэг",
      "УБ.Баянгол дүүрэг",
    ],
  },
  {
    aimag: "Архангай",
    short: "Ар.",
    departures: [
      "Ар.Өгийн нуур",
      "Ар.Жаргалант",
      "Ар.Ихтамир",
      "Ар.Өлзийт",
      "Ар.Өндөр-Улаан",
      "Ар.Тариат",
      "Ар.Хайрхан",
      "Ар.Хангай",
      "Ар.Хотонт",
      "Ар.Цахир",
      "Ар.Цэнхэр",
      "Ар.Цэцэрлэг сум",
      "Ар.Чулуут",
      "Ар.Чулуутын гүүр",
      "Ар.Эрдэнэбулган /аймгийн төв/",
      "Ар.Эрдэнэмандал",
    ],
  },
  {
    aimag: "Баян-Өлгий",
    short: "Бө.",
    departures: [
      "Бө.Өлгий /аймгийн төв/",
      "Бө.Алтай",
      "Бө.Буянт",
      "Бө.Сагсай",
      "Бө.Дэлүүн",
    ],
  },
  {
    aimag: "Баянхонгор",
    short: "Бн.",
    departures: [
      "Бн.Баянбулаг",
      "Бн.Баянхонгор",
      "Бн.Бөмбөгөр",
      "Бн.Бууцагаан",
      "Бн.Өлзийт ПОСТ",
      "Бн.Хүрээмарал",
    ],
  },
  {
    aimag: "Булган",
    short: "Бу.",
    departures: [
      "Бу.Баяннуур",
      "Бу.Булган",
      "Бу.Бүрэгхангай",
      "Бу.Гурванбулаг",
      "Бу.Хутаг-Өндөр",
    ],
  },
  {
    aimag: "Дархан-Уул",
    short: "Да.",
    departures: [
      "Да.Дархан /аймгийн төв/",
      "Да.Хонгор",
      "Да.Орхон",
      "Да.Шарын гол",
    ],
  },
  {
    aimag: "Дорноговь",
    short: "Дг.",
    departures: [
      "Дг.Сайншанд /аймгийн төв/",
      "Дг.Замын-Үүд",
      "Дг.Айраг",
      "Дг.Өргөн",
    ],
  },
  {
    aimag: "Дорнод",
    short: "Дн.",
    departures: [
      "Дн.Хэрлэн /аймгийн төв/",
      "Дн.Чойбалсан",
      "Дн.Халхгол",
      "Дн.Булган",
    ],
  },
  {
    aimag: "Орхон",
    short: "Ор.",
    departures: [
      "Ор.Баян-Өндөр /аймгийн төв/",
      "Ор.Жаргалант сум",
    ],
  },
  {
    aimag: "Өмнөговь",
    short: "Өм.",
    departures: [
      "Өм.Даланзадгад /аймгийн төв/",
      "Өм.Ханбогд",
      "Өм.Цогтцэций",
      "Өм.Гурвантэс",
    ],
  },
  {
    aimag: "Сэлэнгэ",
    short: "Сэ.",
    departures: [
      "Сэ.Сүхбаатар /аймгийн төв/",
      "Сэ.Мандал",
      "Сэ.Зүүнбүрэн",
      "Сэ.Баянгол",
    ],
  },
  {
    aimag: "Төв",
    short: "Тө.",
    departures: [
      "Тө.Зуунмод /аймгийн төв/",
      "Тө.Баянчандмань",
      "Тө.Борнуур",
      "Тө.Эрдэнэ",
    ],
  },
  {
    aimag: "Увс",
    short: "Ув.",
    departures: [
      "Ув.Улаангом /аймгийн төв/",
      "Ув.Тариалан",
      "Ув.Зүүнговь",
      "Ув.Наранбулаг",
    ],
  },
  {
    aimag: "Ховд",
    short: "Хо.",
    departures: [
      "Хо.Жаргалант сум",
      "Хо.Мянгад",
      "Хо.Буянт",
      "Хо.Дарви",
    ],
  },
  {
    aimag: "Хөвсгөл",
    short: "Хө.",
    departures: [
      "Хө.Мөрөн /аймгийн төв/",
      "Хө.Хатгал",
      "Хө.Тариалан",
      "Хө.Ренчинлхүмбэ",
    ],
  },
  {
    aimag: "Хэнтий",
    short: "Хэ.",
    departures: [
      "Хэ.Хэрлэн /аймгийн төв/",
      "Хэ.Батноров",
      "Хэ.Дадал",
      "Хэ.Өмнөдэлгэр",
    ],
  },
] as const;

export const departureOptions = mongoliaLocations.flatMap((location) =>
  location.departures.map((value) => ({
    aimag: location.aimag,
    value,
  })),
);

export const defaultLocationSelection = {
  aimag: "Улаанбаатар",
  destination: "УБ.Сүхбаатар дүүрэг",
} as const;

export const parseLocationSelection = (value: string | null | undefined) => {
  if (!value) {
    return defaultLocationSelection;
  }

  const normalized = value.trim();
  const matchedAimag = mongoliaLocations.find((location) =>
    normalized.includes(location.aimag),
  );
  const matchedDestination = departureOptions.find(({ value: optionValue }) =>
    normalized.includes(optionValue.split(" ").at(0) || optionValue),
  );

  return {
    aimag: matchedAimag?.aimag || defaultLocationSelection.aimag,
    destination: matchedDestination?.value || defaultLocationSelection.destination,
  };
};
