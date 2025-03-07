import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Layout, FileText, Check } from "lucide-react";

export default function Templates() {
  const templates = [
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean and simple design that puts your work first",
      features: ["Clean typography", "Minimalist layout", "Focus on content"],
      image: "/templates/minimal.jpg",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold and artistic design for creative professionals",
      features: [
        "Unique layouts",
        "Creative typography",
        "Attention-grabbing elements",
      ],
      image: "/templates/creative.jpg",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Polished and refined design for corporate environments",
      features: [
        "Business-focused layout",
        "Professional color scheme",
        "Structured sections",
      ],
      image: "/templates/professional.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose How to Create Your Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select a template or start from scratch to build your professional
            portfolio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-48 bg-gray-200">
                {template.image ? (
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layout className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <ul className="mb-6">
                  {template.features.map((feature, i) => (
                    <li key={i} className="flex items-center mb-1">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/create"
                  className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors"
                >
                  Use This Template
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-semibold mb-4">Start from Scratch</h3>
          <p className="text-gray-600 mb-6">
            Build your portfolio from the ground up with our easy-to-use editor
            and AI assistance.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Custom Portfolio <ArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
