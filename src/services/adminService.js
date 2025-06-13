import { adminApi } from "./api";
// Upload logo
export const uploadLogo = async (formData) => {
  try {
    const response = await adminApi.post(
      "/admin/content/logo/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
