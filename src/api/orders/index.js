import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getAllOrders = (params) =>
  api.get("/orders/admin/all", { params }).then(unwrap);

export const updateOrderStatus = (id, data) =>
  api.put(`/orders/admin/${id}/status`, data).then(unwrap);
