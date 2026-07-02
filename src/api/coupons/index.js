import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getCoupons = (params) =>
  api.get("/coupons/templates", { params }).then(unwrap);

export const createCoupon = (data) =>
  api.post("/coupons/create-template", data).then(unwrap);
export const updateCoupon = (id, data) =>
  api.put(`/coupons/update-template/${id}`, data).then(unwrap);

export const getUserCouponsAdmin = (userId) =>
  api.get(`/coupons/user-coupons/${userId}`).then(unwrap);

// New endpoints
export const toggleCouponStatus = (id) =>
  api.put(`/coupons/${id}/status`).then(unwrap);

export const deleteCoupon = (id) =>
  api.delete(`/coupons/delete-coupon/${id}`).then(unwrap);
