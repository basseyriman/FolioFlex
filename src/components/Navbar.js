import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

const navItems = [
  { name: "Create Portfolio", path: "/create" },
  { name: "Templates", path: "/templates" },
  { name: "AI Assistant", path: "/ai-assistant" },
  { name: "Preview", path: "/preview" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  {item.name}
                </motion.button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
