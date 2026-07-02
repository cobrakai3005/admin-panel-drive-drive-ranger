import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getAllReviews = (params) =>
  api.get("/reviews/admin/all", { params }).then(unwrap);

export const moderateReview = (id, data) =>
  api.put(`/reviews/admin/${id}/moderate`, data).then(unwrap);
export const deleteReview = (id, data) =>
  api.delete(`/reviews/admin/${id}/delete`, data).then(unwrap);
export const toggleIsFrontReview = (id, data) =>
  api.patch(`/reviews/admin/${id}/toggle_is_front`, data).then(unwrap);

export const deleteReviewImages = (id, public_ids) =>
  api
    .delete(`/reviews/admin/${id}/delete_images`, {
      data: { public_ids },
    })
    .then(unwrap);
// Web site Review

export const getALlWebsiteReviews = (params) =>
  api.get("/website-reviews/admin/all", { params }).then(unwrap);

export const moderateWebsiteReview = (id, data) =>
  api.patch(`/website-reviews/admin/moderate/${id}`, data).then(unwrap);
export const deleteWebsiteReview = (id, data) =>
  api.delete(`/website-reviews/delete/${id}`, data).then(unwrap);
