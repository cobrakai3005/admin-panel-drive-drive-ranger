import API from "../config/axios";

export const loginApi = async (formData) => {
  console.log("789");
  const res = await API.post("/auth/login", formData);
  return res.data;
};

export const logoutApi = async () => {
  const res = await API.post("/auth/logout");
};
