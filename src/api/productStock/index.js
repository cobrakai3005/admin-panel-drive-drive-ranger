// import api from "../../config/axios";

// const unwrap = (res) => res.data;

// export const getStock = (productItemId) =>
//   api.get(`/available-stocks/items/${productItemId}/stock`).then(unwrap);

// export const setStock = (productItemId, data) =>
//   api.put(`/available-stocks/items/${productItemId}/stock`, data).then(unwrap);

// export const adjustStock = (productItemId, data) =>
//   api
//     .patch(`/available-stocks/items/${productItemId}/stock/adjust`, data)
//     .then(unwrap);

// export const deleteStock = (stockId) =>
//   api.delete(`/available-stocks/stock/${stockId}`).then(unwrap);

// export const getStockStatus = (productItemId) =>
//   api.get(`/available-stocks/items/${productItemId}/stock/status`).then(unwrap);

// export const checkBackorder = (productItemId, requestedQuantity = 1) =>
//   api
//     .post(`/available-stocks/items/${productItemId}/stock/backorder`, {
//       requested_quantity: requestedQuantity,
//     })
//     .then(unwrap);

// export const updateThreshold = (productItemId, threshold) =>
//   api
//     .put(`/available-stocks/items/${productItemId}/stock/threshold`, {
//       threshold_quantity: threshold,
//     })
//     .then(unwrap);

// export const getReorderList = (includeBackorderAllowed = false) =>
//   api
//     .get(
//       `/available-stocks/stock/reorder?include_backorder_allowed=${includeBackorderAllowed}`,
//     )
//     .then(unwrap);
