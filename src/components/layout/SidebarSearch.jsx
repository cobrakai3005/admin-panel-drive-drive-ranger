import { Search, X } from "lucide-react";

export default function SidebarSearch({ value, onChange, onClear }) {
  return (
    <div className="mb-4 px-1">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search menu..."
          className="w-full rounded-xl bg-white/10 border border-white/10 pl-9 pr-8 py-2 text-sm text-white placeholder:text-zinc-400 outline-none focus:bg-white/15 focus:border-primary-light transition"
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear sidebar search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
