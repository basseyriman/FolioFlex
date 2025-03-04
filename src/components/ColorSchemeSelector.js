import { motion } from "framer-motion";

const colorSchemes = ["blue", "green", "purple", "pink"];

export default function ColorSchemeSelector({ colorScheme, setColorScheme }) {
  return (
    <div className="fixed top-4 right-4 flex space-x-2">
      {colorSchemes.map((color) => (
        <motion.button
          key={color}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setColorScheme(color)}
          className={`w-8 h-8 rounded-full ${
            colorScheme === color ? "ring-2 ring-offset-2 ring-gray-800" : ""
          }`}
          style={{ backgroundColor: `var(--color-${color}-500)` }}
        />
      ))}
    </div>
  );
}
