import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function CVUploader({ onCVParsed }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const parseCV = async (text) => {
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
                content: `You are a CV parser. Extract the following information in JSON format:
                - name (full name)
                - title (professional title/role)
                - email
                - phone
                - linkedin (URL if present)
                - github (URL if present)
                - website (URL if present)
                - summary (brief professional summary)
                - skills (array of skills)
                - experience (array of objects with: title, company, startDate, endDate, description)
                - education (array of objects with: degree, institution, year, details)
                Return only the JSON object, no additional text.`,
              },
              {
                role: "user",
                content: `Parse this CV and extract the details: ${text}`,
              },
            ],
            temperature: 0.3,
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const parsedCV = JSON.parse(data.choices[0].message.content);
        onCVParsed(parsedCV);
      }
    } catch (error) {
      console.error("Error parsing CV:", error);
      throw new Error("Failed to parse CV");
    }
  };

  const handleFile = async (file) => {
    setIsLoading(true);
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
        throw new Error("Unsupported file format");
      }
      await parseCV(text);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFile(file);
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
        onDrop={handleDrop}
      >
        {isLoading ? (
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
              onChange={handleFileInput}
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
    </div>
  );
}
