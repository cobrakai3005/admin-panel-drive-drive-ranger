import React, { useState } from "react";
import CrudPage from "../../components/shared/CrudPage";
import {
  getCompatibilityByProduct,
  addCompatibility,
  removeCompatibility,
  fetchProductOptions,
  fetchGenerationOptions,
  getGenerations,
} from "../../api/vehicles";
import Select from "react-select";
const defaultForm = {
  vehicle_generation_ids: [],
  compatibility_notes: "",
};

// Filter component
export function CompatibilityFilter({ filterState, setFilterState }) {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchProductOptions()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Format options for react-select
  const productOptions = products?.map((product) => ({
    value: product.id,
    label: `${product.name} || ${product.price}`,
  }));

  // Find the selected option based on product_id
  const selectedOption = productOptions?.find(
    (option) => option.value === filterState.product_id,
  );

  const handleProductChange = (selected) => {
    setFilterState({
      ...filterState,
      product_id: selected ? selected.value : "",
    });
  };

  // (Optional) If you want a status filter too, you can add another Select below
  // const statusOptions = [
  //   { value: "active", label: "Active" },
  //   { value: "inactive", label: "Inactive" },
  // ];

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        options={productOptions}
        value={selectedOption}
        onChange={handleProductChange}
        isLoading={loading}
        isClearable
        placeholder="All Products"
        className="min-w-[200px] text-sm"
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "0.75rem",
            borderColor: "#e2e8f0",
            padding: "0 0.25rem",
            minHeight: "2.5rem",
            boxShadow: "none",
            "&:hover": { borderColor: "#a5b4fc" },
          }),
        }}
      />
      {/* If you want a status dropdown, uncomment below: */}
      {/* <Select
        options={statusOptions}
        value={statusOptions.find(opt => opt.value === (filterState.status || "active"))}
        onChange={(selected) =>
          setFilterState({ ...filterState, status: selected.value })
        }
        isClearable
        placeholder="Status"
        className="min-w-[150px] text-sm"
        classNamePrefix="react-select"
      /> */}
    </div>
  );
}
// function CompatibilityFilter({ filterState, setFilterState }) {
//   const [products, setProducts] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     fetchProductOptions()
//       .then(setProducts)
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading)
//     return <div className="px-3 py-2 text-sm">Loading products...</div>;

//   // const statusOptions = [
//   //   { value: "active", label: "Active" },
//   //   { value: "inactive", label: "Inactive" },
//   // ];

//   const productOptions = products?.map((product) => ({
//     value: product.id,
//     label: `${product.name} || ${product.price}`,
//   }));

//   return (
//     <div className="flex flex-wrap gap-3">
//        <Select
//         options={productOptions}
//         value={productOptions.find(
//           (option) => option.value === (filterState.product_id || ""),
//         )}
//         onChange={(selected) =>
//           setFilterState((prev) => ({
//             ...prev,
//             product_id: selected.value,
//           }))
//         }
//         isSearchable={true}
//         className="min-w-[180px] text-sm"
//         classNamePrefix="react-select"
//       />
//     </div>
//   );
// }

