import React from "react";
import { Check, ChevronDown } from "lucide-react";

export const Dropdown = ({
  label,
  options,
  selectedValues,
  onChange,
  isOpen,
  onToggle,
  align = "left",
}) => {
  const count = selectedValues.length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 whitespace-nowrap rounded-xl border px-3.5 py-2.5 text-sm transition-colors duration-300 ${
          count > 0 || isOpen
            ? "border-champagne/40 bg-champagne/10 text-champagne"
            : "border-transparent text-white/70 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
        }`}
      >
        {label}
        {count > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-champagne px-1 text-[11px] font-semibold text-ink">
            {count}
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-white/10 bg-ink-card/95 shadow-2xl shadow-black/60 backdrop-blur-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="max-h-80 space-y-0.5 overflow-y-auto p-2 scrollbar-thin">
            {options.map((option) => {
              const isChecked = selectedValues.includes(option);

              return (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/[0.06]"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      onChange(
                        isChecked
                          ? selectedValues.filter((value) => value !== option)
                          : [...selectedValues, option]
                      )
                    }
                    className="sr-only"
                  />
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      isChecked
                        ? "border-champagne bg-champagne text-ink"
                        : "border-white/25"
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span
                    className={`truncate text-sm ${
                      isChecked ? "text-white" : "text-white/70"
                    }`}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
