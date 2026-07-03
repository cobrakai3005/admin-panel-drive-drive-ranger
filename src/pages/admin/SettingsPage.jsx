import { Check, Palette } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const themes = [
  {
    key: "default",
    name: "Indigo",
    description: "Classic admin blue-violet theme.",
    color: "#4f46e5",
    light: "#eef2ff",
  },
  {
    key: "green",
    name: "Green",
    description: "Fresh operational green theme.",
    color: "#059669",
    light: "#ecfdf5",
  },
  {
    key: "red",
    name: "Red",
    description: "Bold 4x4 brand red theme.",
    color: "#E31E24",
    light: "#fff1f2",
  },
];

export default function SettingsPage() {
  const { theme = "default", setTheme } = useOutletContext() || {};
  const selectedTheme = themes.find((item) => item.key === theme) || themes[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage admin appearance and workspace preferences.
          </p>
        </div>
        <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Palette size={22} />
        </div>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Theme Color
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Current theme: {selectedTheme.name}
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-3">
          {themes.map((item) => {
            const isSelected = item.key === theme;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTheme?.(item.key)}
                className={`group flex min-h-36 flex-col justify-between rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? "border-primary bg-primary-light shadow-sm"
                    : "border-slate-200 bg-white hover:border-primary/50 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 rounded-full border-4 border-white shadow"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-900">
                        {item.name}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {item.description}
                      </span>
                    </span>
                  </span>
                  {isSelected && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                      <Check size={16} />
                    </span>
                  )}
                </span>

                <span className="mt-4 flex overflow-hidden rounded-lg border border-white shadow-sm">
                  <span
                    className="h-8 flex-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className="h-8 flex-1"
                    style={{ backgroundColor: item.light }}
                  />
                  <span className="h-8 flex-1 bg-slate-900" />
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
