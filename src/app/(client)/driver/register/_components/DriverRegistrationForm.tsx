"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import {
  carPhotoSlots,
  documentPhotoSlots,
  personalFields,
} from "./driver-registration-data";

type StepId = 1 | 2 | 3;

type DriverRegistrationValues = {
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
  enginePower: string;
  dailyRate: string;
  carNotes: string;
};

type UploadFieldName =
  | "profilePhoto"
  | "licenseFront"
  | "licenseBack"
  | "licenseSelfie"
  | "carFront"
  | "carBack"
  | "carInterior";

type UploadFiles = Record<UploadFieldName, File | null>;

const stepTabs = [
  { id: 1 as StepId, label: "Хувийн мэдээлэл" },
  { id: 2 as StepId, label: "Баримт бичиг" },
  { id: 3 as StepId, label: "Машины мэдээлэл" },
];

const sectionTitleClasses =
  "grid grid-cols-[28px_1fr] items-center gap-3 border-b border-white/8 pb-2";

const personalFieldNames: Record<string, string> = {
  Овог: "lastName",
  Нэр: "firstName",
  "Утасны дугаар": "phone",
  "И-мэйл хаяг": "email",
  "Регистрийн дугаар": "registerNumber",
  "Төрсөн огноо": "birthDate",
};

const initialFormValues: DriverRegistrationValues = {
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
  enginePower: "",
  dailyRate: "",
  carNotes: "",
};

const initialUploadFiles: UploadFiles = {
  profilePhoto: null,
  licenseFront: null,
  licenseBack: null,
  licenseSelfie: null,
  carFront: null,
  carBack: null,
  carInterior: null,
};

const uploadFieldLabels: Record<UploadFieldName, string> = {
  profilePhoto: "Профайл зураг",
  licenseFront: "Үнэмлэхийн урд тал",
  licenseBack: "Үнэмлэхийн ар тал",
  licenseSelfie: "Selfie + үнэмлэх",
  carFront: "Машины урд зураг",
  carBack: "Машины ар зураг",
  carInterior: "Машины дотор зураг",
};

const acceptedImageTypes = "image/jpeg,image/png,image/webp";

const formatFileSize = (size: number) => {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
};

