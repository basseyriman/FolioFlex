import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Wand2 } from "lucide-react";

export default function ImageUploader({
  config,
  currentImages = [],
  onImageUploaded,
  onImageRemoved,
  onDescriptionChange,
  onGenerateDescription,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return "No file selected";

    // Check file size (in MB)
    const fileSize = file.size / (1024 * 1024);
    if (fileSize > (config.maxSize || 5)) {
      return `File size must be less than ${config.maxSize || 5}MB`;
    }

    // Check file type
    const acceptedFormats = config.acceptedFormats || [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
    ];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      return `Only ${acceptedFormats.join(", ")} files are allowed`;
    }

    return null;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    await handleFiles(files);
  };

  const handleFileInput = async (e) => {
    const files = e.target.files;
    await handleFiles(files);
  };

  const handleFiles = async (files) => {
    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setUploading(true);
      setError(null);

      try {
        // Create a FileReader to get base64 for preview
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64 = e.target.result;

          // In a real app, you'd upload to a server here
          // For now, we'll use the base64 as the "uploaded" URL
          onImageUploaded(base64);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setError("Failed to upload image. Please try again.");
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={config.type === "gallery"}
          accept={config.acceptedFormats?.join(",") || "image/*"}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className="w-10 h-10 text-gray-400" />
          <div className="text-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Click to upload
            </button>
            <span className="text-gray-500"> or drag and drop</span>
          </div>
          {config.recommendedDimensions && (
            <p className="text-sm text-gray-500">
              Recommended: {config.recommendedDimensions}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Max size: {config.maxSize || 5}MB
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>

      {/* Image Preview Grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {currentImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={image.description || `Image ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={() => onImageRemoved(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
              {config.type === "gallery" && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={image.description || ""}
                    onChange={(e) => onDescriptionChange(index, e.target.value)}
                    placeholder="Add description..."
                    className="w-full p-2 text-sm border rounded"
                  />
                  <button
                    onClick={() => onGenerateDescription(index)}
                    className="mt-1 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Wand2 size={12} />
                    Generate description
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
