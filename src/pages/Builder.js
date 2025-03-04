import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import Workspace from "../components/Workspace";
import FloatingActionButton from "../components/FloatingActionButton";
import ProgressIndicator from "../components/ProgressIndicator";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import { portfolioSections } from "../data/portfolioSections";
import CVUploader from "../components/CVUploader";
import ImageUploader from "../components/ImageUploader";
import Notification from "../components/Notification";
import CreateOptions from "../components/CreateOptions";
import Preview from "../components/Preview";

export default function Builder() {
  const [progress, setProgress] = useState(0);
  const [colorScheme, setColorScheme] = useState("blue");
  const [sections, setSections] = useState(portfolioSections);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCVUploader, setShowCVUploader] = useState(true);
  const [notification, setNotification] = useState(null);
  const [creationMethod, setCreationMethod] = useState(null);
  const [showOptions, setShowOptions] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    // Calculate progress based on completed sections
    const requiredSections = sections.filter((section) => section.required);
    const completedRequired = requiredSections.filter(
      (section) => section.content
    ).length;
    const progress = (completedRequired / requiredSections.length) * 100;
    setProgress(progress);
  }, [sections]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const updatedSections = Array.from(sections);
    const [removed] = updatedSections.splice(sourceIndex, 1);
    updatedSections.splice(destinationIndex, 0, removed);

    setSections(updatedSections);
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const handleAISuggestion = async (suggestion) => {
    if (!selectedSection || isGenerating) return;

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
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional portfolio content writer. Generate concise, engaging content.",
              },
              {
                role: "user",
                content: `Generate professional content for the ${selectedSection.title} section of my portfolio. Context: ${suggestion}`,
              },
            ],
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();

      if (data.choices && data.choices[0]) {
        setSections((prev) =>
          prev.map((section) =>
            section.id === selectedSection.id
              ? { ...section, content: data.choices[0].message.content }
              : section
          )
        );
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCVParsed = (cvData) => {
    try {
      // Update sections with CV data
      setSections((prev) =>
        prev.map((section) => {
          switch (section.type) {
            case "header":
              return {
                ...section,
                content: formatHeader(cvData),
              };
            case "about":
              return {
                ...section,
                content: generateAboutMe(cvData),
              };
            case "experience":
              return {
                ...section,
                content: formatExperience(cvData.experience),
              };
            case "skills":
              return {
                ...section,
                content: formatSkills(cvData.skills),
              };
            case "education":
              return {
                ...section,
                content: formatEducation(cvData.education),
              };
            case "contact":
              return {
                ...section,
                content: formatContact(cvData),
              };
            default:
              return section;
          }
        })
      );
      setShowCVUploader(false);
      setNotification({
        type: "success",
        message:
          "CV parsed successfully! You can now edit and arrange sections.",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error parsing CV. Please try again.",
      });
    }
  };

  const handleOptionSelect = (method) => {
    setCreationMethod(method);
    setShowOptions(false);
    if (method === "cv") {
      setShowCVUploader(true);
    } else {
      setShowCVUploader(false);
      // Initialize empty sections for manual creation
      setSections(
        portfolioSections.map((section) => ({
          ...section,
          content: "",
        }))
      );
    }
  };

  const handleAIRefine = async (section) => {
    if (isGenerating || !section.content) return;

    setIsGenerating(true);
    setSelectedSection(section);

    try {
      const content =
        section.type === "header"
          ? JSON.parse(section.content)
          : section.content;

      const prompt =
        section.type === "header"
          ? `Refine this professional title to be more impactful and industry-standard: "${content.title}". Only return the refined title, no explanations.`
          : `Refine and enhance this ${section.title} content while keeping its main points: ${content}`;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  section.type === "header"
                    ? "You are a professional title optimizer. Return only the optimized title."
                    : "You are a professional portfolio content writer. Refine and enhance the given content while maintaining its core message.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();

      if (data.choices && data.choices[0]) {
        if (section.type === "header") {
          const currentContent = JSON.parse(section.content);
          setSections((prev) =>
            prev.map((s) =>
              s.id === section.id
                ? {
                    ...s,
                    content: JSON.stringify({
                      ...currentContent,
                      title: data.choices[0].message.content.trim(),
                    }),
                  }
                : s
            )
          );
        } else {
          setSections((prev) =>
            prev.map((s) =>
              s.id === section.id
                ? { ...s, content: data.choices[0].message.content }
                : s
            )
          );
        }

        setNotification({
          type: "success",
          message:
            section.type === "header"
              ? "Professional title refined successfully!"
              : "Content refined successfully!",
        });
      }
    } catch (error) {
      console.error("Error refining content:", error);
      setNotification({
        type: "error",
        message: "Error refining content. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-${colorScheme}-100 to-${colorScheme}-200 text-gray-800`}
    >
      {showOptions ? (
        <CreateOptions onOptionSelect={handleOptionSelect} />
      ) : showCVUploader ? (
        <div className="container mx-auto px-4 py-16">
          <CVUploader onCVParsed={handleCVParsed} />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-4 py-2 rounded-md transition-colors ${
                isPreviewMode
                  ? "bg-gray-200 text-gray-700"
                  : "bg-blue-500 text-white"
              }`}
            >
              {isPreviewMode ? "Edit Mode" : "Preview"}
            </button>
          </div>

          {isPreviewMode ? (
            <Preview sections={sections} colorScheme={colorScheme} />
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <Workspace
                  sections={sections}
                  onSectionClick={handleSectionClick}
                  selectedSection={selectedSection}
                  setSections={setSections}
                  onAIRefine={handleAIRefine}
                  isGenerating={isGenerating}
                />
              </motion.div>
            </DragDropContext>
          )}
          <FloatingActionButton onClick={() => setSelectedSection(null)} />
          <ProgressIndicator progress={progress} />
          {notification && (
            <Notification
              {...notification}
              onClose={() => setNotification(null)}
            />
          )}
        </div>
      )}
      <ColorSchemeSelector
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
      />
    </div>
  );
}

// Helper functions for formatting CV data
function formatHeader(cvData) {
  return JSON.stringify({
    name: cvData.name || "",
    title: cvData.title || "Professional Title",
  });
}

function generateAboutMe(cvData) {
  const skills = cvData.skills.slice(0, 3).join(", "); // Top 3 skills
  const experience = cvData.experience[0]; // Most recent experience

  return `Experienced professional with expertise in ${skills}. ${
    experience
      ? `Currently ${
          experience.endDate === "Present" ? "working" : "worked"
        } as ${experience.title} at ${experience.company}.`
      : ""
  } Dedicated to delivering high-quality results and driving innovation in ${
    cvData.skills[0] || "the field"
  }.`;
}

function formatExperience(experiences) {
  if (!experiences.length) return "";

  return experiences
    .map((exp) => {
      const duration = `${exp.startDate} - ${exp.endDate}`;
      const role = `${exp.title} at ${exp.company}`;
      const description = exp.description;

      return `${role}\n${duration}\n${description}`;
    })
    .join("\n\n");
}

function formatEducation(education) {
  if (!education.length) return "";

  return education
    .map((edu) => {
      const degree = `${edu.degree} from ${edu.institution}`;
      const year = edu.year ? `(${edu.year})` : "";
      const details = edu.details ? `\n${edu.details}` : "";

      return `${degree} ${year}${details}`;
    })
    .join("\n\n");
}

function formatSkills(skills) {
  if (!skills.length) return "";

  // Group skills by category if possible
  const technicalSkills = skills.filter((skill) =>
    /^(programming|software|technical|development|design)/i.test(skill)
  );

  const softSkills = skills.filter((skill) =>
    /^(communication|leadership|management|teamwork)/i.test(skill)
  );

  const otherSkills = skills.filter(
    (skill) => !technicalSkills.includes(skill) && !softSkills.includes(skill)
  );

  return [
    technicalSkills.length
      ? `Technical Skills:\n${technicalSkills.join("\n")}`
      : "",
    softSkills.length ? `Soft Skills:\n${softSkills.join("\n")}` : "",
    otherSkills.length ? `Other Skills:\n${otherSkills.join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function formatContact(cvData) {
  const contactItems = [
    cvData.email && `Email: ${cvData.email}`,
    cvData.phone && `Phone: ${cvData.phone}`,
    cvData.linkedin && `LinkedIn: ${cvData.linkedin}`,
    cvData.github && `GitHub: ${cvData.github}`,
    cvData.website && `Website: ${cvData.website}`,
  ].filter(Boolean);

  return contactItems.join("\n");
}
