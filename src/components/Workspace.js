import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { Info, Wand2 } from "lucide-react";
import { portfolioSections } from "../data/portfolioSections";
import ImageUploader from "./ImageUploader";

export default function Workspace({
  sections = portfolioSections,
  onSectionClick,
  selectedSection,
  setSections,
  onAIRefine,
  isGenerating: parentIsGenerating,
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleContentChange = (sectionId, content) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, content } : section
      )
    );
  };

  const handleHeaderChange = (sectionId, field, value) => {
    setSections((prev) =>
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
    setSections((prev) =>
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
    setSections((prev) =>
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

    setIsGenerating(true);
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
    } finally {
      setIsGenerating(false);
    }
  };

  const renderHeaderInputs = (section) => {
    const content =
      typeof section.content === "string"
        ? JSON.parse(section.content || '{"name":"","title":""}')
        : section.content || { name: "", title: "" };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
            value={content.name || ""}
            onChange={(e) =>
              handleHeaderChange(section.id, "name", e.target.value)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Title
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Senior Software Engineer"
            value={content.title || ""}
            onChange={(e) =>
              handleHeaderChange(section.id, "title", e.target.value)
            }
          />
          <button
            onClick={() => onAIRefine(section)}
            disabled={parentIsGenerating || !content.title}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors mt-2
              ${
                parentIsGenerating || !content.title
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
          >
            <Wand2 size={16} />
            {parentIsGenerating && selectedSection?.id === section.id
              ? "Refining..."
              : "Refine Title with AI"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg min-h-[600px]">
      <h2 className="text-2xl font-bold mb-4">Portfolio Sections</h2>
      <Droppable droppableId="workspace">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-6 p-4 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50" : ""
            }`}
          >
            {sections.map((section, index) => (
              <Draggable
                key={section.id}
                draggableId={section.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`bg-white bg-opacity-50 p-6 rounded-md shadow-md 
                      ${snapshot.isDragging ? "shadow-lg" : ""} 
                      ${
                        selectedSection?.id === section.id
                          ? "ring-2 ring-blue-500"
                          : ""
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
                          {section.description}
                        </p>
                      </div>
                      <div
                        {...provided.dragHandleProps}
                        className="flex items-center gap-4"
                      >
                        <Info
                          size={18}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        />
                        <span className="text-gray-400 text-sm">
                          Drag to reorder
                        </span>
                      </div>
                    </div>

                    {section.type === "header" ? (
                      <>
                        {renderHeaderInputs(section)}
                        <div className="mt-4">
                          <ImageUploader
                            config={{
                              type: "profile",
                              required: true,
                              maxSize: 2,
                              recommendedDimensions: "800x800",
                              acceptedFormats: [".jpg", ".jpeg", ".png"],
                            }}
                            onImageUploaded={(imageUrl) => {
                              setSections((prev) =>
                                prev.map((s) =>
                                  s.id === section.id ? { ...s, imageUrl } : s
                                )
                              );
                            }}
                          />
                        </div>
                      </>
                    ) : section.type === "banner" ? (
                      <ImageUploader
                        config={{
                          type: "banner",
                          required: false,
                          maxSize: 4,
                          recommendedDimensions: "1920x600",
                          acceptedFormats: [".jpg", ".jpeg", ".png"],
                        }}
                        onImageUploaded={(imageUrl) => {
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id ? { ...s, imageUrl } : s
                            )
                          );
                        }}
                      />
                    ) : section.type === "gallery" ? (
                      <ImageUploader
                        config={{ type: "gallery" }}
                        currentImages={section.images || []}
                        onImageUploaded={(imageUrl) =>
                          handleImageUploaded(section.id, imageUrl)
                        }
                        onImageRemoved={(index) => {
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    images: s.images.filter(
                                      (_, i) => i !== index
                                    ),
                                  }
                                : s
                            )
                          );
                        }}
                        onDescriptionChange={(index, description) =>
                          handleImageDescriptionChange(
                            section.id,
                            index,
                            description
                          )
                        }
                        onGenerateDescription={(index) =>
                          handleGenerateDescription(section.id, index)
                        }
                      />
                    ) : (
                      <div className="space-y-4">
                        <textarea
                          className="w-full min-h-[120px] p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Enter your ${section.title.toLowerCase()} here...`}
                          value={section.content || ""}
                          onChange={(e) =>
                            handleContentChange(section.id, e.target.value)
                          }
                          onClick={() => onSectionClick(section)}
                        />
                        <button
                          onClick={() => onAIRefine(section)}
                          disabled={parentIsGenerating || !section.content}
                          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors
                            ${
                              parentIsGenerating || !section.content
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            }`}
                        >
                          <Wand2 size={16} />
                          {parentIsGenerating &&
                          selectedSection?.id === section.id
                            ? "Refining..."
                            : "Refine with AI"}
                        </button>
                      </div>
                    )}
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
