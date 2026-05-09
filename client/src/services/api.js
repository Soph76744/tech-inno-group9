import axios from "axios"; // used for ease with HTTP methods 

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Tools
// Fetches all tools
export const getTools = (status) =>
  API.get("/tools", { params: status ? { status } : {} });
// Creates a new tool object
export const createTool = (data) =>
  API.post("/tools", data);
// Updates tool's status
export const updateTool = (id, status) =>
  API.patch(`/tools/${id}`, { status });
// Deletes a tool through fetching ID
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

// Faults
// Gets all faults
export const getFaults = () =>
  API.get("/faults");
// Runs the fault detection system 
export const detectFault = () =>
  API.get("/faults/system/detect");

