import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Dropdown = ({
  label,
  options,
  selectedValues,
  onChange,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-transparent  rounded-md text-white"
      >
        {label}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>
      {isOpen && (
        <div className="absolute z-30 mt-2 w-60 backdrop-blur-lg bg-gray-800/60 rounded-md shadow-lg">
          <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => {
                    onChange(
                      selectedValues.includes(option)
                        ? selectedValues.filter((v) => v !== option)
                        : [...selectedValues, option]
                    );
                  }}
                  className="w-4 h-4 rounded"
                />
                <span className="text-white truncate text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}