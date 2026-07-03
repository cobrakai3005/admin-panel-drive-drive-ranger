// import CrudPage from "../../components/shared/CrudPage";
// import { fetchCategoryOptions } from "../../api/categories";
// import { fetchSubcategoryOptions } from "../../api/subcategories";
// import { fetchBrandOptions } from "../../api/brands";
// import {
//   getAllProductsApi,
//   createProductApi,
//   updateProductApi,
//   deleteProductApi,
//   toggleProductStatusApi,
//   getProductImagesApi,
//   deleteProductImageApi,
// } from "../../api/products";
// import { useCallback } from "react";
// import { useState } from "react";
// import { useEffect } from "react";
// import Select from "react-select";
// import {
//   fetchVehicleGenerationOptions,
//   getAvailableVehicleGenerations,
//   getCompatibilityByProduct,
//   removeCompatibility,
// } from "../../api/vehicles";
// const defaultForm = {
//   category_id: "",
//   sub_category_id: "",
//   brand_id: "",
//   name: "",
//   short_description: "",
//   long_description: "",
//   seo_title: "",
//   seo_description: "",
//   seo_keywords: "",

//   sku: "",
//   price: "",
//   weight: "",
//   width: "",
//   height: "",
//   depth: "",

//   available_stock: "",

//   is_available: 1,
//   is_featured: 0,
//   is_front: 0,

//   status: "active",
// };

// export default function ProductsAdminPage() {
//   const fetchList = useCallback(async (page, filters) => {
//     const res = await getAllProductsApi({
//       page,
//       limit: 10,
//       status: filters.status || "active",
//       search: filters.search || "", // 👈 pass search term
//     });
//     return res.data;
//   }, []);

//   return (
//     <CrudPage
//       title="Products"
//       description="Manage catalog products — foreign keys loaded from backend"
//       idKey="id"
//       modalWide
//       defaultForm={defaultForm}
//       fileFields={["product_media"]}
//       fetchList={fetchList}
//       createItem={(data) => {
//         if (data instanceof FormData) {
//           return createProductApi(data).then((r) => r.data);
//         }
//       }}
//       updateItem={(id, data) => updateProductApi(id, data).then((r) => r.data)}
//       deleteItem={(id) => deleteProductApi(id).then((r) => r.data)}
//       toggleStatus={(id) => toggleProductStatusApi(id).then((r) => r.data)}
//       filters={(filterState, setFilterState) => {
//         const [searchInput, setSearchInput] = useState(
//           filterState.search || "",
//         );

//         useEffect(() => {
//           const timer = setTimeout(() => {
//             setFilterState({ ...filterState, search: searchInput });
//           }, 400); // 400ms debounce

//           return () => clearTimeout(timer);
//         }, [searchInput]);
//         const statusOptions = [
//           { value: "active", label: "Active" },
//           { value: "inactive", label: "Inactive" },
//         ];

//         return (
//           <div className="flex items-center gap-3">
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
//             />
//             <Select
//               options={statusOptions}
//               value={statusOptions.find(
//                 (option) => option.value === (filterState.status || "active"),
//               )}
//               onChange={(selected) =>
//                 setFilterState((prev) => ({
//                   ...prev,
//                   status: selected.value,
//                 }))
//               }
//               isSearchable={false}
//               className="min-w-[180px] text-sm"
//               classNamePrefix="react-select"
//             />
//           </div>
//         );
//       }}
//       columns={[
//         { key: "no", label: "Serial" },
//         { key: "name", label: "Product" },
//         { key: "sku", label: "SKU" },
//         {
//           key: "price",
//           label: "Price",
//           render: (row) => `₹${row.price}`,
//         },
//         {
//           key: "available_stock",
//           label: "Stock",
//         },

//         {
//           key: "is_featured",
//           label: "Featured",
//           render: (row) => (row.is_featured ? "Yes" : "No"),
//         },
//         {
//           key: "status",
//           label: "Status",
//         },
//       ]}
//       formFields={[
//         {
//           name: "name",
//           label: "Product Name",
//           required: true,
//           colSpan: 2,
//         },

