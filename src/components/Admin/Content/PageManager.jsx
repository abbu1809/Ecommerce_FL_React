import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "../../../utils/reactDomPolyfill"; // Import polyfill first
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import Button from "../../ui/Button";
import { useAdminPageContentStore } from "../../../store/Admin/useAdminPageContentStore";
import { FiPlus, FiTrash2 } from "react-icons/fi";

// Custom Quill wrapper to fix findDOMNode issues in React 18+
const QuillWrapper = forwardRef((props, ref) => {
  const editorRef = useRef(null);

  // Expose the editor methods via ref
  useImperativeHandle(ref, () => ({
    getEditor: () => editorRef.current?.getEditor(),
    focus: () => editorRef.current?.focus(),
    blur: () => editorRef.current?.blur(),
  }));

  return (
    <div className="quill-wrapper">
      <ReactQuill ref={editorRef} {...props} />
    </div>
  );
});

const PageManager = () => {
  const [selectedPage, setSelectedPage] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageDetails, setNewPageDetails] = useState({
    title: "",
    path: "",
  });
  const quillRef = useRef(null);

  const {
    pages,
    content,
    loading,
    savingPage,
    fetchPageContent,
    updatePageContent,
    addCustomPage,
    deleteCustomPage,
    setContent,
    clearContent,
    error,
  } = useAdminPageContentStore();

  useEffect(() => {
    if (selectedPage) {
      fetchPageContent(selectedPage.path).catch(() => {
        toast.error("Failed to load page content");
      });
    }

    return () => {
      clearContent();
    };
  }, [selectedPage, fetchPageContent, clearContent]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSelectPage = (page) => {
    setSelectedPage(page);
    setPreviewMode(false);
  };

  const handleSaveContent = async () => {
    if (!selectedPage) return;

    try {
      await updatePageContent(selectedPage.path, content);
      toast.success(`${selectedPage.title} content updated successfully`);
    } catch {
      toast.error("Failed to update page content");
    }
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  const handleAddPageSubmit = async (e) => {
    e.preventDefault();

    if (!newPageDetails.title || !newPageDetails.path) {
      toast.error("Title and URL path are required");
      return;
    }

    try {
      const pagePath = await addCustomPage(
        newPageDetails.title,
        newPageDetails.path
      );
      setNewPageDetails({ title: "", path: "" });
      setShowAddPageModal(false);
      toast.success("Custom page created successfully");

      // Select the new page
      const newPage = pages.find((p) => p.path === pagePath);
      if (newPage) {
        handleSelectPage(newPage);
      }
    } catch (error) {
      toast.error(error.message || "Failed to create custom page");
    }
  };

  const handleDeletePage = async (page, e) => {
    e.stopPropagation();

    if (!page.isCustom) {
      toast.error("Only custom pages can be deleted");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete the page "${page.title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteCustomPage(page.path);
      toast.success("Page deleted successfully");

      // If the deleted page was selected, clear selection
      if (selectedPage?.path === page.path) {
        setSelectedPage(null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete page");
    }
  };

  // Quill editor modules/formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "color",
    "background",
    "blockquote",
    "code-block",
  ];
  useEffect(() => {
    // Simple initialization effect for when the page changes
    if (selectedPage && !previewMode && quillRef.current) {
      // Force a delayed focus to ensure the editor is fully initialized
      const timeoutId = setTimeout(() => {
        // Update content if needed
        if (!content) {
          setContent("");
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedPage, previewMode, content, setContent]);

  return (
    <div className="page-manager">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with page list */}
        <div className="w-full md:w-1/4">
          {" "}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Website Pages</h3>
              <button
                onClick={() => setShowAddPageModal(true)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <FiPlus /> Add Page
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                System Pages
              </h4>
              <ul className="space-y-2">
                {pages
                  .filter((page) => !page.isCustom)
                  .map((page) => (
                    <li key={page.path}>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-md transition ${
                          selectedPage?.path === page.path
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleSelectPage(page)}
                      >
                        {page.title}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Custom pages section */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Custom Pages
              </h4>
              {pages.filter((page) => page.isCustom).length > 0 ? (
                <ul className="space-y-2">
                  {pages
                    .filter((page) => page.isCustom)
                    .map((page) => (
                      <li key={page.path} className="relative group">
                        <div className="flex items-center">
                          <button
                            className={`w-full text-left px-4 py-2 rounded-md transition ${
                              selectedPage?.path === page.path
                                ? "bg-blue-100 text-blue-700"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => handleSelectPage(page)}
                          >
                            {page.title}
                          </button>
                          <button
                            onClick={(e) => handleDeletePage(page, e)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic px-4 py-2">
                  No custom pages created
                </p>
              )}{" "}
            </div>
          </div>
        </div>

        {/* Content editor */}
        <div className="w-full md:w-3/4">
          {selectedPage ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              {" "}
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-xl">
                  {previewMode ? "Previewing: " : "Editing: "}
                  {selectedPage.title}
                </h3>
                <div className="flex gap-3">
                  <Button onClick={togglePreviewMode} type="secondary">
                    {previewMode ? "Back to Edit" : "Preview"}
                  </Button>
                  <Button
                    onClick={handleSaveContent}
                    disabled={loading || savingPage || previewMode}
                    type="primary"
                  >
                    {savingPage ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : previewMode ? (
                <div className="preview-mode border rounded-md p-4 prose max-w-none min-h-[400px] overflow-auto bg-gray-50">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content || "No content available to preview.",
                    }}
                  />
                </div>
              ) : (
                <div className="quill-editor-container">
                  <QuillWrapper
                    key={selectedPage?.path || "editor"}
                    ref={quillRef}
                    theme="snow"
                    value={content || ""}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    className="bg-white h-96 mb-20"
                    placeholder="Enter content here..."
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                Select a page from the sidebar to edit its content
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Page Modal */}
      {showAddPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-medium mb-4">Create New Page</h3>

            <form onSubmit={handleAddPageSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={newPageDetails.title}
                  onChange={(e) =>
                    setNewPageDetails({
                      ...newPageDetails,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Path
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-1">/</span>
                  <input
                    type="text"
                    value={newPageDetails.path}
                    onChange={(e) =>
                      setNewPageDetails({
                        ...newPageDetails,
                        path: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="my-custom-page"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use lowercase letters, numbers, and hyphens only. No spaces.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPageModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageManager;
