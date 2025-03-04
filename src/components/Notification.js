import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function Notification({ message, type = "success", onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
          type === "success" ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <XCircle className="text-red-500" />
        )}
        <p className={type === "success" ? "text-green-700" : "text-red-700"}>
          {message}
        </p>
        <button
          onClick={onClose}
          className="ml-4 hover:bg-black/5 p-1 rounded-full"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
