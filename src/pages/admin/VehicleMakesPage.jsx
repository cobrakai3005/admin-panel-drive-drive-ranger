import CrudPage from "../../components/shared/CrudPage";
import {
  getMakes,
  createMake,
  updateMake,
  deleteMake,
} from "../../api/vehicles";
import { useEffect, useState } from "react";
import Select from "react-select";
const defaultForm = { name: "", country: "", status: "active" };
function MakeFilters({ filterState, setFilterState }) {
  const [searchInput, setSearchInput] = useState(filterState.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterState(prev => ({
        ...prev,
        search: searchInput,
      }));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, setFilterState]);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="flex gap-3">
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="border border-zinc-400/30 outline-none rounded-2xl focus:ring-2 focus:ring-indigo-700 px-4"
        placeholder="Search"
      />

      <Select
        options={statusOptions}
        value={statusOptions.find(
          o => o.value === (filterState.status || "active")
        )}
        onChange={(selected) =>
          setFilterState(prev => ({
            ...prev,
            status: selected.value,
          }))
        }
      />
    </div>
  );
}
export default function VehicleMakesPage() {
  return (
    <CrudPage
      title="Vehicle Makes"
      description="Car / truck manufacturers"
      idKey="id"
      fileFields={["logo_url"]}
      defaultForm={defaultForm}
      FilterComponent={MakeFilters}
      fetchList={(page, filters) =>
        getMakes({
          page,
          limit: 10,
          status: filters.status || "active",
          search: filters.search || "",
        })
      }
      createItem={createMake}
      updateItem={updateMake}
      deleteItem={deleteMake}
      columns={[
        { key: "no", label: "Serial" },
        {
          key: "name",
          label: "Make",
          render: (row) => (
            <div className="flex items-center gap-3">
              {row.logo_url && (
                <img
                  src={row.logo_url}
                  alt=""
                  className="w-8 h-8 object-contain"
                />
              )}
              <span className="font-medium">{row.name}</span>
            </div>
          ),
        },
        { key: "country", label: "Country" },
        { key: "status", label: "Status" },
      ]}
      formFields={[
        { name: "name", label: "Name", required: true, colSpan: 2 },
        { name: "country", label: "Country" },
        { name: "logo_url", label: "Logo", type: "file" },

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
    />
  );
}
