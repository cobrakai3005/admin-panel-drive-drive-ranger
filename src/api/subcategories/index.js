import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getSubcategories = (params) =>
  api.get("/sub-categories/get_all_subcategories", { params }).then(unwrap);

export const getSubcategoryById = (id) =>
  api.get(`/sub-categories/get_subcategory_by_id/${id}`).then(unwrap);

export const createSubcategory = (data) =>
  api
    .post("/sub-categories/create_subcategory", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(unwrap);

export const updateSubcategory = (id, data) =>
  api
    .put(`/sub-categories/update_subcategory/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(unwrap);

export const deleteSubcategory = (id) =>
  api.delete(`/sub-categories/delete_subcategory/${id}`).then(unwrap);
export const deleteSubcategoryImage = (id) =>
  api.delete(`/sub-categories/image/${id}`).then(unwrap);

export const toggleSubcategoryStatus = (id) =>
  api.patch(`/sub-categories/toggle_status/${id}`).then(unwrap);

export const fetchSubcategoryOptions = async (categoryId) => {
  const params = { limit: 100, status: "active" };
  if (categoryId) params.category_id = categoryId;
  const res = await getSubcategories(params);
  return res.data || [];
};
