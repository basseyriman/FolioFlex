import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Wand2 } from "lucide-react";

export default function MediaUploader({ onMediaAdd, onAIGenerate }) {
  const [dragActive, setDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef(null);

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
      if (!file.type.startsWith("image/")) continue;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target.result;
        onMediaAdd({
          url: imageUrl,
          caption: file.name,
          type: "image",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      await onAIGenerate();
    } catch (error) {
      console.error("Error generating AI content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
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
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <p className="text-lg font-medium">
            Drag and drop your images here, or{" "}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-500 hover:text-blue-600"
            >
              browse
            </button>
          </p>
          <p className="text-sm text-gray-500">
            Supports: JPG, PNG, GIF (max 5MB each)
          </p>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg ${
            isGenerating
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
        >
          <Wand2 className="w-5 h-5" />
          {isGenerating ? "Generating..." : "Generate with AI"}
        </button>
      </div>
    </div>
  );
}
