import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getAddresses = (params) =>
  api.get("/user-addresses/", { params }).then(unwrap);

export const getAddressById = (addressId) =>
  api.get(`/user-addresses/${addressId}`).then(unwrap);

export const createAddress = (data) =>
  api.post("/user-addresses/create_address", data).then(unwrap);

export const updateAddress = (addressId, data) =>
  api.put(`/user-addresses/update-address/${addressId}`, data).then(unwrap);

export const deleteAddress = (addressId) =>
  api.delete(`/user-addresses/delete_address/${addressId}`).then(unwrap);
