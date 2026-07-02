import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getAllClaims = (params) =>
  api.get("/warranty/admin/show-claims", { params }).then(unwrap);

// export const  = (id, data) =>
//   api.put(`/warranty/admin/${id}/status`, data).then(unwrap);