export const DriverRegistrationForm = () => {
  const [activeStep, setActiveStep] = useState<StepId>(1);
  const [formValues, setFormValues] =
    useState<DriverRegistrationValues>(initialFormValues);
  const [uploadFiles, setUploadFiles] = useState<UploadFiles>(initialUploadFiles);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUploadChange = (
    field: UploadFieldName,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    setUploadFiles((current) => ({
      ...current,
      [field]: file,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (activeStep !== 3 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const missingUpload = (Object.entries(uploadFiles) as Array<
        [UploadFieldName, File | null]
      >).find(([, file]) => !file);

      if (missingUpload) {
        setSubmitError(`${uploadFieldLabels[missingUpload[0]]} дутуу байна.`);
        return;
      }

      const formData = new FormData();

      for (const [key, value] of Object.entries(formValues)) {
        formData.append(key, value);
      }

      for (const [key, file] of Object.entries(uploadFiles) as Array<
        [UploadFieldName, File]
      >) {
        formData.append(key, file);
      }

      const response = await fetch("/api/driver-applications", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();
        setSubmitError(message || "Хүсэлт илгээх үед алдаа гарлаа.");
        return;
      }

      router.push("/driver/dashboard?submitted=1");
    } catch {
      setSubmitError("Хүсэлт илгээх үед алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-6 py-8 text-[var(--color-text)] sm:px-8 lg:px-10">
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-[-0.04em]"
          >
            ALPHARD<span className="text-[var(--color-gold)]">.</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
          >
            ← Профайл руу буцах
          </Link>
        </div>

        <div className="mb-12 grid grid-cols-4 gap-3">
          {[
            { label: "Хэрэглэгч", status: "done", mark: "✓" },
            {
              label: "Жолооч мэдээлэл",
              status:
                activeStep === 1 ? "active" : activeStep > 1 ? "done" : "idle",
              mark: activeStep > 1 ? "✓" : "2",
            },
            {
              label: "Машины мэдээлэл",
              status:
                activeStep === 2 ? "active" : activeStep > 2 ? "done" : "idle",
              mark: activeStep > 2 ? "✓" : "3",
            },
            {
              label: "Хүсэлт илгээх",
              status: activeStep === 3 ? "active" : "idle",
              mark: "4",
            },
          ].map((step, index) => (
            <div key={step.label} className="relative flex flex-col items-center">
              {index < 3 ? (
                <div
                  className={`absolute left-1/2 top-[18px] h-px w-full ${
                    step.status === "done"
                      ? "bg-[var(--color-gold-dark)]"
                      : "bg-white/8"
                  }`}
                />
              ) : null}
              <div
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${
                  step.status === "done"
                    ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-ink)]"
                    : step.status === "active"
                      ? "border-[var(--color-gold)] text-[var(--color-gold)] shadow-[0_0_0_3px_rgba(201,168,76,0.12)]"
                      : "border-white/8 bg-[var(--color-surface)] text-[var(--color-muted)]"
                }`}
              >
                {step.mark}
              </div>
              <span
                className={`mt-2 text-center text-[11px] ${
                  step.status === "active"
                    ? "text-[var(--color-gold)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-3 py-1 text-xs text-[var(--color-gold)]">
            <span>👨‍✈️</span>
            <span>Алхам {activeStep + 1} / 4</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.04em]">
            {activeStep === 1 ? "Жолоочийн " : activeStep === 2 ? "Баримт " : "Машины "}
            <span className="text-[var(--color-gold)]">
              {activeStep === 1
                ? "мэдээлэл"
                : activeStep === 2
                  ? "бичиг"
                  : "мэдээлэл"}
            </span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
            Та доорх мэдээллийг үнэн зөв бөглөнө үү. Бидний баг таны хүсэлтийг
            1-2 ажлын өдөрт хянана.
          </p>
        </div>

        <div className="mb-8 flex gap-1 rounded-xl border border-white/8 bg-[var(--color-surface)] p-1">
          {stepTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveStep(tab.id)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm transition ${
                activeStep === tab.id
                  ? "border border-white/8 bg-[var(--color-panel)] text-[var(--color-text)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeStep === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`${sectionTitleClasses} md:col-span-2`}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-sm">
                👤
              </div>
              <div className="font-display text-sm font-bold text-[var(--color-gold)]">
                Хувийн мэдээлэл
              </div>
            </div>

            {personalFields.map((field) => (
              <label
                key={field.label}
                className="flex flex-col gap-1.5 text-sm md:col-auto"
              >
                <span className="text-xs font-medium text-[var(--color-muted)]">
                  {field.label}{" "}
                  {field.required ? (
                    <span className="text-[var(--color-gold)]">*</span>
                  ) : null}
                </span>
                <input
                  name={personalFieldNames[field.label]}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={
                    formValues[
                      personalFieldNames[field.label] as keyof DriverRegistrationValues
                    ]
                  }
                  onChange={handleFieldChange}
                  className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition focus:border-[rgba(201,168,76,0.45)] focus:bg-[#22222E]"
                />
                {field.hint ? (
                  <span className="text-[11px] text-[#5A5856]">{field.hint}</span>
                ) : null}
              </label>
            ))}

            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Гэрийн хаяг
              </span>
              <input
                name="homeAddress"
                type="text"
                placeholder="Улаанбаатар, Сүхбаатар дүүрэг, 1-р хороо..."
                value={formValues.homeAddress}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition focus:border-[rgba(201,168,76,0.45)] focus:bg-[#22222E]"
              />
            </label>

            <div className={`${sectionTitleClasses} mt-4 md:col-span-2`}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-sm">
                📸
              </div>
              <div className="font-display text-sm font-bold text-[var(--color-gold)]">
                Профайл зураг
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="profilePhoto"
                className="block cursor-pointer rounded-[16px] border border-dashed border-[rgba(201,168,76,0.25)] bg-[var(--color-panel)] px-6 py-10 text-center transition hover:border-[rgba(201,168,76,0.5)] hover:bg-[#22222E]"
              >
                <div className="text-3xl">
                  {uploadFiles.profilePhoto ? "✅" : "🖼️"}
                </div>
                <div className="mt-3 text-sm font-medium">
                  {uploadFiles.profilePhoto
                    ? uploadFiles.profilePhoto.name
                    : "Өөрийн зургийг оруулах"}
                </div>
                <div className="mt-1 text-xs text-[var(--color-muted)]">
                  {uploadFiles.profilePhoto
                    ? `${formatFileSize(uploadFiles.profilePhoto.size)} · Resend-ээр хамт илгээгдэнэ`
                    : "JPG, PNG, WEBP · Дээд тал 5MB · Нүүр тодорхой харагдах ёстой"}
                </div>
                <span className="mt-3 inline-block rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] px-3 py-1 text-[10px] text-[var(--color-gold)]">
                  {uploadFiles.profilePhoto ? "Өөр зураг сонгох" : "Файл сонгох"}
                </span>
              </label>
              <input
                id="profilePhoto"
                type="file"
                accept={acceptedImageTypes}
                onChange={(event) => handleUploadChange("profilePhoto", event)}
                className="sr-only"
              />
            </div>

            <div className="flex gap-3 rounded-[16px] border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] p-4 text-sm md:col-span-2">
              <span>ℹ️</span>
              <p className="leading-6 text-[var(--color-muted)]">
                <strong className="font-medium text-[var(--color-text)]">
                  Анхааруулга:
                </strong>{" "}
                Зургийг гэрэлтэй газар авч, нүүр тодорхой, дэвсгэр цагаан байвал
                сайн. Буруу зураг байвал хүсэлтийг буцааж болно.
              </p>
            </div>
          </div>
        ) : null}

        {activeStep === 2 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`${sectionTitleClasses} md:col-span-2`}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-sm">
                🪪
              </div>
              <div className="font-display text-sm font-bold text-[var(--color-gold)]">
                Жолооны үнэмлэх
              </div>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Үнэмлэхийн дугаар <span className="text-[var(--color-gold)]">*</span>
              </span>
              <input
                name="licenseNumber"
                placeholder="MN-12345678"
                value={formValues.licenseNumber}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Ангилал <span className="text-[var(--color-gold)]">*</span>
              </span>
              <select
                name="licenseClass"
                value={formValues.licenseClass}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              >
                <option value="">Сонгох...</option>
                <option>B ангилал</option>
                <option>C ангилал</option>
                <option>D ангилал</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Олгосон огноо <span className="text-[var(--color-gold)]">*</span>
              </span>
              <input
                name="licenseIssuedAt"
                type="date"
                value={formValues.licenseIssuedAt}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Дуусах огноо <span className="text-[var(--color-gold)]">*</span>
              </span>
              <input
                name="licenseExpiry"
                type="date"
                value={formValues.licenseExpiry}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Жолоодсон жил <span className="text-[var(--color-gold)]">*</span>
              </span>
              <select
                name="drivingExperience"
                value={formValues.drivingExperience}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              >
                <option value="">Сонгох...</option>
                <option>1-2 жил</option>
                <option>3-5 жил</option>
                <option>6-10 жил</option>
                <option>10+ жил</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Осол гарч байсан уу?
              </span>
              <select
                name="accidentHistory"
                value={formValues.accidentHistory}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              >
                <option>Үгүй</option>
                <option>Тийм (тайлбарлана)</option>
              </select>
            </label>

            <div className={`${sectionTitleClasses} mt-4 md:col-span-2`}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-sm">
                📄
              </div>
              <div className="font-display text-sm font-bold text-[var(--color-gold)]">
                Үнэмлэхийн зураг
              </div>
            </div>

            <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
              {documentPhotoSlots.map((slot) => (
                <label
                  htmlFor={slot.id}
                  key={slot.title}
                  className="cursor-pointer rounded-[16px] border border-dashed border-[rgba(201,168,76,0.2)] bg-[var(--color-panel)] px-4 py-8 text-center transition hover:border-[rgba(201,168,76,0.45)] hover:bg-[#22222E]"
                >
                  <div className="text-3xl">
                    {uploadFiles[slot.id] ? "✅" : slot.icon}
                  </div>
                  <div className="mt-2 text-sm font-medium">{slot.title}</div>
                  <div className="mt-1 text-[11px] text-[var(--color-muted)]">
                    {uploadFiles[slot.id]
                      ? `${uploadFiles[slot.id]?.name} · ${formatFileSize(uploadFiles[slot.id]?.size ?? 0)}`
                      : slot.subtitle}
                  </div>
                  <input
                    id={slot.id}
                    type="file"
                    accept={acceptedImageTypes}
                    onChange={(event) => handleUploadChange(slot.id, event)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>

            <div className="flex gap-3 rounded-[16px] border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] p-4 text-sm md:col-span-2">
              <span>✅</span>
              <p className="leading-6 text-[var(--color-muted)]">
                <strong className="font-medium text-[var(--color-text)]">
                  Шаардлага:
                </strong>{" "}
                Зургийн бүх текст тодорхой уншигдах ёстой. Дотогшоо нугалсан
                эсвэл бүдэг зураг хүлээн авахгүй.
              </p>
            </div>
          </div>
        ) : null}

        {activeStep === 3 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`${sectionTitleClasses} md:col-span-2`}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-sm">
                🚙
              </div>
              <div className="font-display text-sm font-bold text-[var(--color-gold)]">
                Машины мэдээлэл
              </div>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Машины марк <span className="text-[var(--color-gold)]">*</span>
              </span>
              <select
                name="carMake"
                value={formValues.carMake}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              >
                <option value="">Сонгох...</option>
                <option>Toyota</option>
                <option>Lexus</option>
                <option>Hyundai</option>
                <option>Kia</option>
                <option>Mitsubishi</option>
                <option>Benz</option>
                <option>BMW</option>
                <option>Бусад</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Загвар <span className="text-[var(--color-gold)]">*</span>
              </span>
              <input
                name="carModel"
                placeholder="Alphard, Hiace, Prius..."
                value={formValues.carModel}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Он <span className="text-[var(--color-gold)]">*</span>
              </span>
              <select
                name="carYear"
                value={formValues.carYear}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              >
                <option value="">Сонгох...</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
                <option>2020</option>
                <option>2019</option>
                <option>2018</option>
                <option>2017</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Өнгө
              </span>
              <input
                name="carColor"
                placeholder="Цагаан, Хар, Мөнгөлөг..."
                value={formValues.carColor}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Улсын дугаар <span className="text-[var(--color-gold)]">*</span>
              </span>
              <input
                name="plateNumber"
                placeholder="1234 УНА"
                value={formValues.plateNumber}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Суудлын тоо <span className="text-[var(--color-gold)]">*</span>
              </span>
              <select
                name="seatCount"
                value={formValues.seatCount}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              >
                <option>4</option>
                <option>5</option>
                <option>7</option>
                <option>8</option>
                <option>10+</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Хурдны хайрцаг
              </span>
              <select
                name="transmission"
                value={formValues.transmission}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              >
                <option>Автомат</option>
                <option>Механик</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Хөдөлгүүрийн хүч
              </span>
              <input
                name="enginePower"
                placeholder="2.0L, 3.5L..."
                value={formValues.enginePower}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Өдрийн үнэ (₮) <span className="text-[var(--color-gold)]">*</span>
              </span>
              <input
                name="dailyRate"
                type="number"
                min="0"
                placeholder="180000"
                value={formValues.dailyRate}
                onChange={handleFieldChange}
                className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              />
            </label>

            <div className={`${sectionTitleClasses} mt-4 md:col-span-2`}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-sm">
                📷
              </div>
              <div className="font-display text-sm font-bold text-[var(--color-gold)]">
                Машины зургууд
              </div>
            </div>

            <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
              {carPhotoSlots.map((slot) => (
                <label
                  htmlFor={slot.id}
                  key={slot.title}
                  className="cursor-pointer rounded-[16px] border border-dashed border-[rgba(201,168,76,0.2)] bg-[var(--color-panel)] px-4 py-8 text-center transition hover:border-[rgba(201,168,76,0.45)] hover:bg-[#22222E]"
                >
                  <div className="text-3xl">
                    {uploadFiles[slot.id] ? "✅" : slot.icon}
                  </div>
                  <div className="mt-2 text-sm font-medium">{slot.title}</div>
                  <div className="mt-1 text-[11px] text-[var(--color-muted)]">
                    {uploadFiles[slot.id]
                      ? `${uploadFiles[slot.id]?.name} · ${formatFileSize(uploadFiles[slot.id]?.size ?? 0)}`
                      : slot.subtitle}
                  </div>
                  <input
                    id={slot.id}
                    type="file"
                    accept={acceptedImageTypes}
                    onChange={(event) => handleUploadChange(slot.id, event)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>

            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Нэмэлт тайлбар
              </span>
              <textarea
                name="carNotes"
                placeholder="Машины онцлог, тоноглол, нэмэлт мэдээлэл..."
                value={formValues.carNotes}
                onChange={handleFieldChange}
                className="min-h-24 rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
              />
            </label>

            <div className="flex gap-3 rounded-[16px] border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] p-4 text-sm md:col-span-2">
              <span>📨</span>
              <p className="leading-6 text-[var(--color-muted)]">
                <strong className="font-medium text-[var(--color-text)]">
                  Хүсэлт илгээсний дараа:
                </strong>{" "}
                Бидэнд имэйлээр мэдэгдэл очно. Бид таны мэдээллийг 1-2 ажлын
                өдөрт шалгаж, батлагдвал жолоочийн dashboard нээгдэнэ.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setActiveStep((current) => {
                  setSubmitError(null);
                  return current === 1 ? 1 : ((current - 1) as StepId);
                })
              }
              className="rounded-xl border border-white/8 px-6 py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
            >
              ← Буцах
            </button>
            <button type="button" className="text-sm text-[var(--color-muted)] underline underline-offset-4 transition hover:text-[var(--color-gold)]">
              Ноорог хадгалах
            </button>
          </div>

          <button
            type={activeStep === 3 ? "submit" : "button"}
            onClick={() => {
              if (activeStep !== 3) {
                setSubmitError(null);
                setActiveStep((current) => ((current + 1) as StepId));
              }
            }}
            disabled={isSubmitting}
            className="rounded-xl bg-[var(--color-gold)] px-8 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-light)]"
          >
            {activeStep === 3
              ? isSubmitting
                ? "Илгээж байна..."
                : "Хүсэлт илгээх →"
              : "Дараагийн алхам →"}
          </button>
        </div>
        {submitError ? (
          <div className="mt-4 rounded-xl border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-4 py-3 text-sm text-[#F87171]">
            {submitError}
          </div>
        ) : null}
      </form>
    </main>
  );
};
