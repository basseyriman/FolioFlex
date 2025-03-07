import { motion } from "framer-motion";
import {
  Mail,
  LucideGithub,
  Phone,
  Image as ImageIcon,
  MapPin,
  Download,
  Share2,
  FileDown,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";

export default function Preview({ sections, colorScheme, onUpdateSection }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [parsedSections, setParsedSections] = useState([]);

  // Parse all sections whenever they change
  useEffect(() => {
    if (!sections || !Array.isArray(sections)) return;

    const parsed = sections.map((section) => ({
      ...section,
      parsedContent: parseContent(section),
    }));

    setParsedSections(parsed);
  }, [sections]);

  // Parse content safely
  const parseContent = (section) => {
    if (!section || !section.content) return null;

    try {
      if (typeof section.content === "string") {
        try {
          return JSON.parse(section.content);
        } catch (e) {
          return section.content;
        }
      }
      return section.content;
    } catch (e) {
      console.error("Error parsing section content:", e);
      return null;
    }
  };

  // Debug function to log section content
  const logSectionContent = (section, label) => {
    console.log(`${label || "Section"} (${section.type}):`, {
      id: section.id,
      content: section.content,
      parsedContent: section.parsedContent,
    });
  };

  // Use effect to log sections for debugging
  useEffect(() => {
    if (parsedSections && parsedSections.length > 0) {
      const headerSection = parsedSections.find((s) => s.type === "header");
      if (headerSection) {
        logSectionContent(headerSection, "Header Section");
      }
    }
  }, [parsedSections]);

  // Export functions
  const exportAsPDF = () => {
    const element = document.getElementById("portfolio-preview");
    const opt = {
      margin: 1,
      filename: "my-portfolio.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
    setShowExportOptions(false);
  };

  const exportAsWebsite = () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Portfolio</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          ${document.getElementById("portfolio-preview").outerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-portfolio.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportOptions(false);
  };

  // Share functions
  const handleShare = (platform) => {
    const portfolioUrl = window.location.href;
    const title = "Check out my portfolio";
    const text = "I've just created my professional portfolio. Take a look!";

    switch (platform) {
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(`${text}\n${portfolioUrl}`)}`;
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            portfolioUrl
          )}`
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(portfolioUrl)}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            portfolioUrl
          )}`
        );
        break;
      default:
        break;
    }
    setShowShareOptions(false);
  };

  // Section renderers
  const renderHeader = () => {
    const headerSection = sections.find((s) => s.type === "header");
    if (!headerSection) return null;

    let content = {};
    try {
      content = JSON.parse(headerSection.content);
    } catch (e) {
      console.error("Error parsing header content:", e);
    }

    console.log("Rendering header with content:", content);

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {/* Banner Image */}
        {content.bannerImage && (
          <div className="w-full h-48 md:h-64 mb-6 overflow-hidden rounded-lg shadow-md">
            <img
              src={content.bannerImage}
              alt="Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Error loading banner image");
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QmFubmVyIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
              }}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          {content.profileImage ? (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
              <img
                src={content.profileImage}
                alt={content.name || "Profile"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Error loading profile image");
                  e.target.onerror = null;
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YxZjVmOSIgcng9IjEwMCIgcnk9IjEwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IiM5NGEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlByb2ZpbGU8L3RleHQ+PC9zdmc+";
                }}
              />
            </div>
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {content.name || "Your Name"}
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-600 mt-2">
              {content.title || "Your Professional Title"}
            </h2>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderBanner = (section) => {
    const content = section.parsedContent || {};

    return (
      <div className="relative w-full h-[300px] overflow-hidden">
        {content.bannerImage ? (
          <img
            src={content.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
            <p className="text-gray-500">Banner Image</p>
          </div>
        )}
      </div>
    );
  };

  const renderAbout = (section) => {
    const content = section.parsedContent || "";

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold mb-8">About Me</h2>
        <div className="prose prose-lg">
          {typeof content === "string" ? content : JSON.stringify(content)}
        </div>
      </motion.div>
    );
  };

  const renderExperience = (section) => {
    const content = section.parsedContent || "";

    return (
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-12">Experience</h2>
          <div className="prose prose-lg">
            {typeof content === "string" ? content : JSON.stringify(content)}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderSkills = (section) => {
    const content = section.parsedContent || "";

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold mb-8">Skills</h2>
        <div className="prose prose-lg">
          {typeof content === "string" ? content : JSON.stringify(content)}
        </div>
      </motion.div>
    );
  };

  const renderEducation = (section) => {
    const content = section.parsedContent || "";

    return (
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8">Education</h2>
          <div className="prose prose-lg">
            {typeof content === "string" ? content : JSON.stringify(content)}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderGallery = (section) => {
    let content = section.parsedContent;
    // Make sure we're handling the gallery content correctly
    const images = Array.isArray(content) ? content : [];

    console.log("Gallery content:", content);

    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Project Gallery
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Showcase of my notable projects and work
          </p>

          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex flex-col space-y-4 bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="w-full h-64 overflow-hidden">
                    {item && item.src ? (
                      <img
                        src={item.src}
                        alt={item.alt || `Project ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="text-gray-400" size={48} />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="px-4 py-3 text-sm text-gray-700">
                    <p className="font-medium text-gray-900 mb-1">
                      {item.alt || `Project ${index + 1}`}
                    </p>
                    <p>{item.description || "No description available"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              No projects added yet. Add projects in the editing workspace.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContact = (section) => {
    const content = section.parsedContent || {};

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Contact</h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {content.email && (
            <a
              href={`mailto:${content.email}`}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Mail size={20} />
              Email Me
            </a>
          )}
          {content.github && (
            <a
              href={content.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <LucideGithub size={20} />
              GitHub
            </a>
          )}
          {content.phone && (
            <a
              href={`tel:${content.phone}`}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Phone size={20} />
              Call Me
            </a>
          )}
          {content.location && (
            <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg">
              <MapPin size={20} />
              {content.location}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Main section renderer
  const renderSection = (section) => {
    if (!section) return null;

    switch (section.type) {
      case "header":
        return renderHeader();
      case "banner":
        return renderBanner(section);
      case "about":
        return renderAbout(section);
      case "experience":
        return renderExperience(section);
      case "skills":
        return renderSkills(section);
      case "education":
        return renderEducation(section);
      case "gallery":
        return renderGallery(section);
      case "contact":
        return renderContact(section);
      default:
        return (
          <div className="py-8 px-4 text-center text-gray-500">
            Unknown section type: {section.type}
          </div>
        );
    }
  };

  // Export and share buttons
  const renderControls = () => {
    return (
      <div className="fixed bottom-4 right-4 flex space-x-2 z-50">
        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            <Download size={20} />
          </button>
          {showExportOptions && (
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl p-2 w-48">
              <button
                onClick={exportAsPDF}
                className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
              >
                <FileDown size={16} />
                Export as PDF
              </button>
              <button
                onClick={exportAsWebsite}
                className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
              >
                <Globe size={16} />
                Export as Website
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
          >
            <Share2 size={20} />
          </button>
          {showShareOptions && (
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl p-2 w-48">
              <button
                onClick={() => handleShare("email")}
                className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
              >
                <Mail size={16} />
                Email
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
              >
                LinkedIn
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
              >
                Facebook
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="preview-container overflow-y-auto max-h-[calc(100vh-100px)] bg-white rounded-lg shadow-lg"
        id="portfolio-preview"
      >
        {parsedSections.length > 0 ? (
          parsedSections.map((section) => (
            <section key={section.id} id={section.id}>
              {renderSection(section)}
            </section>
          ))
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-200px)] text-gray-500">
            <div className="text-center p-8">
              <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No content yet</h3>
              <p>Start adding sections to your portfolio in the editor.</p>
            </div>
          </div>
        )}
      </motion.div>
      {renderControls()}
    </div>
  );
}
