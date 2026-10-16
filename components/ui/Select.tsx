"use client";
import React, { forwardRef } from "react";
import clsx from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={clsx(
            "w-full rounded-xl border bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100",
            "transition-all duration-200 outline-none cursor-pointer",
            "focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-gray-200 dark:border-gray-700",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
