import api from "../../config/axios";

const unwrap = (res) => res.data;

// Get all shipments
export const getShipments = (params) =>
  api.get("/shipments", { params }).then(unwrap);

// Get shipment by ID
export const getShipmentById = (id) => api.get(`/shipments/${id}`).then(unwrap);

// Update shipment status
export const updateShipmentStatus = (id, status) =>
  api.put(`/shipments/${id}/status`, { status }).then(unwrap);

// Add tracking event
export const addTrackingEvent = (id, event) =>
  api.post(`/shipments/${id}/tracking`, event).then(unwrap);

// Create a new shipment
export const createShipment = (data) =>
  api.post("/shipments", data).then(unwrap);

// Update a shipment (full update)
export const updateShipment = (id, data) =>
  api.put(`/shipments/${id}`, data).then(unwrap);

// Delete shipment (if applicable)
export const deleteShipment = (id) =>
  api.delete(`/shipments/${id}`).then(unwrap);
