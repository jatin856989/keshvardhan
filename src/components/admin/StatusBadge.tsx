const styles: Record<string, string> = {
  pending: "bg-cream-200 text-stone",
  paid: "bg-amla-100 text-forest",
  cod_confirmed: "bg-amla-100 text-forest",
  packed: "bg-gold/20 text-forest",
  shipped: "bg-forest-200 text-forest",
  delivered: "bg-forest text-cream",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-red-100 text-red-800",
  rto: "bg-terracotta-100 text-terracotta",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${styles[status] ?? "bg-cream-200 text-stone"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
