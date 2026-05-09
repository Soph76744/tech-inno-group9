import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
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
  API.get("/faults/system/detect");

// Delete tool
export async function deleteTool(id) {
  const res = await fetch(`/api/tools/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  console.log("Delete response:", data);

  if (!res.ok) {
    throw new Error(data.error || "Delete failed");
  }

  return data;
}
