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

  // potentially remove if unneeded
  export async function deleteTool(id) {
    const res = await fetch(`http://localhost:3000/api/tools/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    console.log("Delete response:", data);
  
    if (!res.ok) {
      throw new Error(data.error || "Delete failed");
    }
  
    return data;
  }