//         {
//           name: "vehicle_generation_ids",
//           label: "Vehicle Compatibility",
//           type: "multi-select",
//           colSpan: 2,
//           loadOptions: (productId) => fetchVehicleGenerationOptions(productId),
//           loadCompatiblites: (productId) =>
//             getCompatibilityByProduct(productId),

//           removeCompatibility: (id)=> removeCompatibility(id)
//         },

//         {
//           name: "category_id",
//           label: "Category",
//           type: "select",
//           required: true,
//           loadOptions: () => fetchCategoryOptions(),
//         },

//         {
//           name: "sub_category_id",
//           label: "Sub Category",
//           type: "select",
//           required: true,
//           dependsOn: "category_id",
//           loadOptions: (id) => fetchSubcategoryOptions(id),
//         },

//         {
//           name: "brand_id",
//           label: "Brand",
//           type: "select",
//           required: true,
//           loadOptions: () => fetchBrandOptions(),
//         },
//         {
//           name: "product_media",
//           label: "Product Images",
//           type: "file",
//           multiple: true,
//           accept: "image/*",
//           colSpan: 2,
//           loadImages: (productId) => getProductImagesApi(productId),
//           deleteImage: (imageId) => deleteProductImageApi(imageId),
//         },

//         {
//           name: "sku",
//           label: "SKU",
//           required: true,
//         },

//         {
//           name: "price",
//           label: "Price",
//           type: "number",
//         },

//         {
//           name: "available_stock",
//           label: "Available Stock",
//           type: "number",
//         },

//         {
//           name: "weight",
//           label: "Weight (kg)",
//           type: "number",
//         },

//         {
//           name: "width",
//           label: "Width",
//           type: "number",
//         },

//         {
//           name: "height",
//           label: "Height",
//           type: "number",
//         },

//         {
//           name: "depth",
//           label: "Depth",
//           type: "number",
//         },

//         {
//           name: "short_description",
//           label: "Short Description",
//           type: "textarea",
//           colSpan: 2,
//         },

//         {
//           name: "long_description",
//           label: "Long Description",
//           type: "textarea",
//           rows: 5,
//           colSpan: 2,
//         },

//         {
//           name: "seo_title",
//           label: "SEO Title",
//           colSpan: 2,
//         },

//         {
//           name: "seo_keywords",
//           label: "SEO Keywords",
//           colSpan: 2,
//         },

//         {
//           name: "seo_description",
//           label: "SEO Description",
//           type: "textarea",
//           colSpan: 2,
//         },

//         {
//           name: "is_available",
//           label: "Available",
//           type: "checkbox",
//         },

//         {
//           name: "is_featured",
//           label: "Featured",
//           type: "checkbox",
//         },

//         {
//           name: "is_front",
//           label: "Show On Home",
//           type: "checkbox",
//         },

//         {
//           name: "status",
//           label: "Status",
//           type: "select",
//           options: [
//             { id: "active", name: "Active" },
//             { id: "inactive", name: "Inactive" },
//           ],
//           optionValue: "id",
//         },
//       ]}
//       preparePayload={(form) => ({
//         ...form,

//         category_id: Number(form.category_id),
//         sub_category_id: Number(form.sub_category_id),
//         brand_id: Number(form.brand_id),

//         price: Number(form.price),
//         weight: Number(form.weight || 0),
//         width: Number(form.width || 0),
//         height: Number(form.height || 0),
//         depth: Number(form.depth || 0),
//         available_stock: Number(form.available_stock || 0),

//         is_available: Number(form.is_available),
//         is_featured: Number(form.is_featured),
//         is_front: Number(form.is_front),
//       })}
//     />
//   );
// }

import CrudPage from "../../components/shared/CrudPage";
import { fetchCategoryOptions } from "../../api/categories";
import { fetchSubcategoryOptions } from "../../api/subcategories";
import { fetchBrandOptions } from "../../api/brands";
import {
  getAllProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  toggleProductStatusApi,
  getProductImagesApi,
  deleteProductImageApi,
} from "../../api/products";
import { useCallback, useState, useEffect } from "react";
import Select from "react-select";
import {
  fetchVehicleGenerationOptions,
  getCompatibilityByProduct,
  removeCompatibility,
} from "../../api/vehicles";

