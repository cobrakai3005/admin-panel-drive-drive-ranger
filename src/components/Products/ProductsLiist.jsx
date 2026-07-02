import React, { useState, useEffect } from "react";
import useProduct from "../../hooks/Products/useProduct";
import {
  Trash2,
  RefreshCw,
  Plus,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Save,
} from "lucide-react";

const INITIAL_FORM_STATE = {
  category_id: "",
  sub_category_id: "",
  brand_id: "",
  name: "",
  short_description: "",
  long_description: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  status: "active",
};

function ProductsList() {
  const {
    getAllProducts,
    getAllProductsLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
  } = useProduct();

  // Data States
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = create mode, id = edit mode
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    fetchProducts(pagination.page);
  }, [pagination.page]);

  const fetchProducts = async (page) => {
    try {
      const response = await getAllProducts(page);
      setProducts(response.data);
      setPagination({
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
      });
    } catch (error) {
      console.error("Fetch failed", error);
    }
  };

  // --- Modal Handlers ---
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      category_id: product.category_id,
      sub_category_id: product.sub_category_id,
      brand_id: product.brand_id,
      name: product.name,
      short_description: product.short_description || "",
      long_description: product.long_description || "",
      seo_title: product.seo_title || "",
      seo_description: product.seo_description || "",
      seo_keywords: product.seo_keywords || "",
      status: product.status,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await createProduct(formData);
      }
      setIsModalOpen(false);
      fetchProducts(pagination.page);
    } catch (error) {
      alert("Error saving product: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent delete this product?")) {
      await deleteProduct(id);
      fetchProducts(pagination.page);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventory
          </h1>
          <p className="text-slate-500 mt-1">
            Create, edit, and track your store products.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-xs font-bold uppercase text-slate-500">
                  Product
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase text-slate-500">
                  Info
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase text-slate-500">
                  Price
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase text-slate-500">
                  Status
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        {product.primary_image ? (
                          <img
                            src={product.primary_image}
                            className="h-full w-full object-cover rounded-xl"
                          />
                        ) : (
                          <Package size={20} />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          ID: #{product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600 block">
                      {product.category_name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {product.brand_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-emerald-600">
                      ${product.min_price || "0"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${product.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-rose-600 hover:border-rose-200 shadow-sm transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL - CREATE / UPDATE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Product" : "Create New Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Basic Details */}
              <div className="space-y-4 col-span-2">
                <label className="block text-sm font-bold text-slate-700">
                  Product Name *
                </label>
                <input
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Bosch Air Filter"
                />
              </div>

              {/* IDs (In a real app, these would be dropdowns) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Category ID
                </label>
                <input
                  type="number"
                  required
                  className="form-input-style w-full px-4 py-3 rounded-xl border border-slate-200"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Brand ID
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200"
                  value={formData.brand_id}
                  onChange={(e) =>
                    setFormData({ ...formData, brand_id: e.target.value })
                  }
                />
              </div>

              {/* Descriptions */}
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">
                  Short Description
                </label>
                <textarea
                  rows="2"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      short_description: e.target.value,
                    })
                  }
                />
              </div>

              {/* SEO Section */}
              <div className="col-span-2 mt-4">
                <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">
                  SEO & Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    placeholder="SEO Title"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                    value={formData.seo_title}
                    onChange={(e) =>
                      setFormData({ ...formData, seo_title: e.target.value })
                    }
                  />
                  <input
                    placeholder="SEO Keywords"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                    value={formData.seo_keywords}
                    onChange={(e) =>
                      setFormData({ ...formData, seo_keywords: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="SEO Description"
                    className="col-span-2 w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                    value={formData.seo_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo_description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="col-span-2 pt-6 border-t border-slate-100 flex gap-3 justify-end sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  <Save size={18} />
                  {editingId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsList;
