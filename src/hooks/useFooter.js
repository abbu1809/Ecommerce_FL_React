import { useState, useEffect } from "react";
import { adminApi } from "../services/api";

const useFooter = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/admin/footer/");
      if (response.status === 200) {
        setFooterData(response.data.footer_config);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching footer data:", err);
      setError("Failed to load footer data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  return {
    footerData,
    loading,
    error,
    refetch: fetchFooterData,
  };
};

export default useFooter;