// Compatibility Card – displays vehicle info and images
function CompatibilityCard({ compatibility }) {
  const [imageErrors, setImageErrors] = React.useState({
    model: false,
    make: false,
  });

  const handleImageError = (type) => {
    setImageErrors((prev) => ({ ...prev, [type]: true }));
  };

  const getVehicleImage = () => {
    if (compatibility.model_image_url && !imageErrors.model) {
      return compatibility.model_image_url;
    }
    if (compatibility.make_logo_url && !imageErrors.make) {
      return compatibility.make_logo_url;
    }
    return null;
  };

  const imageUrl = getVehicleImage();
  const imageType =
    compatibility.model_image_url && !imageErrors.model
      ? "Model"
      : compatibility.make_logo_url && !imageErrors.make
        ? "Make"
        : "";

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
      <div className="flex-shrink-0">
        <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${compatibility.make_name} ${compatibility.model_name}`}
              className="w-full h-full object-cover"
              onError={() => {
                if (compatibility.model_image_url && !imageErrors.model) {
                  handleImageError("model");
                } else if (compatibility.make_logo_url && !imageErrors.make) {
                  handleImageError("make");
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs mt-1">No image</span>
            </div>
          )}
        </div>
        {imageType && (
          <div className="text-[10px] text-slate-400 mt-1 text-center">
            {imageType}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-medium text-sm">
            {compatibility.make_name} {compatibility.model_name}
          </h4>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            {compatibility.generation_name}
          </span>
          {compatibility.year_from && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
              {compatibility.year_from}
              {compatibility.year_to && ` - ${compatibility.year_to}`}
            </span>
          )}
        </div>

        {compatibility.make_logo_url && !imageErrors.make && (
          <div className="flex items-center gap-1 mt-1">
            <img
              src={compatibility.make_logo_url}
              alt={compatibility.make_name}
              className="h-4 w-auto object-contain"
              onError={() => handleImageError("make")}
            />
            <span className="text-xs text-slate-500">
              {compatibility.make_name}
            </span>
            {compatibility.make_country && (
              <span className="text-xs text-slate-400">
                • {compatibility.make_country}
              </span>
            )}
          </div>
        )}

        {compatibility.model_image_url && !imageErrors.model && (
          <div className="mt-1">
            <img
              src={compatibility.model_image_url}
              alt={compatibility.model_name}
              className="h-12 w-auto object-contain rounded"
              onError={() => handleImageError("model")}
            />
          </div>
        )}

        {compatibility.compatibility_notes && (
          <div className="text-xs text-slate-400 mt-1 italic">
            Note: {compatibility.compatibility_notes}
          </div>
        )}

        {/* <div className="text-xs text-slate-400 mt-1">
          Compatibility ID: {compatibility.id}
        </div> */}
      </div>
    </div>
  );
}

export default function VehicleCompatibilityPage() {
  // Local state that mirrors CrudPage's internal filterState
  const [filterState, setFilterState] = useState({ product_id: "" });

  const hasProductSelected = !!filterState.product_id;

  return (
    <CrudPage
      title="Vehicle Compatibility"
      description="Link products to compatible vehicle generations. Please Select a product to view or add compatibility."
      idKey="id"
      modalWide
      defaultForm={defaultForm}
      // Pre‑fill product_id from filter when opening create modal
      getDefaultForm={() => ({
        product_id: filterState.product_id || "",
        vehicle_generation_ids: [],
        compatibility_notes: "",
      })}
      canCreate={hasProductSelected}
      createLabel={
        hasProductSelected ? "Add Compatibility" : "Select a product first"
      }
      fetchList={(page, filters) =>
        getCompatibilityByProduct(filters.product_id || undefined, {
          page,
          limit: 10,
        })
      }
      createItem={addCompatibility}
      deleteItem={removeCompatibility}
      FilterComponent={CompatibilityFilter}
      // Sync internal filterState to our local state
      onFilterChange={(newFilterState) => setFilterState(newFilterState)}
      columns={[
        {
          key: "compatibility",
          label: "Vehicle Compatibility",
          render: (row) => <CompatibilityCard compatibility={row} />,
        },
      ]}
      formFields={[
        {
          name: "vehicle_generation_ids",
          label: "Vehicle Generations",
          type: "multi-select",
          required: true,
          loadOptions: () => getGenerations({ status: "active", limit: 100 }).then(data=> data.data),
          optionLabel: (item) => {
            const makeName = item.make_name || "";
            const modelName = item.model_name || "";
            return `${makeName} ${modelName} - ${item.generation_name} (${item.year_from} - ${item.year_to || "Present"})`;
          },
          optionValue: (item) => item.id,
          colSpan: 2,
        },
        {
          name: "compatibility_notes",
          label: "Compatibility Notes",
          type: "textarea",
          placeholder: "e.g., Requires adapter, Fits all trims, etc.",
          rows: 3,
          colSpan: 2,
        },
      ]}
      preparePayload={(form) => ({
        product_id: Number(form.product_id),
        vehicle_generation_ids: form.vehicle_generation_ids.map(Number),
        compatibility_notes: form.compatibility_notes?.trim() || null,
      })}
    />
  );
}
