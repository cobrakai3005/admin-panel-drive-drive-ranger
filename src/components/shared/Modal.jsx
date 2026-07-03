import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;

  return (
    <div className="fixed min-h-screen inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col ${wide ? "max-w-5xl" : "max-w-xl"}`}
      >
        {/* <div className="flex bg-primary items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-slate-200">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div> */}

        <div className="flex items-center justify-between px-6 py-5 bg-primary bg-gradient-to-b from-primary to-primary/95 border-b border-white/10 shadow-sm shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-xl font-extrabold tracking-tight text-white uppercase leading-none">
              {title}
            </h2>
            <div className="h-1 w-8 bg-white/30 rounded-full" />{" "}
            {/* Subtle accent bar */}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 text-white/80 hover:text-white transition-all"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
