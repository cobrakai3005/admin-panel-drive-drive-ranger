import CrudPage from "../../components/shared/CrudPage";
import { fetchProductOptions } from "../../api/products";
import {
  getProductItems,
  createProductItem,
  updateProductItem,
  deleteProductItem,
} from "../../api/productItems";
import { useEffect, useState } from "react";

const defaultForm = {
  product_id: "",
  variation_value: "",
  sku: "",
  price: "",
  weight: "",
  width: "",
  height: "",
  depth: "",
  available_stock: "",
  is_available: true,
};

export default function ProductItemsPage() {
  return (
    <CrudPage
      title="Product Items"
      description="SKUs / variations for products"
      idKey="id"
      modalWide
      defaultForm={defaultForm}
      fetchList={(page, filters) =>
        getProductItems({
          page,
          limit: 10,
          product_id: filters.product_id || undefined,
        })
      }
      createItem={createProductItem}
      updateItem={updateProductItem}
      deleteItem={deleteProductItem}
      filters={(filterState, setFilterState) => {
        const [products, setProducts] =useState([]);

        useEffect(() => {
          fetchProductOptions().then(setProducts).catch(console.error);
        }, []);

        return (
          <select
            value={filterState.product_id || ""}
            onChange={(e) => setFilterState({ product_id: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm max-w-xs"
          >
            <option value="">All products</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        );
      }}
      columns={[
        { key: "id", label: "ID" },
        { key: "sku", label: "SKU" },
        {
          key: "product_name",
          label: "Product",
          render: (r) => `${r.product.name}`,
        },
        { key: "variation_value", label: "Variation" },
        { key: "price", label: "Price", render: (r) => `Rs-${r.price}` },
        {
          key: "is_available",
          label: "Available",
          render: (r) => (r.is_available ? "Yes" : "No"),
        },
      ]}
      formFields={[
        {
          name: "product_id",
          label: "Product",
          type: "select",
          required: true,
          loadOptions: () => fetchProductOptions(),
          optionLabel: "name",
          colSpan: 2,
        },
        { name: "variation_value", label: "Variation", required: true },
        { name: "sku", label: "SKU", required: true },
        { name: "available_stock", label: "Available Stock", required: true },
        {
          name: "price",
          label: "Price",
          type: "number",
          required: true,
          step: "0.01",
        },
        { name: "weight", label: "Weight", type: "number", step: "0.01" },
        { name: "width", label: "Width", type: "number", step: "0.01" },
        { name: "height", label: "Height", type: "number", step: "0.01" },
        { name: "depth", label: "Depth", type: "number", step: "0.01" },
        {
          name: "is_available",
          label: "Available for sale",
          type: "checkbox",
          colSpan: 2,
        },
      ]}
      preparePayload={(form) => ({
        ...form,
        product_id: Number(form.product_id),
        price: Number(form.price),
        weight: form.weight ? Number(form.weight) : null,
        width: form.width ? Number(form.width) : null,
        height: form.height ? Number(form.height) : null,
        depth: form.depth ? Number(form.depth) : null,
        is_available: Boolean(form.is_available),
      })}
    />
  );
}

