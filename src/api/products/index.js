import api from "../../config/axios";
const unwrap = (res) => res.data;
// ============ PRODUCT FUNCTIONS ============
// Get all products
export async function getAllProductsApi(params) {
  return api.get("/products/get_all_products", { params }).then(unwrap);
}

export const fetchProductOptions = async (status = "active") => {
  const res = await getAllProductsApi({ limit: 100, status });
  return res.data || [];
};

// Get product by ID or slug
export async function getProductByIdOrSlugApi(identifier) {
  return api.get(`/products/get_product_by_id/${identifier}`);
}

// Create product
export async function createProductApi(data) {
  return api.post("/products/create_product", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Update product
export async function updateProductApi(productId, data) {
  return api.put(`/products/update_product/${productId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Delete product
export async function deleteProductApi(productId) {
  return api.delete(`/products/delete_product/${productId}`);
}

// Toggle product status
export async function toggleProductStatusApi(productId) {
  return api.patch(`/products/toggle_status/${productId}`);
}

// // Reorder product images
// export async function reorderProductImagesApi(productId, reorderData) {
//   return api.patch(`/products/${productId}/images/reorder`, reorderData);
// }

// ============ PRODUCT ITEMS FUNCTIONS ============

// Get all product items
export async function getAllProductItemsApi() {
  return api.get("/products/get_all_items");
}

// Get product item by ID
export async function getProductItemByIdApi(itemId) {
  return api.get(`/products/get_item_by_id/${itemId}`);
}

// Create product item
export async function createProductItemApi(formData) {
  return api.post("/products/create_item", formData);
}

// Update product item
export async function updateProductItemApi(itemId, formData) {
  return api.put(`/products/update_item/${itemId}`, formData);
}

// Delete product item
export async function deleteProductItemApi(itemId) {
  return api.delete(`/products/delete_item/${itemId}`);
}

// ============ PRODUCT ATTRIBUTES FUNCTIONS ============

// Get product attributes
export async function getProductAttributesApi(productId) {
  return api.get(`/products/${productId}/attributes/get_all_attributes`);
}

// Add product attribute
export async function addProductAttributeApi(productId, attributeData) {
  return api.post(
    `/products/${productId}/attributes/create_attibute`,
    attributeData,
  );
}

// Update product attribute
export async function updateProductAttributeApi(attributeId, attributeData) {
  return api.put(
    `/products/attributes/update_attribute/${attributeId}`,
    attributeData,
  );
}

// Delete product attribute
export async function deleteProductAttributeApi(attributeId) {
  return api.delete(`/products/attributes/delete_attribute/${attributeId}`);
}
// ============ PRODUCT IMAGES FUNCTIONS ============

export async function getProductImagesApi(productId, status = "active") {
  const query = status === "all" ? "?status=all" : "";
  return api.get(`/products/${productId}/images${query}`).then(unwrap);
}

export async function addProductImageApi(productId, formData) {
  return api.post(`/products/${productId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteProductImageApi(imageId) {
  return api.delete(`/products/images/${imageId}`);
}

export async function reorderProductImagesApi(productId, reorderData) {
  return api.patch(`/products/${productId}/images/reorder`, reorderData);
}

export async function toggleImageStatusApi(imageId) {
  return api.patch(`/products/images/${imageId}/toggle-status`);
}

// // api/products.js
// export const fetchProductOptions = async () => {
//   // Fetch products with vehicle compatibility info
//   const response = await api.get('/products/options');
//   return response.data; // Should return [{ id, name, brand, model, generation, image_url, ... }]
// };

export const fetchProductDetails = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const fetchProductImages = async (productId) => {
  const response = await api.get(`/products/${productId}/images`);
  return response.data;
};

export const fetchVehicleCompatibility = async (productId) => {
  const response = await api.get(
    `/products/${productId}/vehicle-compatibility`,
  );
  return response.data;
};
