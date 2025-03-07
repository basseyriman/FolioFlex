import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Templates from "./pages/Templates";
import Builder from "./pages/Builder";
import Preview from "./pages/Preview";
import Navbar from "./components/Navbar";
import Workspace from "./components/Workspace";
import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";

export default function App() {
  const [sections, setSections] = useState([
    {
      id: "header",
      type: "header",
      title: "Header",
      required: true,
      content: JSON.stringify({
        name: "",
        title: "",
        profileImage: "",
        bannerImage: "",
      }),
      description: "Your name, title, profile photo and banner image",
    },
    {
      id: "about",
      type: "about",
      title: "About Me",
      required: true,
      content: "",
    },
    {
      id: "experience",
      type: "experience",
      title: "Experience",
      required: true,
      content: "",
    },
    {
      id: "skills",
      type: "skills",
      title: "Skills",
      required: true,
      content: "",
    },
    {
      id: "education",
      type: "education",
      title: "Education",
      required: true,
      content: "",
    },
    {
      id: "gallery",
      type: "gallery",
      title: "Project Gallery",
      required: false,
      content: "[]",
      description: "Showcase your projects with images and descriptions",
    },
    {
      id: "contact",
      type: "contact",
      title: "Contact",
      required: true,
      content: JSON.stringify({
        email: "",
        phone: "",
        location: "",
        github: "",
      }),
    },
  ]);

  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [colorScheme, setColorScheme] = useState("blue");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Debug sections data
  useEffect(() => {
    console.log("App sections updated:", sections);
    // Log the header section specifically
    const headerSection = sections.find((s) => s.type === "header");
    if (headerSection) {
      console.log("Header section:", headerSection);
      try {
        const content = JSON.parse(headerSection.content);
        console.log("Header content parsed:", content);
      } catch (e) {
        console.error("Error parsing header content:", e);
      }
    }

    // Log the gallery section specifically
    const gallerySection = sections.find((s) => s.type === "gallery");
    if (gallerySection) {
      console.log("Gallery section:", gallerySection);
      try {
        const content = JSON.parse(gallerySection.content);
        console.log("Gallery content parsed:", content);
      } catch (e) {
        console.error("Error parsing gallery content:", e);
      }
    }
  }, [sections]);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const handleAIRefine = async (sectionId, field) => {
    setIsGeneratingAI(true);
    console.log(`Refining section ${sectionId}, field: ${field}`);

    try {
      // Find the section
      const section = sections.find((s) => s.id === sectionId);
      if (!section) {
        console.error("Section not found:", sectionId);
        return;
      }

      // Simulate AI refinement with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Handle different section types and fields
      let updatedSections;

      if (section.type === "header") {
        // Parse content
        let content;
        try {
          content = JSON.parse(section.content);
        } catch (e) {
          console.error("Error parsing header content:", e);
          content = {};
        }

        if (field === "title") {
          // Update title field with AI-enhanced version
          const currentTitle = content.title || "";
          const aiTitle = currentTitle
            ? `Enhanced ${currentTitle}`
            : "AI-Enhanced Professional Title";

          const updatedContent = {
            ...content,
            title: aiTitle,
          };

          // Update sections
          updatedSections = sections.map((s) =>
            s.id === sectionId
              ? { ...s, content: JSON.stringify(updatedContent) }
              : s
          );

          console.log("Updated header title with AI:", aiTitle);
        }
      } else if (
        section.type === "gallery" &&
        field &&
        field.startsWith("gallery-")
      ) {
        // Handle gallery image description generation
        const imageIndex = parseInt(field.split("-")[1]);

        try {
          const content = JSON.parse(section.content || "[]");
          if (content[imageIndex]) {
            content[imageIndex].description =
              "This is an AI-generated description for your project image. It highlights the key features and technologies used in this impressive work.";

            updatedSections = sections.map((s) =>
              s.id === sectionId
                ? { ...s, content: JSON.stringify(content) }
                : s
            );

            console.log(
              "Updated gallery image description with AI:",
              imageIndex
            );
          }
        } catch (e) {
          console.error("Error updating gallery description:", e);
        }
      } else {
        // For other content types, generate appropriate content based on section type
        let aiContent;

        switch (section.type) {
          case "about":
            aiContent =
              "I am a passionate professional with expertise in my field. With years of experience, I have developed a strong skill set and a deep understanding of industry best practices. I am dedicated to delivering high-quality work and continuously improving my abilities.";
            break;
          case "experience":
            aiContent =
              "## Senior Position\nCompany Name | 2020 - Present\n- Led key initiatives that increased efficiency by 30%\n- Managed a team of 5 professionals\n- Implemented new strategies that boosted revenue\n\n## Junior Position\nPrevious Company | 2018 - 2020\n- Contributed to major projects\n- Developed skills in relevant technologies\n- Collaborated with cross-functional teams";
            break;
          case "skills":
            aiContent =
              "### Technical Skills\n- Programming: JavaScript, Python, React\n- Tools: Git, Docker, AWS\n- Methodologies: Agile, Scrum\n\n### Soft Skills\n- Communication\n- Problem Solving\n- Team Leadership\n- Project Management";
            break;
          case "education":
            aiContent =
              "### Master's Degree\nUniversity Name | 2016 - 2018\nMajor in Relevant Field\n\n### Bachelor's Degree\nUniversity Name | 2012 - 2016\nMajor in Relevant Field with Minor in Supporting Subject";
            break;
          default:
            aiContent =
              "This is AI-generated content for your portfolio. Replace this with your actual content that showcases your unique skills and experiences.";
        }

        updatedSections = sections.map((s) =>
          s.id === sectionId ? { ...s, content: aiContent } : s
        );

        console.log(`Updated ${section.type} content with AI`);
      }

      if (updatedSections) {
        setSections(updatedSections);

        // Update selected section if it's the one being edited
        if (selectedSection && selectedSection.id === sectionId) {
          const updatedSection = updatedSections.find(
            (s) => s.id === sectionId
          );
          setSelectedSection(updatedSection);
        }
      }
    } catch (error) {
      console.error("AI refinement error:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleUpdateSection = (sectionId, newContent) => {
    console.log(`Updating section ${sectionId} with:`, newContent);

    const updatedSections = sections.map((section) =>
      section.id === sectionId ? { ...section, content: newContent } : section
    );

    setSections(updatedSections);

    // Update selected section if it's the one being edited
    if (selectedSection && selectedSection.id === sectionId) {
      const updatedSection = updatedSections.find((s) => s.id === sectionId);
      setSelectedSection(updatedSection);
    }
  };

  // Handle drag end event
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  return (
    <Router>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/create" element={<Builder />} />
            <Route path="/preview" element={<Preview />} />
          </Routes>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Workspace
                  sections={sections}
                  setSections={setSections}
                  selectedSection={selectedSection}
                  onSectionClick={handleSectionClick}
                  onAIRefine={handleAIRefine}
                  isGeneratingAI={isGeneratingAI}
                  setSelectedSection={setSelectedSection}
                />
              </div>
              <div>
                <Preview
                  sections={sections}
                  colorScheme={colorScheme}
                  onUpdateSection={handleUpdateSection}
                />
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>
    </Router>
  );
}
