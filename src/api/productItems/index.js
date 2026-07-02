import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getProductItems = (params) =>
  api.get("/products/get_all_items", { params }).then(unwrap);

export const getProductItemById = (id) =>
  api.get(`/products/get_item_by_id/${id}`).then(unwrap);

export const createProductItem = (data) =>
  api.post("/products/create_item", data).then(unwrap);

export const updateProductItem = (id, data) =>
  api.put(`/products/update_item/${id}`, data).then(unwrap);

export const deleteProductItem = (id) =>
  api.delete(`/products/delete_item/${id}`).then(unwrap);

export const fetchProductItemOptions = async (productId) => {
  const params = { limit: 100 };
  if (productId) params.product_id = productId;
  const res = await getProductItems(params);
  return res.data || [];
};
