import { motion } from "framer-motion";

export default function ProgressIndicator({ progress }) {
  return (
    <div className="fixed bottom-4 left-4 right-4">
      <div className="bg-gray-200 rounded-full h-4 w-full">
        <motion.div
          className="bg-blue-500 h-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
