import type { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionHeading({
  children,
  className,
}: SectionHeadingProps) {
  return (
    <h2
      className={`text-sm font-semibold uppercase tracking-widest text-aubergine/75${className ? ` ${className}` : ""}`}
    >
      {children}
    </h2>
  );
}
