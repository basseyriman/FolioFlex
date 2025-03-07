import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function CVUploader({ onCVParsed }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }

    return text;
  };

  const extractTextFromDOCX = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const parseCV = async (file) => {
    setIsUploading(true);
    setError(null);

    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        text = await extractTextFromDOCX(file);
      } else {
        throw new Error(
          "Unsupported file format. Please upload a PDF or DOCX file."
        );
      }

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer sk-proj-1nOaeXQKACWga2nbnIQrT3BlbkFJWA71WZLISgZUa3zTuFGh",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are a CV parser. Extract the following information from the CV in a structured JSON format:
              {
                "name": "Full Name",
                "title": "Professional Title",
                "summary": "Brief professional summary",
                "experience": [
                  {
                    "company": "Company Name",
                    "title": "Job Title",
                    "startDate": "Start Date",
                    "endDate": "End Date",
                    "description": "Job Description"
                  }
                ],
                "education": [
                  {
                    "institution": "Institution Name",
                    "degree": "Degree Name",
                    "year": "Graduation Year",
                    "details": "Additional Details"
                  }
                ],
                "skills": ["Skill 1", "Skill 2", "Skill 3"],
                "contact": {
                  "email": "Email",
                  "phone": "Phone Number",
                  "linkedin": "LinkedIn URL",
                  "github": "GitHub URL",
                  "website": "Personal Website"
                }
              }`,
              },
              {
                role: "user",
                content: `Parse this CV and extract the information in the specified JSON format:\n\n${text}`,
              },
            ],
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to parse CV. Please try again.");
      }

      const data = await response.json();
      const parsedCV = JSON.parse(data.choices[0].message.content);
      onCVParsed(parsedCV);
    } catch (err) {
      console.error("Error parsing CV:", err);
      setError(err.message || "Failed to parse CV. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-2">Upload Your CV</h2>
        <p className="text-gray-600">
          Upload your CV in PDF or DOCX format to automatically fill in your
          portfolio
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`border-2 border-dashed rounded-lg p-8 text-center 
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) parseCV(file);
        }}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-gray-600">Processing your CV...</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">
              Drag and drop your CV here, or click to browse
            </p>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) parseCV(file);
              }}
              className="hidden"
              id="cv-upload"
            />
            <label
              htmlFor="cv-upload"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
            >
              Browse Files
            </label>
          </>
        )}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-red-50 text-red-600 rounded-md"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
