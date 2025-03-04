import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function FloatingActionButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg"
    >
      <Plus size={24} />
    </motion.button>
  );
}
