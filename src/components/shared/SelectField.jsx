import { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
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
export default function SelectField({
  field,
  value,
  form,
  onChange,
  isReadonly,
}) {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dependencyValue = field.dependsOn ? form[field.dependsOn] : undefined;
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      try {
        const data = field.loadOptions
          ? await field.loadOptions(dependencyValue)
          : field.options || [];

        setOptions(toSelectOptions(data, field.optionLabel, field.optionValue));
      } finally {
        setIsLoading(false);
      }
    };

    // Don't load until dependency exists
    if (field.dependsOn && !dependencyValue) {
      setOptions([]);
      return;
    }

    load();
  }, [field.loadOptions, field.options, dependencyValue]);

  const selectedOption =
    options.find((opt) => String(opt.value) === String(value)) || null;

  return (
    <div className={field.colSpan === 2 ? "col-span-2" : ""}>
      <label>{field.label}</label>

      <Select
        options={options}
        value={selectedOption}
        onChange={(opt) => onChange(opt?.value ?? "")}
        isLoading={isLoading}
        isClearable
        classNames={{
          control: ({ isFocused }) =>
            `border ${
              isFocused
                ? "border-red-500 ring-2 ring-red-200"
                : "border-zinc-300"
            }`,
        }}
        isDisabled={field.disabled || (field.dependsOn && !dependencyValue)}
      />
    </div>
  );
}
