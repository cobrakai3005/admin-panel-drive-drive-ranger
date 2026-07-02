const styles = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-orange-100 text-orange-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  requested: "bg-amber-100 text-amber-700",
};

export default function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles[key] || "bg-slate-100 text-slate-600"}`}
    >
      {status || "—"}
    </span>
  );
}
