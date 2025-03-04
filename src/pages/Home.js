import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI-Powered Content Generation",
    description:
      "Let AI help you create compelling content for your portfolio.",
    icon: "✨",
  },
  {
    title: "Drag & Drop Image Upload",
    description: "Easily add and arrange images in your portfolio.",
    icon: "🖼️",
  },
  {
    title: "Customizable Templates",
    description: "Choose from a variety of professional templates.",
    icon: "🎨",
  },
  {
    title: "Easy Content Management",
    description: "Update your portfolio with ease.",
    icon: "📝",
  },
  {
    title: "Responsive Design",
    description: "Your portfolio looks great on all devices.",
    icon: "📱",
  },
  {
    title: "SEO Optimization",
    description: "Get found by potential clients and employers.",
    icon: "🔍",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="mt-8 text-5xl font-bold text-gray-900">
            Create Your Professional Portfolio
            <br />
            <span className="text-blue-600">in Minutes</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            AI-powered portfolio builder for showcasing your work beautifully
          </p>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-full font-medium flex items-center gap-2 mx-auto hover:bg-blue-700 transition-colors"
            >
              Get Started
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900">Features</h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to create a stunning portfolio
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Join thousands of professionals showcasing their work with FolioFlex
          </p>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-medium inline-flex items-center gap-2 hover:bg-blue-50 transition-colors"
            >
              Start Building Now
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
