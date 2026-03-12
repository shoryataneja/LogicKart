import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register  = (data) => api.post("/auth/register", data);
export const login     = (data) => api.post("/auth/login", data);
export const getMe     = ()     => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/profile", data);

// Products
export const getProducts    = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);

// Cart
export const getCart        = ()             => api.get("/cart");
export const addToCart      = (data)         => api.post("/cart", data);
export const updateCartItem = (pid, qty)     => api.put(`/cart/${pid}`, { quantity: qty });
export const removeCartItem = (pid)          => api.delete(`/cart/${pid}`);

// Orders
export const createOrder   = ()    => api.post("/orders");
export const getUserOrders = ()    => api.get("/orders");
export const getOrderById  = (id)  => api.get(`/orders/${id}`);
export const mockPayment   = (id)  => api.post("/orders/payment", { orderId: id });
