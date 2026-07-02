import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getTransactionsByOrder = (orderId) =>
  api.get(`/transactions/order/${orderId}`).then(unwrap);


export const getTransactions = (params) =>
  api.get(`/transactions`, { params }).then(unwrap);

export const getTransactionById = (id) =>
  api.get(`/transactions/${id}`).then(unwrap);

export const createTransaction = (data) =>
  api.post("/transactions/", data).then(unwrap);

export const updateTransactionStatus = (id, data) =>
  api.patch(`/transactions/${id}/status`, data).then(unwrap);
