import { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { Info, Wand2, Sparkles, Loader2, X, Upload } from "lucide-react";
import { portfolioSections } from "../data/portfolioSections";
import ImageUploader from "./ImageUploader";
import MediaUploader from "./MediaUploader";

export default function Workspace({
  sections = portfolioSections,
  onSectionClick,
  selectedSection,
  setSections,
  onAIRefine,
  isGeneratingAI: parentIsGeneratingAI,
  setSelectedSection,
}) {
  const [localSections, setLocalSections] = useState(sections);
  const [generatingSection, setGeneratingSection] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  useEffect(() => {
    if (selectedSection) {
      setEditingContent(selectedSection.content || "");
    }
  }, [selectedSection]);

  const handleContentChange = (sectionId, field, value) => {
    const section = localSections.find((s) => s.id === sectionId);
    if (!section) return;

    let content;
    try {
      // Parse existing content if it's a string
      content =
        typeof section.content === "string" && section.content
          ? JSON.parse(section.content)
          : section.content || {};
    } catch (e) {
      content = section.content || {};
    }

    // Update the specific field
    const updatedContent = {
      ...content,
      [field]: value,
    };

    console.log(`Updating ${field} for section ${sectionId}:`, updatedContent);

    // Update local sections
    const updatedSections = localSections.map((s) =>
      s.id === sectionId ? { ...s, content: JSON.stringify(updatedContent) } : s
    );

    setLocalSections(updatedSections);

    // Sync with parent component
    if (setSections) {
      setSections(updatedSections);
    }
  };

  const handleHeaderChange = (sectionId, field, value) => {
    setLocalSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              content:
                typeof section.content === "string"
                  ? JSON.stringify({
                      ...JSON.parse(
                        section.content || '{"name":"","title":""}'
                      ),
                      [field]: value,
                    })
                  : JSON.stringify({
                      ...section.content,
                      [field]: value,
                    }),
            }
          : section
      )
    );
  };

  const handleImageUploaded = (sectionId, imageUrl) => {
    setLocalSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              images: [...(s.images || []), { url: imageUrl, description: "" }],
            }
          : s
      )
    );
  };

  const handleImageDescriptionChange = (sectionId, imageIndex, description) => {
    setLocalSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              images: s.images.map((img, idx) =>
                idx === imageIndex ? { ...img, description } : img
              ),
            }
          : s
      )
    );
  };

  const handleGenerateDescription = async (sectionId, imageIndex) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section || !section.images[imageIndex]) return;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional portfolio content writer. Generate concise, engaging descriptions for portfolio images.",
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Generate a professional description for this portfolio image.",
                  },
                  {
                    type: "image_url",
                    image_url: section.images[imageIndex].url,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        handleImageDescriptionChange(
          sectionId,
          imageIndex,
          data.choices[0].message.content
        );
      }
    } catch (error) {
      console.error("Error generating description:", error);
    }
  };

  const handleGenerateWithAI = async (section) => {
    if (generatingSection) return;
    setGeneratingSection(section.id);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: section.type,
          currentContent: section.content,
        }),
      });

      const data = await response.json();
      if (data.content) {
        const updatedSections = localSections.map((s) =>
          s.id === section.id ? { ...s, content: data.content } : s
        );
        setLocalSections(updatedSections);
        setSections(updatedSections);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setGeneratingSection(null);
    }
  };

  const handleMediaAdd = (file) => {
    console.log("handleMediaAdd called with file:", file);
    if (!selectedSection || selectedSection.type !== "gallery") {
      console.error("No gallery section selected for media upload");
      return;
    }

    handleGalleryImageUpload(file);
  };

  const handleGalleryImageUpload = (file) => {
    console.log("handleGalleryImageUpload called with file:", file);
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setIsGeneratingAI(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        console.log("File read successfully");
        // Parse current gallery content
        let galleryContent = [];
        try {
          if (selectedSection && selectedSection.content) {
            galleryContent = JSON.parse(selectedSection.content);
            if (!Array.isArray(galleryContent)) galleryContent = [];
          }
        } catch (error) {
          console.error("Error parsing gallery content:", error);
          galleryContent = [];
        }

        console.log("Current gallery content:", galleryContent);

        // Create new media item
        const newMediaItem = {
          id: `gallery-${Date.now()}`,
          src: e.target.result,
          alt: `Project ${galleryContent.length + 1}`,
          description: "",
        };

        console.log("New media item:", newMediaItem);

        // Add to gallery content
        const updatedContent = [...galleryContent, newMediaItem];

        console.log("Updated gallery content:", updatedContent);

        // Update sections
        const updatedSections = localSections.map((section) =>
          section.id === selectedSection.id
            ? { ...section, content: JSON.stringify(updatedContent) }
            : section
        );

        console.log("Updated sections:", updatedSections);

        // Update local and parent state
        setLocalSections(updatedSections);
        if (setSections) {
          setSections(updatedSections);
        }

        // Update selected section if setSelectedSection is available
        if (setSelectedSection) {
          const updatedSelectedSection = updatedSections.find(
            (s) => s.id === selectedSection.id
          );
          setSelectedSection(updatedSelectedSection);
        }

        console.log("Added new gallery image:", newMediaItem.id);
      } catch (error) {
        console.error("Error adding gallery image:", error);
        alert("Failed to add image to gallery: " + error.message);
      } finally {
        setIsGeneratingAI(false);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Failed to read image file");
      setIsGeneratingAI(false);
    };

    reader.readAsDataURL(file);
  };

  const handleGalleryImageDelete = (imageIndex) => {
    if (!selectedSection || selectedSection.type !== "gallery") {
      console.error("No gallery section selected for image deletion");
      return;
    }

    try {
      // Parse current gallery content
      let galleryContent = [];
      try {
        galleryContent = JSON.parse(selectedSection.content || "[]");
        if (!Array.isArray(galleryContent)) galleryContent = [];
      } catch (error) {
        console.error("Error parsing gallery content:", error);
        galleryContent = [];
      }

      // Remove the image at the specified index
      const updatedContent = galleryContent.filter(
        (_, index) => index !== imageIndex
      );

      // Update sections
      const updatedSections = localSections.map((section) =>
        section.id === selectedSection.id
          ? { ...section, content: JSON.stringify(updatedContent) }
          : section
      );

      // Update local and parent state
      setLocalSections(updatedSections);
      if (setSections) {
        setSections(updatedSections);
      }

      // Update selected section if setSelectedSection is available
      if (setSelectedSection) {
        const updatedSelectedSection = updatedSections.find(
          (s) => s.id === selectedSection.id
        );
        setSelectedSection(updatedSelectedSection);
      }

      console.log("Deleted gallery image at index:", imageIndex);
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      alert("Failed to delete image from gallery: " + error.message);
    }
  };

  const handleGalleryDescriptionChange = (imageIndex, description) => {
    if (!selectedSection || selectedSection.type !== "gallery") {
      console.error("No gallery section selected for description update");
      return;
    }

    try {
      // Parse current gallery content
      let galleryContent = [];
      try {
        galleryContent = JSON.parse(selectedSection.content || "[]");
        if (!Array.isArray(galleryContent)) galleryContent = [];
      } catch (error) {
        console.error("Error parsing gallery content:", error);
        galleryContent = [];
      }

      // Update the description at the specified index
      if (galleryContent[imageIndex]) {
        galleryContent[imageIndex].description = description;

        // Update sections
        const updatedSections = localSections.map((section) =>
          section.id === selectedSection.id
            ? { ...section, content: JSON.stringify(galleryContent) }
            : section
        );

        // Update local and parent state
        setLocalSections(updatedSections);
        if (setSections) {
          setSections(updatedSections);
        }

        // Update selected section if setSelectedSection is available
        if (setSelectedSection) {
          const updatedSelectedSection = updatedSections.find(
            (s) => s.id === selectedSection.id
          );
          setSelectedSection(updatedSelectedSection);
        }

        console.log("Updated gallery image description at index:", imageIndex);
      }
    } catch (error) {
      console.error("Error updating gallery description:", error);
      alert("Failed to update description: " + error.message);
    }
  };

  const handleAIGenerate = async () => {
    if (!selectedSection) return;

    try {
      const prompt = `Generate professional content for the ${selectedSection.type} section of a portfolio.`;
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.content) {
        handleContentChange(selectedSection.id, "content", data.content);
        setEditingContent(data.content);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  const handleFileUpload = (e, sectionId, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const section = localSections.find((s) => s.id === sectionId);
      if (!section) return;

      let content;
      try {
        // Parse existing content if it's a string
        content =
          typeof section.content === "string" && section.content
            ? JSON.parse(section.content)
            : section.content || {};
      } catch (e) {
        content = section.content || {};
      }

      // Update the specific field with the image data URL
      const updatedContent = {
        ...content,
        [fieldName]: event.target.result,
      };

      console.log(
        `Updating ${fieldName} for section ${sectionId}:`,
        updatedContent
      );

      // Update local sections
      const updatedSections = localSections.map((s) =>
        s.id === sectionId
          ? { ...s, content: JSON.stringify(updatedContent) }
          : s
      );

      setLocalSections(updatedSections);

      // Sync with parent component
      if (setSections) {
        setSections(updatedSections);
      }
    };

    reader.readAsDataURL(file);
  };

  // Function to render the header section editor
  const renderHeaderSection = (section) => {
    let content;
    try {
      content =
        typeof section.content === "string" && section.content
          ? JSON.parse(section.content)
          : section.content || {};
    } catch (e) {
      content = {};
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={content.name || ""}
            onChange={(e) =>
              handleContentChange(section.id, "name", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Title
          </label>
          <input
            type="text"
            value={content.title || ""}
            onChange={(e) =>
              handleContentChange(section.id, "title", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Your professional title"
          />
        </div>

        <button
          onClick={() => onAIRefine(section.id, "title")}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
        >
          <Sparkles size={16} />
          Refine Title with AI
        </button>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {content.profileImage ? (
              <div className="relative w-40 h-40 mx-auto">
                <img
                  src={content.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <button
                  onClick={() =>
                    handleContentChange(section.id, "profileImage", "")
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id={`file-upload-${section.id}-profile`}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(e, section.id, "profileImage")
                  }
                />
                <label
                  htmlFor={`file-upload-${section.id}-profile`}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-blue-500">Click to upload</span>
                    <span className="text-gray-500 text-sm mt-1">
                      or drag and drop
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 800×800 • Max size: 2MB
                    </p>
                  </div>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Banner Image Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {content.bannerImage ? (
              <div className="relative w-full h-40 mx-auto">
                <img
                  src={content.bannerImage}
                  alt="Banner"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() =>
                    handleContentChange(section.id, "bannerImage", "")
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id={`file-upload-${section.id}-banner`}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(e, section.id, "bannerImage")
                  }
                />
                <label
                  htmlFor={`file-upload-${section.id}-banner`}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-blue-500">
                      Click to upload banner
                    </span>
                    <span className="text-gray-500 text-sm mt-1">
                      or drag and drop
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 1200×400 • Max size: 5MB
                    </p>
                  </div>
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Function to render the gallery section editor
  const renderGallerySection = () => {
    if (!selectedSection || selectedSection.type !== "gallery") return null;

    let galleryItems = [];
    try {
      galleryItems = JSON.parse(selectedSection.content || "[]");
      if (!Array.isArray(galleryItems)) galleryItems = [];
    } catch (error) {
      console.error("Error parsing gallery content:", error);
      galleryItems = [];
    }

    console.log("Rendering gallery with items:", galleryItems);

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Gallery Images</h3>

        {/* Upload area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => {
            console.log("Upload area clicked");
            document.getElementById("gallery-upload").click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("File dropped");
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
              handleMediaAdd(files[0]);
            }
          }}
        >
          <input
            id="gallery-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              console.log("File input changed");
              if (e.target.files && e.target.files.length > 0) {
                handleMediaAdd(e.target.files[0]);
              }
            }}
          />
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-500">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>

        {/* Loading indicator */}
        {isGeneratingAI && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-blue-500">Uploading image...</span>
          </div>
        )}

        {/* Gallery grid */}
        {galleryItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {galleryItems.map((item, index) => (
              <div
                key={item.id || index}
                className="border rounded-lg overflow-hidden bg-white shadow-sm"
              >
                {/* Image container with delete button */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={item.src}
                    alt={item.alt || "Gallery image"}
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={() => handleGalleryImageDelete(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Description area */}
                <div className="p-4">
                  <textarea
                    className="w-full p-2 border rounded-md text-sm"
                    placeholder="Add a description for this image"
                    value={item.description || ""}
                    onChange={(e) =>
                      handleGalleryDescriptionChange(index, e.target.value)
                    }
                    rows={3}
                  />
                  <button
                    className="mt-2 text-sm text-blue-500 hover:text-blue-700 flex items-center"
                    onClick={() =>
                      onAIRefine(selectedSection.id, `gallery-${index}`)
                    }
                    disabled={isGeneratingAI}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Generate AI Description
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderEditor = () => {
    if (!selectedSection) return null;

    switch (selectedSection.type) {
      case "header":
        return renderHeaderSection(selectedSection);
      case "gallery":
        return renderGallerySection();
      default:
        return (
          <div className="space-y-4">
            <textarea
              value={editingContent}
              onChange={(e) => {
                setEditingContent(e.target.value);
                const updatedSections = localSections.map((s) =>
                  s.id === selectedSection.id
                    ? { ...s, content: e.target.value }
                    : s
                );
                setLocalSections(updatedSections);
                setSections(updatedSections);
              }}
              className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter your ${selectedSection.type} content here...`}
            />
            <button
              onClick={() => onAIRefine(selectedSection.id)}
              disabled={parentIsGeneratingAI}
              className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg ${
                parentIsGeneratingAI
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
            >
              <Wand2 className="w-5 h-5" />
              {parentIsGeneratingAI ? "Generating..." : "Refine with AI"}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg min-h-[600px]">
      <h2 className="text-2xl font-bold mb-4">Portfolio Sections</h2>
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Customize your portfolio by editing each section below. Drag sections
          to reorder them.
        </p>
      </div>

      <Droppable droppableId="workspace">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-6 p-4 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50" : ""
            }`}
          >
            {localSections.map((section, index) => (
              <Draggable
                key={section.id}
                draggableId={section.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onSectionClick(section)}
                    className={`bg-white bg-opacity-50 p-6 rounded-md shadow-md cursor-pointer
                      ${snapshot.isDragging ? "shadow-lg" : ""} 
                      ${
                        selectedSection?.id === section.id
                          ? "ring-2 ring-blue-500"
                          : "hover:ring-2 hover:ring-blue-200"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{section.title}</span>
                          {section.required && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {section.description ||
                            `Your ${section.title} section`}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Info
                          size={18}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        />
                        <span className="text-gray-400 text-sm">
                          Drag to reorder
                        </span>
                      </div>
                    </div>

                    {selectedSection?.id === section.id && renderEditor()}
                  </motion.div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
