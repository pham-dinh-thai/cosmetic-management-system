import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[#1c3a13] text-[#fcfcf7] hover:opacity-90 border border-transparent",
  ghost: "bg-transparent text-[#1c3a13] hover:bg-[#eeeee9] border border-transparent",
  outline:
    "bg-transparent text-[#1c3a13] border border-[#1c3a13] hover:bg-[#1c3a13] hover:text-[#fcfcf7]",
};

const sizeClass = {
  sm: "px-4 py-2 text-[12px]",
  md: "px-5 py-2.5 text-[14px]",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) => (
  <button
    {...rest}
    className={`inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[0.02em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClass[variant]} ${sizeClass[size]} ${className}`}
  >
    {children}
  </button>
);

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...rest
}) => (
  <input
    {...rest}
    className={`w-full rounded-lg border border-[#c4c7c4] bg-[#fcfcf7] px-4 py-2.5 text-[14px] text-[#1c3a13] placeholder:text-[#666666] focus:outline-none focus:border-[#1c3a13] transition-colors ${className}`}
  />
);

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  options,
  className = "",
  ...rest
}) => (
  <select
    {...rest}
    className={`w-full rounded-lg border border-[#c4c7c4] bg-[#fcfcf7] px-4 py-2.5 text-[14px] text-[#1c3a13] focus:outline-none focus:border-[#1c3a13] transition-colors ${className}`}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-[16px] bg-[#fcfcf7] border border-[#eeeee9] p-6 ${className}`}
  >
    {children}
  </div>
);

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  actions,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
    <div>
      {eyebrow && (
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#666666]">
          {eyebrow}
        </p>
      )}
      <h1
        className="mt-3 leading-[1.1]"
        style={{
          fontWeight: 350,
          fontSize: "clamp(32px, 4vw, 44px)",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-[#666666]">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);

interface KpiProps {
  label: string;
  value: string;
  caption?: string;
  accent?: "forest" | "lime" | "sage" | "olive" | "eucalyptus";
}

const accentMap: Record<NonNullable<KpiProps["accent"]>, string> = {
  forest: "#1c3a13",
  lime: "#d3fa99",
  sage: "#757c5d",
  olive: "#9f995b",
  eucalyptus: "#698e79",
};

export const Kpi: React.FC<KpiProps> = ({ label, value, caption, accent = "forest" }) => (
  <Card className="flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
        {label}
      </p>
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: accentMap[accent] }}
      />
    </div>
    <p
      className="text-[#1c3a13]"
      style={{
        fontWeight: 350,
        fontSize: "32px",
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </p>
    {caption && <p className="text-[12px] text-[#666666]">{caption}</p>}
  </Card>
);