import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getAllReturns = (params) =>
  api.get("/returns/admin/all", { params }).then(unwrap);

export const getReturnDetails = (id) =>
  api.get(`/returns/admin/${id}`).then(unwrap);

export const updateReturnStatus = (id, data) =>
  api.put(`/returns/admin/${id}/status`, data).then(unwrap);
