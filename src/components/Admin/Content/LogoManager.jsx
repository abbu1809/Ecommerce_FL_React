import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import toast from "react-hot-toast";
import { useLogoStore } from "../../../store/Admin/useLogoStore";

const LogoManager = () => {
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { logo, loading, error, fetchLogo, uploadLogo, clearError } =
    useLogoStore();

  useEffect(() => {
    fetchLogo().catch(() => {
      toast.error("Failed to fetch current logo");
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!logoFile) {
      toast.error("Please select a logo file");
      return;
    }

    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
      await uploadLogo(formData);
      toast.success("Logo updated successfully");
      // Reset form
      setLogoFile(null);
      setPreview(null);
    } catch {
      // Error is handled by the store and shown via the error effect
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Shop Logo</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload your shop&apos;s logo. This will be displayed in the header and
          other places.
        </p>
      </div>

      {/* Current Logo */}
      {logo && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Current Logo
          </h3>
          <div className="w-32 h-32 rounded-lg border border-gray-200 overflow-hidden">
            <img
              src={logo}
              alt="Current logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Upload New Logo</h3>

        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Recommended: PNG or JPEG, max 2MB
            </p>
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Preview
              </h4>
              <div className="w-24 h-24 rounded-lg border border-gray-200 overflow-hidden">
                <img
                  src={preview}
                  alt="New logo preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            variant="primary"
            onClick={handleUpload}
            isLoading={loading}
            disabled={!logoFile || loading}
          >
            {loading ? "Uploading..." : "Upload New Logo"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoManager;
