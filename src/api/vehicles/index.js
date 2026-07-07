import api from "../../config/axios";

const unwrap = (res) => res.data;

// ============================================
// VEHICLE MAKES
// ============================================
export const getMakes = (params) =>
  api.get("/vehicle-makes/get_all_makes", { params }).then(unwrap);

export const getMakeById = (id) =>
  api.get(`/vehicle-makes/get_make_by_id/${id}`).then(unwrap);

export const createMake = (data) =>
  api
    .post("/vehicle-makes/create_make", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(unwrap);

export const updateMake = (id, data) =>
  api
    .put(`/vehicle-makes/update_make/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(unwrap);

export const deleteMake = (id) =>
  api.delete(`/vehicle-makes/delete_make/${id}`).then(unwrap);

// ============================================
// VEHICLE MODELS
// ============================================
export const getModels = (params) =>
  api.get("/vehicle-models/get_all_models", { params }).then(unwrap);

export const getModelById = (id) =>
  api.get(`/vehicle-models/get_model_by_id/${id}`).then(unwrap);

export const createModel = (data) =>
  api
    .post("/vehicle-models/create_model", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(unwrap);

export const updateModel = (id, data) =>
  api
    .put(`/vehicle-models/update_model/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(unwrap);

export const deleteModel = (id) =>
  api.delete(`/vehicle-models/delete_model/${id}`).then(unwrap);

// ============================================
// VEHICLE GENERATIONS
// ============================================
export const getGenerations = (params = {}) =>
  api.get("/vehicle-generations/get_all_generations", { params }).then(unwrap);

export const getGenerationById = (id) =>
  api.get(`/vehicle-generations/get_generation_by_id/${id}`).then(unwrap);

export const createGeneration = (data) =>
  api.post("/vehicle-generations/create_generation", data).then(unwrap);

export const updateGeneration = (id, data) =>
  api.put(`/vehicle-generations/update_generation/${id}`, data).then(unwrap);

export const deleteGeneration = (id) =>
  api.delete(`/vehicle-generations/delete_generation/${id}`).then(unwrap);

export const fetchVehicleGenerationOptions = async (productId) => {
  console.log(productId);

  const res = productId
    ? await api.get(
        `/vehicle-generations/get_all_available_generation/${productId}`,
      )
    : await api.get("/vehicle-generations/get_all_generations");

  return res.data.data.map((item) => ({
    id: item.id,
    name: `${item.make_name} ${item.model_name} • ${
      item.generation_name || ""
    } (${item.year_from}-${item.year_to ?? "Present"})`,
  }));
};
export const getAvailableVehicleGenerations = async (productId) => {
  const res = await api.get(
    `/vehicle-generations/get_all_available_generation/${productId}`,
  );

  return res.data.data.map((item) => ({
    id: item.id,
    name: `${item.make_name} ${item.model_name} (${item.year_from}-${item.year_to ?? "Present"})`,
  }));
};

// ============================================
// VEHICLE COMPATIBILITY
// ============================================
export const getCompatibilityByProduct = (productId, params) => {
  if (!productId) {
    throw new Error("Please Select a product to view compatibility.");
  }
  const url = `/vehicle-compatibility/product/${productId}`;
  return api.get(url, { params }).then(unwrap);
};

export const getProductsByVehicle = (generationId) =>
  api
    .get(`/vehicle-compatibility/vehicle/${generationId}/products`)
    .then(unwrap);

export const addCompatibility = (data) => {
  // data will contain { product_id, vehicle_generation_ids, compatibility_notes }
  return api
    .put(`/vehicle-compatibility/product/${data.product_id}`, data)
    .then(unwrap);
};

export const removeCompatibility = (id) =>
  api.delete(`/vehicle-compatibility/${id}`).then(unwrap);

// ============================================
// PRODUCTS (for compatibility dropdown)
// ============================================
export const fetchProductOptions = async () => {
  const res = await api
    .get("/products/get_all_products", {
      params: { limit: 100, status: "active" },
    })
    .then(unwrap);
  return res.data || [];
};

// ============================================
// HELPER FUNCTIONS FOR DROPDOWNS
// ============================================
export const fetchMakeOptions = async () => {
  const res = await getMakes({ limit: 100 });
  return res.data || [];
};

export const fetchModelOptions = async () => {
  const res = await getModels({ limit: 100 });
  return res.data || [];
};

export const fetchGenerationOptions = async () => {
  const res = await getGenerations({ limit: 100 });

  return res.data || [];
};
