import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/">
      <motion.div
        className="flex items-center gap-2 cursor-pointer"
        whileHover={{ scale: 1.05 }}
      >
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 bg-blue-500 rounded-lg transform rotate-45" />
          <div className="absolute inset-0 bg-purple-500 rounded-lg transform -rotate-45 opacity-50" />
          <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
            F
          </span>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          FolioFlex
        </span>
      </motion.div>
    </Link>
  );
}
