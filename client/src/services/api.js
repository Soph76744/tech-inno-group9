/*
// Base API URL
const BASE_URL = "/api/tools";

// Helper to handle responses safely
async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error?.message || "API request failed");
  }
  return res.json();
}

// Get all tools
export async function getTools(status = null) {
  const url = status ? `${BASE_URL}?status=${status}` : BASE_URL;

  const res = await fetch(url);
  return handleResponse(res);
}

// Get single tool by ID
export async function getTool(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(res);
}

// Create new tool
export async function createTool(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Failed to add tool");
  }

  return handleResponse(res);
}

// Update tool status
export async function updateTool(id, status) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  return handleResponse(res);
}
*/

import axios from "axios";

const API = axios.create({
  baseURL: "/api"
});

// Tools
export const getTools = (status) =>
  API.get("/tools", { params: status ? { status } : {} });

export const createTool = (data) =>
  API.post("/tools", data);

export const updateTool = (id, status) =>
  API.patch(`/tools/${id}`, { status });

// Faults
export const getFaults = () =>
  API.get("/faults");

export const detectFault = () =>
  API.get("/faults/detect");