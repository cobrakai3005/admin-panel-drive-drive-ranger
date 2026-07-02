import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Plus,
  Trash2,
  Loader2,
  GripVertical,
  ImageOff,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import Modal from "../../components/shared/Modal";
import {
  getProductImagesApi,
  addProductImageApi,
  deleteProductImageApi,
  reorderProductImagesApi,
  toggleImageStatusApi,
  fetchProductOptions,
} from "../../api/products";
import Select from "react-select";
import { confirmDelete, confirmToggle } from "../../components/shared/Confirm";

export default function ProductImagesAdminPage() {
  const { productId: urlProductId } = useParams();
  const [productId, setProductId] = useState(urlProductId || "");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // array of File objects
  const [uploading, setUploading] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [error, setError] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch product options for dropdown (if no productId from URL)
  useEffect(() => {
    if (!urlProductId) {
      fetchProductOptions("active")
        .then(setProductOptions)
        .catch(console.error);
    }
  }, [urlProductId]);

  // Fetch images when productId changes
  const loadImages = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getProductImagesApi(
        productId,
        showInactive ? "all" : "active",
      );
      console.log(res.data);
      setImages(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [productId, showInactive]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Upload handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      // Append each file with the same field name "product_images"
      selectedFiles.forEach((file) => {
        formData.append("product_images", file);
      });
      // sort_order and status are optional; backend defaults to 0 and "active"
      await addProductImageApi(productId, formData);
      setUploadModalOpen(false);
      setSelectedFiles([]);
      showToast(`${selectedFiles.length} image(s) uploaded successfully!`);
      loadImages();
    } catch (err) {
      showToast(err?.response?.data?.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // Delete handler
  const handleDelete = async (imageId) => {
    const ok = await confirmDelete({
      title: "Delete  this  Image",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
    });
    try {
      if (!ok) return;
      await deleteProductImageApi(imageId);
      showToast("Image deleted successfully!");
      loadImages();
    } catch (err) {
      showToast(err?.response?.data?.message || "Delete failed", "error");
    }
  };

  // Toggle status handler
  const handleToggleStatus = async (imageId) => {
    try {
      const ok = await confirmToggle({
        title: "Toggle  this  Image",
        content: "This action cannot be undone.",
        okText: "Toggle",
        okType: "danger",
      });
      if (!ok) return;
      const res = await toggleImageStatusApi(imageId);
      showToast(res.data.message || "Status toggled successfully!");
      loadImages();
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to toggle status",
        "error",
      );
    }
  };

  // Reorder handler (drag & drop)
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    // Only allow reordering if image is active
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);

    const orderedIds = items.map((img) => img.id);
    setSavingOrder(true);
    try {
      await reorderProductImagesApi(productId, { orderedIds });
      showToast("Images reordered successfully!");
      loadImages();
    } catch (err) {
      showToast(err?.response?.data?.message || "Reorder failed", "error");
      loadImages();
    } finally {
      setSavingOrder(false);
    }
  };

  const renderProductSelector = () => {
    if (urlProductId) return null;

    const options = productOptions.map((p) => ({
      value: p.id,
      label: `${p.name}  | (${p.media.length})`,
    }));

    return (
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">Product:</label>

        <div className="min-w-[300px]">
          <Select
            options={options}
            value={options.find((opt) => opt.value === productId) || null}
            onChange={(selected) => setProductId(selected?.value || "")}
            placeholder="Select a product"
            isClearable
            classNames={{
              control: () =>
                "rounded-xl border border-slate-200 min-h-[42px] shadow-none hover:border-slate-300",
              menu: () => "rounded-xl overflow-hidden",
              option: ({ isFocused, isSelected }) =>
                `${isSelected ? "bg-indigo-600 text-white" : isFocused ? "bg-indigo-50" : ""}`,
            }}
          />
        </div>
      </div>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Active
      </span>
    ) : (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Inactive
      </span>
    );
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      <PageHeader
        title="Product Images"
        description="Manage images for the selected product"
        actionLabel={productId ? "Upload Image" : undefined}
        onAction={productId ? () => setUploadModalOpen(true) : undefined}
        extra={
          <div className="flex items-center gap-2">
            {renderProductSelector()}
            {/* Show Inactive Toggle */}
            {productId && (
              <button
                type="button"
                onClick={() => setShowInactive(!showInactive)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  showInactive
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                }`}
              >
                {showInactive ? <Eye size={16} /> : <EyeOff size={16} />}
                {showInactive ? "Showing All" : "Hide Inactive"}
              </button>
            )}
            <button
              type="button"
              onClick={loadImages}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Refresh"
              disabled={!productId}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        }
      />

      {/* Content */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm p-6">
        {!productId ? (
          <div className="text-center text-slate-400 py-12">
            Please select a product to manage its images.
          </div>
        ) : loading ? (
          <div className="text-center text-slate-400 py-12">
            <Loader2 className="inline animate-spin mr-2" size={18} />
            Loading images...
          </div>
        ) : error ? (
          <div className="text-center text-rose-600 py-12">{error}</div>
        ) : images.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <ImageOff className="inline mr-2" size={24} />
            No images found. Upload your first image!
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
              <span>
                Total:{" "}
                <strong className="text-slate-700">{images.length}</strong>
              </span>
              <span>
                Active:{" "}
                <strong className="text-green-700">
                  {images.filter((i) => i.status === "active").length}
                </strong>
              </span>
              <span>
                Inactive:{" "}
                <strong className="text-red-700">
                  {images.filter((i) => i.status === "inactive").length}
                </strong>
              </span>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="images-grid" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  >
                    {images.map((img, index) => (
                      <Draggable
                        key={img.id}
                        draggableId={String(img.id)}
                        index={index}
                        isDragDisabled={img.status === "inactive"}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`
                              relative group rounded-xl overflow-hidden border-2
                              ${snapshot.isDragging ? "border-indigo-500 shadow-xl" : "border-slate-200"}
                              ${img.status === "inactive" ? "opacity-60" : "opacity-100"}
                              bg-white hover:shadow-md transition-shadow
                            `}
                            style={{ ...provided.draggableProps.style }}
                          >
                            <div className="aspect-square bg-slate-100">
                              <img
                                src={img.image_url}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {img.status === "inactive" && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <div className="bg-white/90 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 flex items-center gap-1.5">
                                    <EyeOff size={14} />
                                    Inactive
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Drag handle - only if active */}
                            {img.status === "active" && (
                              <div
                                {...provided.dragHandleProps}
                                className="absolute top-2 left-2 p-1.5 bg-white/80 rounded-full shadow cursor-grab hover:bg-white transition"
                              >
                                <GripVertical
                                  size={16}
                                  className="text-slate-600"
                                />
                              </div>
                            )}

                            {/* Actions */}
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button
                                onClick={() => handleToggleStatus(img.id)}
                                className="p-1.5 bg-white/80 rounded-full shadow hover:bg-white transition opacity-0 group-hover:opacity-100"
                                title={
                                  img.status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              >
                                {img.status === "active" ? (
                                  <EyeOff
                                    size={14}
                                    className="text-slate-600"
                                  />
                                ) : (
                                  <Eye size={14} className="text-green-600" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(img.id)}
                                className="p-1.5 bg-white/80 rounded-full shadow hover:bg-rose-50 hover:text-rose-600 transition opacity-0 group-hover:opacity-100"
                                title="Delete permanently"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            {/* Bottom info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex justify-between items-end">
                              <span className="text-xs text-white font-medium">
                                #{img.sort_order ?? index}
                              </span>
                              <span className="text-xs text-white/80">
                                {getStatusBadge(img.status)}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {savingOrder && (
                      <div className="col-span-full text-center text-sm text-slate-400 mt-2">
                        <Loader2
                          className="inline animate-spin mr-1"
                          size={14}
                        />
                        Saving order...
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        open={uploadModalOpen}
        onClose={() => {
          if (!uploading) {
            setUploadModalOpen(false);
            setSelectedFiles([]);
          }
        }}
        title="Upload Product Images"
        wide={false}
      >
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Image Files *
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium"
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-slate-600">
                  {selectedFiles.length} file(s) selected:
                </p>
                <ul className="text-xs text-slate-500 list-disc list-inside">
                  {selectedFiles.map((file, idx) => (
                    <li key={idx}>
                      {file.name} ({(file.size / 1024).toFixed(0)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              disabled={uploading}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Upload{" "}
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} image(s)`
                    : ""}
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
