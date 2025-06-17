import { useState, useEffect } from "react";
import api, { adminApi } from "../services/api";
import { usePageContentStore } from "../store/usePageContentStore";

const useFooter = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customPages, setCustomPages] = useState([]);
  const { pages, fetchAvailablePages } = usePageContentStore();

  const fetchFooterData = async () => {
    try {
      setLoading(true);

      // Fetch footer configuration
      const response = await adminApi.get("/admin/footer/");
      if (response.status === 200) {
        setFooterData(response.data.footer_config);
      }

      // Get custom pages from store or fetch them if needed
      if (pages && pages.length > 0) {
        setCustomPages(pages);
      } else {
        try {
          // First try to fetch from the page content store
          await fetchAvailablePages();

          // If not available, directly fetch from API
          if (!pages || pages.length === 0) {
            const pagesResponse = await adminApi.get("/admin/content/pages/");
            if (pagesResponse.status === 200) {
              setCustomPages(pagesResponse.data.pages || []);
            }
          }
        } catch (pageError) {
          console.error("Error fetching custom pages:", pageError);
        }
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

    // Set up interval to periodically check for new custom pages
    const intervalId = setInterval(() => {
      fetchAvailablePages();
    }, 300000); // Every 5 minutes

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update customPages when pages in store changes
  useEffect(() => {
    if (pages && pages.length > 0) {
      setCustomPages(pages);
    }
  }, [pages]);

  return {
    footerData,
    loading,
    error,
    refetch: fetchFooterData,
    customPages,
  };
};

export default useFooter;
