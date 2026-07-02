import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getBrands = (params) =>
  api.get("/brands/get_all_brands", { params }).then(unwrap);

export const getBrandById = (id) =>
  api.get(`/brands/get_brand_by_id/${id}`).then(unwrap);

export const createBrand = (data) =>
  api.post("/brands/create_brand", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(unwrap);

export const updateBrand = (id, data) =>
  api.put(`/brands/update_brand/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(unwrap);

export const deleteBrand = (id) =>
  api.delete(`/brands/delete_brand/${id}`).then(unwrap);

export const fetchBrandOptions = async () => {
  const res = await getBrands({ limit: 100 });
  return res.data || [];
};
