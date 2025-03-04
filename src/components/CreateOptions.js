import { motion } from "framer-motion";
import { FileText, Edit, ArrowRight } from "lucide-react";

export default function CreateOptions({ onOptionSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose How to Create Your Portfolio
          </h1>
          <p className="text-xl text-gray-600">
            Select the method that works best for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => onOptionSelect("manual")}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <Edit className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create Manually
              </h2>
              <p className="text-gray-600 mb-4">
                Build your portfolio step by step with our intuitive editor
              </p>
              <span className="text-blue-600 flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => onOptionSelect("cv")}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Import from CV
              </h2>
              <p className="text-gray-600 mb-4">
                Automatically generate your portfolio from your CV
              </p>
              <span className="text-green-600 flex items-center gap-2">
                Upload CV <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
