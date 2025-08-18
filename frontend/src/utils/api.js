import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000/api",
  withCredentials: false,
});

//Flow Admin
export const getFlowConfig = async () => (await api.get("/flow-admin/config")).data;
export const saveFlowConfig = (payload) => api.put("/flow-admin/config", payload);
export { saveFlowConfig as updateFlowConfig }; // alias for consistency

//User Flow
export const registerUser = async (email, password) => (await api.post("/user-flow/register", { email, password })).data;

export const updateUserStep = async (userId, payload) =>
  (await api.patch(`/user-flow/${userId}`, payload)).data;

//Data
// export const getAllUsers = () => api.get("/data/users");
export const getAllUsers = async () => (await api.get("/data/users")).data;

export default api;
