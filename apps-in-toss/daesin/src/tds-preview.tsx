import type { ButtonHTMLAttributes, ChangeEventHandler, ReactNode } from "react";

interface PreviewButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  display?: string;
  size?: string;
}

interface PreviewTextFieldProps {
  label: string;
  labelOption?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  value: string;
  variant?: string;
}

export function TDSMobileProvider({ children }: { children: ReactNode; userAgent?: unknown }) {
  return <>{children}</>;
}

export function Button({ children, color: _color, display: _display, size: _size, ...props }: PreviewButtonProps) {
  return <button {...props}>{children}</button>;
}

export function TextField({ label, labelOption: _labelOption, onChange, placeholder, value, variant: _variant }: PreviewTextFieldProps) {
  return (
    <label className="preview-text-field">
      <span>{label}</span>
      <input onChange={onChange} placeholder={placeholder} value={value} />
    </label>
  );
}
