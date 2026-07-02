import CrudPage from "../../components/shared/CrudPage";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../api/brands";
import { useEffect, useState } from "react";
import Select from "react-select";
const defaultForm = {
  name: "",
  website: "",
  is_front: false,
  status: "active",
};

function BrandFilters({ filterState, setFilterState }) {
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

export default function BrandsPage() {
  return (
    <CrudPage
      title="Brands"
      description="Manage product brands"
      modalWide={true}
      idKey="id"
      fileFields={["logo_url"]}
      defaultForm={defaultForm}
      fetchList={(page, filters) =>
        getBrands({
          page,
          limit: 10,
          status: filters.status || "active",
          search: filters.search || "",
        })
      }
      createItem={createBrand}
      updateItem={updateBrand}
      deleteItem={deleteBrand}
      FilterComponent={BrandFilters}
      columns={[
        { key: "no", label: "Serial" },
        {
          key: "name",
          label: "Brand",
          render: (row) => (
            <div className="flex items-center gap-3">
              {row.logo_url && (
                <img
                  src={row.logo_url}
                  alt=""
                  className="w-8 h-8 rounded-lg object-contain bg-slate-50"
                />
              )}
              <span className="font-medium">{row.name}</span>
            </div>
          ),
        },

        { key: "status", label: "Status" },
        { key: "website", label: "Website" },
      ]}
      formFields={[
        { name: "name", label: "Name", required: true, colSpan: 2 },
        { name: "website", label: "Website", colSpan: 2 },

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
        { name: "logo_url", label: "Logo", type: "file" },
      ]}
    />
  );
}
