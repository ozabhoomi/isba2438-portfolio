type StatCardProps = {
  value: string;
  label: string;
  className?: string;
  labelClassName?: string;
};

export default function StatCard({
  value,
  label,
  className,
  labelClassName = "mt-3 text-sm leading-6 text-aubergine/85",
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border border-aubergine/10 bg-blush p-8 ${className ?? ""}`}
    >
      <p className="font-serif text-5xl font-semibold text-saffron">
        {value}
      </p>
      <p className={labelClassName}>{label}</p>
    </div>
  );
}
