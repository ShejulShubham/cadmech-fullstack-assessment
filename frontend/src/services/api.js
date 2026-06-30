const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiService = {
  // 1. Fetch Dashboard Stats
  getStats: async () => {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error("Failed to fetch dashboard statistics.");
    return res.json();
  },

  // 2. Fetch Equipment List (Supports optional search, type, and status filters)
  getEquipment: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);

    const res = await fetch(`${API_BASE}/equipment?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch equipment inventory.");
    return res.json();
  },

  // 3. Get Single Item
  getEquipmentById: async (id) => {
    const res = await fetch(`${API_BASE}/equipment/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch equipment with ID ${id}.`);
    return res.json();
  },

  // 4. Create Equipment
  createEquipment: async (data) => {
    const res = await fetch(`${API_BASE}/equipment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create equipment.");
    }
    return res.json();
  },

  // 5. Update Equipment
  updateEquipment: async (id, data) => {
    const res = await fetch(`${API_BASE}/equipment/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update equipment.");
    }
    return res.json();
  },

  // 6. Delete Equipment
  deleteEquipment: async (id) => {
    const res = await fetch(`${API_BASE}/equipment/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete equipment.");
    return res.json();
  },
};
