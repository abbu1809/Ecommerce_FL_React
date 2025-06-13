import { adminApi } from "./api";
// Service for managing application settings
const settingsService = {
  // Get application settings including logo
  getSettings: async () => {
    try {
      const response = await adminApi.get("/admin/content/logo");
      return response.data;
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  },
};

export default settingsService;
