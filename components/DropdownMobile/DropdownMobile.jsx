import React, { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export const DropdownMobile = ({
  label,
  options,
  selectedValues,
  onChange,
  isOpen,
  onToggle,
}) => {
  const [query, setQuery] = useState("");
  const count = selectedValues.length;
  const isSearchable = options.length > 12;

  const visibleOptions = useMemo(() => {
    if (!query) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  return (
    <div className="border-b border-white/[0.07]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-white/80">
          {label}
          {count > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-champagne px-1 text-[11px] font-semibold text-ink">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-white/40 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pb-4">
          {isSearchable && (
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Buscar en ${label.toLowerCase()}...`}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-champagne/50 focus:outline-none"
              />
            </div>
          )}

          <div className="max-h-64 space-y-0.5 overflow-y-auto scrollbar-thin">
            {visibleOptions.map((option) => {
              const isChecked = selectedValues.includes(option);

              return (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2.5"
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
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      isChecked
                        ? "border-champagne bg-champagne text-ink"
                        : "border-white/25"
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span
                    className={`truncate text-sm ${
                      isChecked ? "text-white" : "text-white/65"
                    }`}
                  >
                    {option}
                  </span>
                </label>
              );
            })}

            {visibleOptions.length === 0 && (
              <p className="px-1 py-3 text-sm text-white/35">
                Sin resultados para “{query}”
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
