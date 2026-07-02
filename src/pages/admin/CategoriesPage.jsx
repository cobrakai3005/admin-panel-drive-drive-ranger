import CrudPage from "../../components/shared/CrudPage";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  deleteCategoryImage,
} from "../../api/categories";
import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";
const defaultForm = {
  name: "",
  description: "",
  status: "active",
  is_front: false,
};

// Filter component for Categories
function CategoryFilters({ filterState, setFilterState }) {
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
        placeholder="Search categories..."
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

export default function CategoriesPage() {
  return (
    <CrudPage
      title="Categories"
      description="Manage product categories"
      idKey="id"
      fileFields={["image_url"]}
      defaultForm={defaultForm}
      modalWide={true}
      fetchList={(page, filters) =>
        getCategories({
          page,
          limit: 10,
          status: filters.status || "active",
          search: filters.search || "",
        })
      }
      createItem={createCategory}
      updateItem={updateCategory}
      deleteItem={deleteCategory}
      toggleStatus={toggleCategoryStatus}
      // filters={(filterState, setFilterState) => (
      //   <CategoryFilters
      //     filterState={filterState}
      //     setFilterState={setFilterState}
      //   />
      // )}
      FilterComponent={CategoryFilters}
      columns={[
        { key: "no", label: "Serial" },
        {
          key: "name",
          label: "Name",
          render: (row) => (
            <div className="flex items-center gap-3">
              {row.image_url && (
                <img
                  src={row.image_url}
                  alt=""
                  className="w-8 h-8 rounded-lg object-cover"
                />
              )}
              <span className="font-medium">{row.name}</span>
            </div>
          ),
        },

        { key: "description", label: "Description" },
        { key: "is_front", label: "Put In Front" },
        { key: "status", label: "Status" },
      ]}
      formFields={[
        { name: "name", label: "Name", required: true, colSpan: 2 },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          colSpan: 2,
        },
        { name: "is_front", label: "Is Front ", type: "checkbox" },
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
        {
          name: "image_url",
          label: "Image",
          type: "file",
          imageField: "image_url",
        },
      ]}
    />
  );
}
