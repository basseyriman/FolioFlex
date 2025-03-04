import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const sectionSuggestions = {
  header: [
    "Add a professional headline",
    "Include a brief tagline",
    "Upload a professional photo",
  ],
  about: [
    "Add a professional summary",
    "Include career objectives",
    "Highlight key achievements",
  ],
  experience: [
    "Add work history",
    "Highlight key responsibilities",
    "Include notable achievements",
  ],
  projects: [
    "Add project details",
    "Include technologies used",
    "Highlight project outcomes",
  ],
  skills: [
    "List technical skills",
    "Include soft skills",
    "Add proficiency levels",
  ],
  contact: [
    "Add contact information",
    "Include social media links",
    "Add preferred contact method",
  ],
};

export default function Sidebar({
  onSuggestionClick,
  selectedSection,
  isGenerating,
}) {
  const suggestions = selectedSection
    ? {
        header: [
          "Make it more professional",
          "Add a catchy headline",
          "Optimize for impact",
        ],
        about: [
          "Make it more engaging",
          "Highlight key achievements",
          "Add personal touch",
        ],
        experience: [
          "Emphasize achievements",
          "Use action verbs",
          "Add metrics and results",
        ],
        projects: [
          "Highlight technical details",
          "Focus on impact",
          "Add key outcomes",
        ],
        skills: [
          "Group by category",
          "Add proficiency levels",
          "Focus on relevant skills",
        ],
        contact: [
          "Make it professional",
          "Add social links",
          "Optimize layout",
        ],
      }[selectedSection.type]
    : [];

  return (
    <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">AI Optimization</h2>
      {selectedSection ? (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Optimizing section: {selectedSection.title}
          </p>
          {selectedSection.content && (
            <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-md">
              <h3 className="font-medium mb-2">Current Content:</h3>
              <p className="text-sm text-gray-600">{selectedSection.content}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-4">
          Select a section to get AI suggestions
        </p>
      )}
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`w-full bg-white bg-opacity-50 p-4 rounded-md shadow-md cursor-pointer 
              hover:bg-opacity-70 transition-all duration-200 text-left
              ${
                !selectedSection || isGenerating
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            onClick={() =>
              !isGenerating && selectedSection && onSuggestionClick(suggestion)
            }
            disabled={isGenerating || !selectedSection}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Optimizing...</span>
              </div>
            ) : (
              suggestion
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
