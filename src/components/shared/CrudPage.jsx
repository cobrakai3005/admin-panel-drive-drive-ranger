import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import {
  Edit3,
  Loader2,
  RefreshCw,
  Save,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import PageHeader from "./PageHeader";
import Pagination from "./Pagination";
import Modal from "./Modal";
import FormSelect from "./SelectField";
import MultiSelectField from "./MultiSelect";
import StatusBadge from "./StatusBadge";
import { toast } from "sonner";
import Select from "react-select";
import { confirmDelete, confirmUpdate, confirmToggle } from "./Confirm";

// Helper to build FormData from values
function buildFormData(values, fileFields = []) {
  const fd = new FormData();

  Object.entries(values).forEach(([key, val]) => {
    if (fileFields.includes(key)) {
      let files = [];

      if (val instanceof FileList) {
        files = Array.from(val);
      } else if (Array.isArray(val)) {
        files = val;
      } else if (val instanceof File) {
        files = [val];
      }

      files.forEach((file) => {
        if (file instanceof File) fd.append(key, file);
      });

      return;
    }

    if (Array.isArray(val)) {
      val.forEach((item) => {
        fd.append(`${key}[]`, item);
      });
      return;
    }

    if (val !== undefined && val !== null && val !== "") {
      fd.append(key, val);
    }
  });

  return fd;
}

// Field renderer component - hooks are always called in the same order
function FieldRenderer({ field, form, setForm, editingRow, idKey }) {
  const [existingImages, setExistingImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [compatibilities, setCompatibilities] = useState([]);
  const [loadingCompatibilities, setLoadingCompatibilities] = useState(false);
  const [selectedPreviews, setSelectedPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const firstFilterRender = useRef(true);
  // Cleanup blob URLs when component unmounts or previews change
  const prevPreviewsRef = useRef(selectedPreviews);

  useEffect(() => {
    // Revoke URLs from previous previews that are no longer in the current set
    const removedPreviews = prevPreviewsRef.current.filter(
      (p) => !selectedPreviews.find((sp) => sp.preview === p.preview),
    );
    removedPreviews.forEach((p) => URL.revokeObjectURL(p.preview));

    prevPreviewsRef.current = selectedPreviews;
  }, [selectedPreviews]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      selectedPreviews.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, []);

  // Load existing images when editing
  useEffect(() => {
    if (!editingRow) {
      setExistingImages([]);
      return;
    }

    // Single image already present in the row
    if (!field.loadImages) {
      const imageUrl = editingRow[field.imageField || field.name];
      if (imageUrl) {
        setExistingImages([
          {
            id: editingRow[idKey],
            image_url: imageUrl,
          },
        ]);
      } else {
        setExistingImages([]);
      }
      return;
    }

    // Multiple images loaded from API
    const recordId = editingRow[idKey];
    if (!recordId) {
      setExistingImages([]);
      return;
    }

    setLoadingImages(true);
    field
      .loadImages(recordId)
      .then((res) => setExistingImages(res?.data || []))
      .catch((err) => {
        console.error("Failed to load images:", err);
        setExistingImages([]);
      })
      .finally(() => setLoadingImages(false));
  }, [editingRow, field, idKey]);

  // Load compatibilities when editing
  useEffect(() => {
    // FIX: Check the correct property name
    if (!editingRow || !field.loadCompatibilities) {
      setCompatibilities([]);
      return;
    }

    const recordId = editingRow[idKey];
    if (!recordId) {
      setCompatibilities([]);
      return;
    }

    setLoadingCompatibilities(true);
    field
      .loadCompatibilities(recordId)
      .then((data) => {
        console.log(data);

        setCompatibilities(data?.data || data || []);
        // Pre-populate the form with existing vehicle_generation_ids
        if (data && data.length > 0 && field.type === "multi-select") {
          const existingIds = data.map((item) => item.vehicle_generation_id);
          setForm((prev) => ({ ...prev, [field.name]: existingIds }));
        }
      })
      .catch((err) => {
        console.error("Failed to load compatibilities:", err);
        setCompatibilities([]);
      })
      .finally(() => setLoadingCompatibilities(false));
  }, [editingRow, field.loadCompatibilities, field.type, field.name, idKey]);

  // Common value getter
  const value = useMemo(() => {
    if (field.type === "date") {
      const val = form[field.name];
      return val ? new Date(val).toISOString().split("T")[0] : "";
    }
    if (field.type === "multi-select") {
      return form[field.name] ?? [];
    }
    if (field.type === "number") {
      return form[field.name] ?? "";
    }
    return form[field.name] ?? "";
  }, [form, field.name, field.type]);

  const onChange = (v) => {
    let val = v;
    if (field.type === "number") {
      val = v === 0 ? "" : v;
    }
    setForm((prev) => ({ ...prev, [field.name]: val }));
  };

  // File change handler
  const handleFileChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      const previews = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setSelectedPreviews((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.preview));
        return previews;
      });
      onChange(files);
    },
    [onChange],
  );

  // Remove existing image
  const handleRemoveImage = useCallback(
    async (imageId) => {
      if (field.deleteImage) {
        try {
          await field.deleteImage(imageId);
          setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
          toast.success("Image removed");
        } catch (err) {
          console.error("Failed to remove image:", err);
          toast.error("Failed to remove image");
        }
        return;
      }

      // Single image removal (for Category, Brand, etc.)
      setExistingImages([]);
      onChange(null);
    },
    [field.deleteImage, onChange],
  );

  // Remove selected preview (FIX: don't try to modify file input programmatically)
  // const handleRemoveSelected = useCallback(
  //   (index) => {
  //     setSelectedPreviews((prev) => {
  //       const updated = [...prev];
  //       URL.revokeObjectURL(updated[index].preview);
  //       updated.splice(index, 1);
  //       return updated;
  //     });

  //     onChange(
  //       selectedPreviews.filter((_, i) => i !== index).map((p) => p.file),
  //     );
  //   },
  //   [selectedPreviews, onChange],
  // );

  const handleRemoveSelected = useCallback(
    (index) => {
      setSelectedPreviews((prev) => {
        const updated = [...prev];

        URL.revokeObjectURL(updated[index].preview);
        updated.splice(index, 1);

        // Create a new FileList
        const dataTransfer = new DataTransfer();

        updated.forEach((item) => {
          dataTransfer.items.add(item.file);
        });

        fileInputRef.current.files = dataTransfer.files;

        onChange(Array.from(dataTransfer.files));

        return updated;
      });
    },
    [onChange],
  );

  // Remove compatibility
  const handleRemoveCompatibility = useCallback(
    async (compatibilityId) => {
      if (!field.removeCompatibility) return;

      try {
        await field.removeCompatibility(compatibilityId);
        setCompatibilities((prev) =>
          prev.filter((comp) => comp.id !== compatibilityId),
        );
        toast.success("Vehicle compatibility removed");
      } catch (err) {
        console.error("Failed to remove compatibility:", err);
        toast.error("Failed to remove vehicle compatibility");
      }
    },
    [field.removeCompatibility],
  );

  // ----- SELECT -----
  if (field.type === "select") {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {field.label}
          {field.required && " *"}
        </label>
        <FormSelect
          field={field}
          value={value}
          form={form}
          onChange={onChange}
        />
      </div>
    );
  }

  // ----- MULTI-SELECT -----
  if (field.type === "multi-select") {
    return (
      <div
        className={field.colSpan === 2 ? "col-span-2 space-y-3" : "space-y-3"}
      >
        <MultiSelectField
          field={field}
          value={value}
          onChange={onChange}
          editingRow={editingRow}
        />

        {/* Display existing compatibilities when editing */}
        {editingRow && compatibilities.length > 0 && (
          <div className="space-y-2 mt-3">
            <p className="text-xs font-medium text-slate-600">
              Current Vehicle Compatibility:
            </p>
            <div className="flex flex-wrap gap-2">
              {compatibilities.map((comp) => (
                <div
                  key={comp.id}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                >
                  <span className="font-medium text-slate-800">
                    {comp.make_name}
                  </span>
                  <span className="text-slate-400">{comp.model_name}</span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                    {comp.generation_name}
                  </span>
                  <span className="text-slate-500">
                    {comp.year_from} - {comp.year_to || "Present"}
                  </span>
                  {field.removeCompatibility && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCompatibility(comp.id)}
                      className="ml-1 p-0.5 rounded hover:bg-red-100 text-red-500"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {loadingCompatibilities && (
          <p className="text-xs text-slate-400">
            Loading vehicle compatibility...
          </p>
        )}
      </div>
    );
  }

  // ----- TEXTAREA -----
  if (field.type === "textarea") {
    return (
      <div
        className={
          field.colSpan === 2 ? "col-span-2 space-y-1.5" : "space-y-1.5"
        }
      >
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {field.label}
          {field.required && " *"}
        </label>
        <textarea
          rows={field.rows || 3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>
    );
  }

  // ----- FILE -----
  if (field.type === "file") {
    return (
      <div
        className={field.colSpan === 2 ? "col-span-2 space-y-3" : "space-y-3"}
      >
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {field.label}
        </label>

        {/* //  Existing images */}
        {editingRow && field.multiple === true && existingImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.image_url}
                  alt="Existing"
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                />
                {(field.deleteImage || !field.loadImages) && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-200"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {loadingImages && (
          <p className="text-xs text-slate-400">Loading images...</p>
        )}

        {/* File input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple={field.multiple}
          accept={field.accept || "image/*"}
          onChange={handleFileChange}
          className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100 cursor-pointer"
        />

        {/* Selected previews */}
        {selectedPreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {selectedPreviews.map((img, index) => (
              <div
                key={`${img.preview}-${index}`}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <img
                  src={img.preview}
                  alt={img.file.name}
                  className="h-24 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSelected(index)}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 text-xs"
                >
                  <X size={12} />
                </button>
                <div className="p-2">
                  <p className="truncate text-xs text-slate-600">
                    {img.file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ----- CHECKBOX -----
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
        />
        {field.label}
      </label>
    );
  }

  // ----- DEFAULT (text, number, date, etc.) -----
  return (
    <div
      className={field.colSpan === 2 ? "col-span-2 space-y-1.5" : "space-y-1.5"}
    >
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {field.label}
        {field.required && " *"}
      </label>
      <input
        type={field.type || "text"}
        value={value}
        onChange={(e) =>
          onChange(
            field.type === "number"
              ? Number(e.target.value) || 0
              : e.target.value,
          )
        }
        required={field.required}
        min={field.min}
        max={field.max}
        step={field.step}
        placeholder={field.placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
      />
    </div>
  );
}

// Main CrudPage component
export default function CrudPage({
  title,
  description,
  idKey = "id",
  columns,
  formFields = [],
  defaultForm = {},
  fileFields = [],
  fetchList,
  getDefaultForm,
  createItem,
  updateItem,
  deleteItem,
  toggleStatus,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  createLabel = "Add New",
  modalWide = false,
  FilterComponent,
  emptyMessage = "No records found.",
  preparePayload,
  onEditRow,
}) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [filterState, setFilterState] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const firstFilterRender = useRef(true);

  // Load data
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchList(page, filterState);
      setRows(res?.data || []);
      setTotalPages(res?.pagination?.totalPages || 1);
      setCurrentPage(res?.pagination?.page || 0);
      setLimit(res?.pagination?.limit || 10);
    } catch (err) {
      console.error("Failed to load data:", err);
      toast.error("Failed to load data");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [fetchList, page, filterState]);

  useEffect(() => {
    load();
  }, [load]);

  // FIX: Reset to page 1 when filters change
  useEffect(() => {
    if (firstFilterRender.current) {
      firstFilterRender.current = false;
      return;
    }

    setPage((prev) => (prev === 1 ? prev : 1));
  }, [filterState]);

  const openCreate = useCallback(() => {
    setEditingRow(null);
    const initial = getDefaultForm ? getDefaultForm() : { ...defaultForm };
    setForm(initial);
    setModalOpen(true);
  }, [defaultForm, getDefaultForm]);

  const openEdit = useCallback(
    (row) => {
      if (onEditRow) {
        onEditRow(row);
        return;
      }

      setEditingRow(row);
      const next = { ...defaultForm };
      formFields.forEach((f) => {
        if (row[f.name] !== undefined && row[f.name] !== null) {
          next[f.name] = row[f.name];
        }
      });
      setForm(next);
      setModalOpen(true);
    },
    [defaultForm, formFields, onEditRow],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSaving(true);

      try {
        let payload = preparePayload
          ? preparePayload(form, editingRow)
          : { ...form };

        // Handle date fields
        if (payload.valid_from && payload.valid_to) {
          payload.valid_from = new Date(payload.valid_from).toISOString();
          payload.valid_to = new Date(payload.valid_to).toISOString();
        }

        // Convert to FormData if file fields exist
        if (fileFields.length > 0) {
          payload = buildFormData(payload, fileFields);
        }

        if (editingRow) {
          const ok = await confirmUpdate({
            title: `Update ${title}`,
            content: "Are you sure you want to save these changes?",
            okText: "Update",
          });
          if (!ok) {
            setSaving(false);
            return;
          }
          await updateItem(editingRow[idKey], payload);
        } else {
          // FIX: Ensure createItem always returns a value
          const result = await createItem(payload);
          if (!result) {
            throw new Error("Create operation returned no result");
          }
        }

        setModalOpen(false);
        load();
        toast.success(
          editingRow ? "Updated successfully" : "Created successfully",
        );
      } catch (err) {
        console.error("Save failed:", err);
        const message =
          err?.response?.data?.message || err?.message || "Failed to save";
        toast.error(message);
      } finally {
        setSaving(false);
      }
    },
    [
      form,
      editingRow,
      preparePayload,
      fileFields,
      title,
      idKey,
      updateItem,
      createItem,
      load,
    ],
  );

  const handleDelete = useCallback(
    async (row) => {
      const ok = await confirmDelete({
        title: `Delete ${title}`,
        content: "This action cannot be undone. Are you sure?",
        okText: "Delete",
        okType: "danger",
      });

      if (!ok) return;

      try {
        await deleteItem(row[idKey]);
        load();
        toast.success("Deleted successfully");
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error(err?.response?.data?.message || "Delete failed");
      }
    },
    [deleteItem, idKey, title, load],
  );

  const handleToggle = useCallback(
    async (row) => {
      try {
        const ok = await confirmToggle({
          title: "Toggle Status",
          content: "Are you sure you want to toggle the status?",
          okText: "Toggle",
        });
        if (!ok) return;

        await toggleStatus(row[idKey]);
        load();
        toast.success("Status toggled successfully");
      } catch (err) {
        console.error("Toggle failed:", err);
        toast.error(err?.response?.data?.message || "Toggle failed");
      }
    },
    [toggleStatus, idKey, load],
  );

  return (
    <div className="min-h-screen p-6">
      <PageHeader
        title={title}
        description={description}
        actionLabel={canCreate && createItem ? createLabel : undefined}
        onAction={canCreate && createItem ? openCreate : undefined}
        extra={
          <div className="flex items-center gap-2">
            {/* FIX: FilterComponent is now a controlled component */}
            {FilterComponent && (
              <FilterComponent
                filterState={filterState}
                setFilterState={setFilterState}
              />
            )}
            <button
              type="button"
              onClick={load}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        }
      />

      <div className="border min-h-[400px] border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-xs font-bold uppercase text-slate-500 whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
                {(canEdit || canDelete || toggleStatus) && (
                  <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    <Loader2 className="inline animate-spin mr-2" size={18} />
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={row[idKey]} className="hover:bg-indigo-50/20 group">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 font-medium text-slate-500"
                      >
                        {col.render ? (
                          col.render(row)
                        ) : col.key === "status" ? (
                          <StatusBadge status={row[col.key]} />
                        ) : col.key === "no" ? (
                          (currentPage - 1) * limit + idx + 1
                        ) : col.key === "is_front" ? (
                          <StatusBadge
                            status={row[col.key] == 1 ? "Yes" : " No"}
                          />
                        ) : (
                          (row[col.key] ?? "—")
                        )}
                      </td>
                    ))}
                    {(canEdit || canDelete || toggleStatus) && (
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          {toggleStatus && (
                            <button
                              type="button"
                              onClick={() => handleToggle(row)}
                              className="p-2 rounded-lg border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
                              title="Toggle status"
                            >
                              {row.status === "active" ? (
                                <ToggleRight size={16} />
                              ) : (
                                <ToggleLeft size={16} />
                              )}
                            </button>
                          )}
                          {canEdit && (updateItem || onEditRow) && (
                            <button
                              type="button"
                              onClick={() => openEdit(row)}
                              className="p-2 rounded-lg border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                          {canDelete && deleteItem && (
                            <button
                              type="button"
                              onClick={() => handleDelete(row)}
                              className="p-2 rounded-lg border border-slate-200 hover:border-rose-200 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Edit/Create Modal */}
      {formFields.length > 0 && (createItem || updateItem) && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingRow ? `Edit ${title}` : `Create ${title}`}
          wide={modalWide}
        >
          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {formFields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                form={form}
                setForm={setForm}
                editingRow={editingRow}
                idKey={idKey}
              />
            ))}
            <div className="col-span-2 flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : editingRow ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export { buildFormData };
