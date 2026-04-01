import type { StepId } from "./driver-registration-types";
import { stepTabs } from "./driver-registration-types";

type DriverRegistrationTabsProps = {
  activeStep: StepId;
  onSelect: (step: StepId) => void;
};

export const DriverRegistrationTabs = ({
  activeStep,
  onSelect,
}: DriverRegistrationTabsProps) => {
  return (
    <div className="mb-8 flex gap-1 rounded-xl border border-white/8 bg-[var(--color-surface)] p-1">
      {stepTabs.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => onSelect(tab.id)}
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
  );
};
