import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  loadOptions,
  optionValue = "id",
  optionLabel = "name",
  placeholder = "Select...",
  required,
  disabled,
  dependsOn,
}) {
  const [loadedOptions, setLoadedOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const prevDependsOnRef = useRef(dependsOn);

  const resolvedOptions = options || loadedOptions;

  const load = useCallback(async () => {
    if (loadingRef.current || !loadOptions) return;

    loadingRef.current = true;
    setLoading(true);
    try {
      const result = await loadOptions(dependsOn);
      setLoadedOptions(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to load options:", err);
      setLoadedOptions([]);
    } finally {
      setLoading(false);
    }
  }, [loadOptions, dependsOn]);

  useEffect(() => {
    if (!loadOptions) return;

    if (dependsOn !== prevDependsOnRef.current) {
      prevDependsOnRef.current = dependsOn;
      loadingRef.current = false;
      setLoadedOptions([]);
      if (dependsOn !== undefined && dependsOn !== "") {
        load();
      }
      return;
    }

    if (resolvedOptions.length === 0 && !loadingRef.current) {
      load();
    }
  }, [dependsOn, loadOptions, resolvedOptions.length, load]);

  // Helper to get the display label from an option
  const getOptionLabel = (opt) => {
    if (typeof optionLabel === "function") {
      return optionLabel(opt);
    }
    return opt[optionLabel];
  };

  // Helper to get the value from an option
  const getOptionValue = (opt) => {
    if (typeof optionValue === "function") {
      return optionValue(opt);
    }
    return opt[optionValue];
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
        {required && " *"}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={
          disabled ||
          loading ||
          (loadOptions && dependsOn !== undefined && !dependsOn)
        }
        className="w-full px-3 py-2.5  rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">{loading ? "Loading..." : placeholder}</option>
        {resolvedOptions.map((opt) => (
          <option key={getOptionValue(opt)} value={getOptionValue(opt)}>
            {getOptionLabel(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}
