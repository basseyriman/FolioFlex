import { motion } from "framer-motion";
import {
  Share2,
  Download,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  FileDown,
} from "lucide-react";
import { useState } from "react";
import html2pdf from "html2pdf.js";

export default function Preview({ sections, colorScheme }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const getHeaderContent = (content) => {
    try {
      const parsed = JSON.parse(content);
      return {
        name: parsed.name,
        title: parsed.title,
      };
    } catch (e) {
      return { name: "", title: "" };
    }
  };

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
    // Generate static HTML
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

    // Create download link
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

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="bg-white p-3 rounded-full shadow-lg"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </motion.button>
          {showShareOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl p-2"
            >
              <button
                onClick={() => handleShare("email")}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </button>
            </motion.div>
          )}
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="bg-white p-3 rounded-full shadow-lg"
          >
            <Download className="w-5 h-5 text-gray-700" />
          </motion.button>
          {showExportOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl p-2"
            >
              <button
                onClick={exportAsPDF}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
              >
                <FileDown className="w-4 h-4" />
                <span>Export as PDF</span>
              </button>
              <button
                onClick={exportAsWebsite}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
              >
                <Download className="w-4 h-4" />
                <span>Export as Website</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div
        id="portfolio-preview"
        className={`min-h-screen bg-gradient-to-br from-${colorScheme}-50 to-${colorScheme}-100`}
      >
        {sections.map((section) => (
          <div key={section.id} className="max-w-4xl mx-auto p-8">
            {section.type === "header" && (
              <div className="text-center mb-16">
                {section.imageUrl && (
                  <img
                    src={section.imageUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <h1 className="text-4xl font-bold mb-2">
                  {getHeaderContent(section.content).name}
                </h1>
                <h2 className="text-2xl text-gray-600">
                  {getHeaderContent(section.content).title}
                </h2>
              </div>
            )}

            {section.type === "about" && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-4">About Me</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            )}

            {section.type === "experience" && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-4">Experience</h2>
                <div className="space-y-6 text-gray-700 whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            )}

            {section.type === "skills" && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-4">Skills</h2>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            )}

            {section.type === "contact" && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-4">Contact</h2>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
