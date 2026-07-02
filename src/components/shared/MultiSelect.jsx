import { useEffect, useState } from "react";
import Select from 'react-select';
// Helper to format your options into react-select's shape
const toSelectOptions = (items, labelKey, valueKey) => {
  if (!items) return [];
  return items.map((item) => ({
    label:
      typeof labelKey === "function"
        ? labelKey(item)
        : item[labelKey || "name"],
    value:
      typeof valueKey === "function" ? valueKey(item) : item[valueKey || "id"],
  }));
};

export default function MultiSelectField({
  field,
  value,
  onChange,
  editingRow,
}) {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = field.loadOptions
          ? await field.loadOptions(editingRow?.id)
          : field.options || [];
        setOptions(toSelectOptions(data, field.optionLabel, field.optionValue));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [field.loadOptions, field.options, editingRow?.id]);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <div className={field.colSpan === 2 ? "col-span-2" : ""}>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {field.label}
        {field.required && " *"}
      </label>
      <Select
        options={options}
        value={selectedOptions}
        onChange={(opts) => onChange(opts ? opts.map((o) => o.value) : [])}
        isLoading={isLoading}
        isMulti
        placeholder={field.placeholder || "Search..."}
        isClearable
        className="mt-1"
        classNamePrefix="react-select"
        noOptionsMessage={() => "No options"}
      />
    </div>
  );
}

// import { useState, useEffect, useMemo } from "react";
// import Select from "react-select";

// export default function MultiSelectField({
//   field,
//   value,
//   form,
//   onChange,
//   isReadonly = false,
// }) {
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dependsOnValue, setDependsOnValue] = useState(null);

//   // Get current value for dependsOn
//   useEffect(() => {
//     if (field.dependsOn) {
//       const depValue = form?.[field.dependsOn];
//       if (depValue && depValue !== dependsOnValue) {
//         setDependsOnValue(depValue);
//         // Reset this field when dependency changes
//         onChange?.(null);
//       }
//     }
//   }, [form, field.dependsOn, dependsOnValue, onChange]);

//   // Load options
//   useEffect(() => {
//     let isMounted = true;

//     const load = async () => {
//       // If has static options, use them
//       if (field.options) {
//         const formatted = field.options.map((opt) => ({
//           value: opt[field.optionValue || "id"],
//           label: opt[field.optionLabel || "name"],
//         }));
//         if (isMounted) setOptions(formatted);
//         return;
//       }

//       // If has loadOptions function, call it
//       if (field.loadOptions) {
//         setLoading(true);
//         try {
//           const idToPass = field.dependsOn ? dependsOnValue : null;
//           const data = await field.loadOptions(idToPass);
//           const formatted = (data || []).map((opt) => ({
//             value: opt.id,
//             label: opt.name || opt.label,
//           }));
//           if (isMounted) setOptions(formatted);
//         } catch (err) {
//           console.error("Failed to load options:", err);
//           if (isMounted) setOptions([]);
//         } finally {
//           if (isMounted) setLoading(false);
//         }
//       }
//     };

//     load();

//     return () => {
//       isMounted = false;
//     };
//   }, [
//     field.options,
//     field.loadOptions,
//     field.dependsOn,
//     dependsOnValue,
//     field.optionValue,
//     field.optionLabel,
//   ]);
//   // IMPORTANT: Filter to get multiple selected options
//   const selectedOptions = options.filter(
//     (opt) => Array.isArray(value) && value.includes(opt.value),
//   );
//   const selected = useMemo(() => {
//     const val = value ?? form?.[field.name];
//     const numVal = typeof val === "string" ? Number(val) || val : val;
//     return (
//       options.find((opt) => opt.value === numVal || opt.value === val) || null
//     );
//   }, [options, value, form, field.name]);

//   const handleChange = (selected) => {
//     onChange?.(selected?.value ?? null);
//   };

//   if (isReadonly && field.name === "order_id") {
//     return (
//       <input
//         type="text"
//         value={selected?.label || ""}
//         readOnly
//         className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
//       />
//     );
//   }

//   return (
//     <div className="space-y-1.5">
//       <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
//         {field.label}
//         {field.required && " *"}
//       </label>
//       <Select
//         options={options}
//         value={selectedOptions}
//         onChange={handleChange}
//         isLoading={loading}
//         isMulti // <-- THIS IS REQUIRED!
//         placeholder={field.placeholder || "Select options..."}
//         isClearable
//         styles={{
//           control: (base, state) => ({
//             ...base,
//             borderColor: state.isFocused ? "#6366f1" : "#e2e8f0",
//             borderRadius: "0.75rem",
//             minHeight: "42px",
//             boxShadow: state.isFocused
//               ? "0 0 0 2px rgba(99, 102, 241, 0.2)"
//               : "none",
//             "&:hover": {
//               borderColor: "#6366f1",
//             },
//           }),
//         }}
//       />
//     </div>
//   );
// }
