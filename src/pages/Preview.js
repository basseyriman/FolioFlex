import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";

export default function Preview({ portfolio }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Preview Your Portfolio</h1>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
          >
            <Download size={20} />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2"
          >
            <Share2 size={20} />
            Share
          </motion.button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Portfolio preview content */}
      </div>
    </div>
  );
}
