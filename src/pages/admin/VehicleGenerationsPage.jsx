import CrudPage from "../../components/shared/CrudPage";
import { fetchModelOptions } from "../../api/vehicles";
import {
  getGenerations,
  createGeneration,
  updateGeneration,
  deleteGeneration,
} from "../../api/vehicles";
import { useEffect, useState } from "react";
import Select from "react-select";
const defaultForm = {
  model_id: "",
  generation_name: "",
  year_from: "",
  year_to: "",
  engine_options: "",
  status: "active",
};
// Filter component for Categories
function GenerationFilters({ filterState, setFilterState }) {
  const [searchInput, setSearchInput] = useState(filterState.search || "");

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update if the value actually changed
      if (searchInput !== filterState.search) {
        setFilterState((prev) => ({ ...prev, search: searchInput }));
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, filterState.search, setFilterState]);

  // Handle status change immediately
  const handleStatusChange = (e) => {
    setFilterState((prev) => ({ ...prev, status: e.target.value }));
  };
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Search generations..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      />
      <Select
        options={statusOptions}
        value={statusOptions.find(
          (option) => option.value === (filterState.status || "active"),
        )}
        onChange={(selected) =>
          setFilterState((prev) => ({
            ...prev,
            status: selected.value,
          }))
        }
        isSearchable={false}
        className="min-w-[180px] text-sm"
        classNamePrefix="react-select"
      />
    </div>
  );
}
export default function VehicleGenerationsPage() {
  return (
    <CrudPage
      title="Vehicle Generations"
      description="Year ranges and generations per model"
      idKey="id"
      modalWide
      defaultForm={defaultForm}
      fetchList={(page, filters) =>
        getGenerations({
          page,
          limit: 10,
          status: filters.status || "active",
          search: filters.search || "",
        })
      }
      createItem={createGeneration}
      updateItem={updateGeneration}
      deleteItem={deleteGeneration}
      FilterComponent={GenerationFilters}
      columns={[
        { key: "no", label: "Serial" },
        { key: "generation_name", label: "Generation" },
        { key: "model_name", label: "Model Name" },
        { key: "year_from", label: "From" },
        { key: "status", label: "Status" },
        { key: "year_to", label: "To" },
      ]}
      formFields={[
        {
          name: "model_id",
          label: "Model",
          type: "select",
          required: true,
          loadOptions: fetchModelOptions,
          colSpan: 2,
        },
        {
          name: "generation_name",
          label: "Generation Name",
          required: true,
          colSpan: 2,
        },
        {
          name: "year_from",
          label: "Year From",
          type: "number",
          required: true,
        },
        { name: "year_to", label: "Year To", type: "number" },
        {
          name: "engine_options",
          label: "Engine Options",
          type: "textarea",
          colSpan: 2,
        },

        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ],
          optionValue: "id",
        },
      ]}
      preparePayload={(form) => ({
        ...form,
        model_id: Number(form.model_id),
        year_from: Number(form.year_from),
        year_to: form.year_to ? Number(form.year_to) : null,
      })}
    />
  );
}
