import { motion } from "framer-motion";

const templates = [
  {
    id: "minimal",
    name: "Minimal",
    image: "/templates/minimal.jpg",
    description: "Clean and simple design focusing on content",
  },
  {
    id: "modern",
    name: "Modern",
    image: "/templates/modern.jpg",
    description: "Contemporary design with bold elements",
  },
  {
    id: "creative",
    name: "Creative",
    image: "/templates/creative.jpg",
    description: "Unique layout for creative professionals",
  },
  // Add more templates
];

export default function Templates() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Choose Your Template</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={template.image}
              alt={template.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold">{template.name}</h3>
              <p className="text-gray-600 mt-2">{template.description}</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Use Template
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