// FIX: Separate filter component - hooks are now called at component top level
function ProductFilters({ filterState, setFilterState }) {
  const [searchInput, setSearchInput] = useState(filterState.search || "");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterState((prev) => ({ ...prev, search: searchInput }));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, setFilterState]);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "all", label: "All" },
  ];

  const currentStatus =
    statusOptions.find(
      (opt) => opt.value === (filterState.status || "active"),
    ) || statusOptions[0];

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
        value={currentStatus}
        onChange={(selected) =>
          setFilterState((prev) => ({
            ...prev,
            status: selected.value,
          }))
        }
        isSearchable={false}
        className="min-w-[140px] text-sm"
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "0.75rem",
            minHeight: "40px",
          }),
        }}
      />
    </div>
  );
}

const defaultForm = {
  category_id: "",
  sub_category_id: "",
  brand_id: "",
  name: "",
  short_description: "",
  long_description: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  sku: "",
  price: "",
  tax_percentage: "",
  weight: "",
  width: "",
  height: "",
  depth: "",
  warranty_months: "",
  available_stock: "",
  is_available: true,
  is_featured: false,
  is_front: false,
  status: "active",
};

export default function ProductsAdminPage() {
  const fetchList = useCallback(async (page, filters) => {
    const res = await getAllProductsApi({
      page,
      limit: 10,
      status: filters.status || "active",
      search: filters.search || "",
    });
    return res;
  }, []);

  // FIX: createItem now properly handles all cases
  const createItemHandler = useCallback(async (data) => {
    let payload = data;
    if (data instanceof FormData) {
      payload = data;
    } else {
      // Handle non-FormData case - create FormData if there are files
      // or just pass the object directly
      payload = data;
    }
    const result = await createProductApi(payload);
    return result.data;
  }, []);

  const updateItemHandler = useCallback(async (id, data) => {
    const result = await updateProductApi(id, data);
    return result.data;
  }, []);

  const deleteItemHandler = useCallback(async (id) => {
    const result = await deleteProductApi(id);
    return result;
  }, []);

  const toggleStatusHandler = useCallback(async (id) => {
    const result = await toggleProductStatusApi(id);
    return result.data;
  }, []);

  return (
    <CrudPage
      title="Products"
      description="Manage catalog products — vehicle parts and accessories"
      idKey="id"
      modalWide
      defaultForm={defaultForm}
      fileFields={["product_media"]}
      fetchList={fetchList}
      createItem={createItemHandler}
      updateItem={updateItemHandler}
      deleteItem={deleteItemHandler}
      toggleStatus={toggleStatusHandler}
      FilterComponent={ProductFilters}
      columns={[
        { key: "no", label: "#" },
        {
          key: "name",
          label: "Product",
          render: (row) => (
            <span className="font-medium text-slate-800">{row.name}</span>
          ),
        },
        {
          key: "sku",
          label: "SKU",
          render: (row) => (
            <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">
              {row.sku}
            </code>
          ),
        },
        {
          key: "price",
          label: "Price",
          render: (row) => (
            <span className="text-slate-700">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(row.price)}
            </span>
          ),
        },
        {
          key: "available_stock",
          label: "Stock",
          render: (row) => (
            <span
              className={`font-medium ${
                row.available_stock <= 5
                  ? "text-rose-600"
                  : row.available_stock <= 20
                    ? "text-amber-600"
                    : "text-emerald-600"
              }`}
            >
              {row.available_stock}
            </span>
          ),
        },
        {
          key: "is_featured",
          label: "Featured",
          render: (row) => <span>{row.is_featured ? "Yes" : "No"}</span>,
        },
        {
          key: "status",
          label: "Status",
        },
      ]}
      formFields={[
        {
          name: "name",
          label: "Product Name",
          required: true,
          colSpan: 2,
        },

        {
          name: "vehicle_generation_ids",
          label: "Vehicle Compatibility",
          type: "multi-select",
          colSpan: 2,
          loadOptions: (id) => fetchVehicleGenerationOptions(id),
          loadCompatibilities: (productId) =>
            getCompatibilityByProduct(productId),
          removeCompatibility: (id) => removeCompatibility(id),
        },

        {
          name: "category_id",
          label: "Category",
          type: "select",
          required: true,
          loadOptions: () => fetchCategoryOptions(),
        },

        {
          name: "sub_category_id",
          label: "Sub Category",
          type: "select",
          required: true,
          dependsOn: "category_id",
          loadOptions: (categoryId) => fetchSubcategoryOptions(categoryId),
        },

        {
          name: "brand_id",
          label: "Brand",
          type: "select",
          required: true,
          loadOptions: () => fetchBrandOptions(),
        },

        {
          name: "product_media",
          label: "Product Images",
          type: "file",
          multiple: true,
          accept: "image/*",
          colSpan: 2,
          loadImages: (productId) => getProductImagesApi(productId),
          deleteImage: (imageId) => deleteProductImageApi(imageId),
        },

        {
          name: "sku",
          label: "SKU",
          required: true,
          placeholder: "Unique product code",
        },

        {
          name: "price",
          label: "Price (INR)",
          type: "number",
          required: true,
          min: 0,
          step: 0.01,
        },
        {
          name: "tax_percentage",
          label: "Tax Percentage (%)",
          type: "number",
          required: true,
          min: 0,
          step: 0.01,
        },

        {
          name: "available_stock",
          label: "Available Stock",
          type: "number",
          min: 0,
        },

        {
          name: "weight",
          label: "Weight (kg)",
          type: "number",
          min: 0,
          step: 0.01,
        },

        {
          name: "width",
          label: "Width (cm)",
          type: "number",
          min: 0,
          step: 0.1,
        },

        {
          name: "height",
          label: "Height (cm)",
          type: "number",
          min: 0,
          step: 0.1,
        },

        {
          name: "depth",
          label: "Depth (cm)",
          type: "number",
          min: 0,
          step: 0.1,
        },

        {
          name: "warranty_months",
          label: "Warranty (Months)",
          type: "number",
          min: 0,
          step: 1,
          placeholder: "Warranty period in months",
        },

        {
          name: "short_description",
          label: "Short Description",
          type: "textarea",
          colSpan: 2,
          rows: 2,
          placeholder: "Brief product summary",
        },

        {
          name: "long_description",
          label: "Long Description",
          type: "textarea",
          rows: 5,
          colSpan: 2,
          placeholder: "Detailed product information",
        },

        {
          name: "seo_title",
          label: "SEO Title",
          colSpan: 2,
          placeholder: "Page title for search engines",
        },

        {
          name: "seo_keywords",
          label: "SEO Keywords",
          colSpan: 2,
          placeholder: "Comma-separated keywords",
        },

        {
          name: "seo_description",
          label: "SEO Description",
          type: "textarea",
          colSpan: 2,
          rows: 2,
          placeholder: "Meta description for search engines",
        },

        {
          name: "is_available",
          label: "Available for Purchase",
          type: "checkbox",
        },

        {
          name: "is_featured",
          label: "Featured Product",
          type: "checkbox",
        },

        {
          name: "is_front",
          label: "Show on Homepage",
          type: "checkbox",
        },

        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ],
        },
      ]}
      preparePayload={(form, editingRow) => ({
        ...form,

        // Convert IDs to numbers
        category_id: Number(form.category_id) || null,
        sub_category_id: Number(form.sub_category_id) || null,
        brand_id: Number(form.brand_id) || null,

        // Convert numbers
        price: Number(form.price) || 0,
        tax_percentage: Number(form.tax_percentage) || 0.0,
        weight: Number(form.weight) || 0,
        width: Number(form.width) || 0,
        height: Number(form.height) || 0,
        depth: Number(form.depth) || 0,
        available_stock: Number(form.available_stock) || 0,

        // Convert booleans to numbers (backend may expect 0/1)
        is_available: form.is_available ? 1 : 0,
        is_featured: form.is_featured ? 1 : 0,
        is_front: form.is_front ? 1 : 0,

        // Handle vehicle compatibility IDs
        vehicle_generation_ids: form.vehicle_generation_ids || [],
      })}
    />
  );
}
