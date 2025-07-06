import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { usePageContentStore } from "../store/usePageContentStore";

const DynamicPage = () => {
  const { pagePath } = useParams();
  const navigate = useNavigate();
  const [pageExists, setPageExists] = useState(true);
  const {
    content,
    loading,
    error,
    fetchPageContent,
    clearContent,
    checkPageExists,
  } = usePageContentStore();

  // Construct breadcrumbs with dynamic page name
  const breadcrumbs = [
    { label: "Home", link: ROUTES.HOME },
    {
      label: pagePath ? pagePath.replace(/-/g, " ") : "",
      link: `/${pagePath}`,
    },
  ];

  useEffect(() => {
    const loadPage = async () => {
      if (pagePath) {
        try {
          // Check if page exists first
          const exists = await checkPageExists(pagePath);

          if (!exists) {
            setPageExists(false);
            return;
          }

          fetchPageContent(pagePath);
        } catch (err) {
          console.error("Error loading page:", err);
          setPageExists(false);
        }
      }
    };

    loadPage();

    return () => {
      clearContent();
    };
  }, [pagePath]); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect to home if page not found
  useEffect(() => {
    if (error || !pageExists) {
      navigate(ROUTES.HOME);
    }
  }, [error, pageExists, navigate]);

  // Convert page path to title format (e.g., "my-page" to "My Page")
  const formatPageTitle = (path) => {
    if (!path) return "";
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const pageTitle = formatPageTitle(pagePath);

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-500">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    to={crumb.link}
                    className="text-gray-500 hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-10 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              {pageTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : content ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500">Content not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DynamicPage;
