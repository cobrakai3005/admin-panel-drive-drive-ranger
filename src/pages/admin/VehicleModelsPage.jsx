import CrudPage from "../../components/shared/CrudPage";
import { fetchMakeOptions } from "../../api/vehicles";
import {
  getModels,
  createModel,
  updateModel,
  deleteModel,
} from "../../api/vehicles";
import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
const defaultForm = {
  make_id: "",
  name: "",
  description: "",
  status: "active",
};

function ModelFilter({ filterState, setFilterState }) {
  const [searchInput, setSearchInput] = useState(filterState.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterState({ ...filterState, search: searchInput });
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Search products..."
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
export default function VehicleModelsPage() {
  const fetchList = useCallback(async (page, filters) => {
    const res = await getModels({
      page,
      limit: 10,
      status: filters.status || "active",
      search: filters.search || "", // 👈 pass search term
    });
    return res;
  }, []);
  return (
    <CrudPage
      title="Vehicle Models"
      description="Models under each vehicle make"
      idKey="id"
      fileFields={["model_image_url"]}
      defaultForm={defaultForm}
      fetchList={fetchList}
      createItem={createModel}
      updateItem={updateModel}
     
      FilterComponent={ModelFilter}
      deleteItem={deleteModel}
      columns={[
        { key: "no", label: "Serial" },
        { key: "name", label: "Model" },
        { key: "make_name", label: "Make Name" },
        { key: "description", label: "Description" },
        { key: "status", label: "Status" },
      ]}
      formFields={[
        {
          name: "make_id",
          label: "Make",
          type: "select",
          required: true,
          loadOptions: fetchMakeOptions,
          colSpan: 2,
        },
        { name: "name", label: "Model Name", required: true, colSpan: 2 },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          colSpan: 2,
        },
        { name: "model_image_url", label: "Image", type: "file" },

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
      preparePayload={(form) => ({ ...form, make_id: Number(form.make_id) })}
    />
  );
}
