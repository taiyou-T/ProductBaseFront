"use client";

import Link from "next/link";

export function TermsCheckbox({
  checked,
  onChange,
  required = true,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-2 text-sm">
      <input
        type="checkbox"
        className="mt-1"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
      />
      <span>
        <Link href="/terms" target="_blank" className="text-indigo-600 hover:underline">
          利用規約
        </Link>
        に同意します
      </span>
    </label>
  );
}
