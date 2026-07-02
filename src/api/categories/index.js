import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getCategories = (params) =>
  api.get("/categories/get_all_categories", { params }).then(unwrap);

export const getCategoryById = (id) =>
  api.get(`/categories/get_category_by_id/${id}`).then(unwrap);

export const createCategory = (data) =>
  api
    .post("/categories/create_category", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(unwrap);

export const updateCategory = (id, data) =>
  api
    .put(`/categories/update_category/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(unwrap);

export const deleteCategory = (id) =>
  api.delete(`/categories/delete_category/${id}`).then(unwrap);
export const deleteCategoryImage = (id) =>
  api.delete(`/categories/image/${id}`).then(unwrap);

export const toggleCategoryStatus = (id) =>
  api.patch(`/categories/toggle_status/${id}`).then(unwrap);

export const fetchCategoryOptions = async (status = "active") => {
  const res = await getCategories({ limit: 100, status });
  return res.data || [];
};
