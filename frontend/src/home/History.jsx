import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const History = () => {
  const [display, setDisplay] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/home/user", {
          credentials: "include",
        });
        const data = await response.json();
        setDisplay(data.data || []);
      } catch (error) {
        console.error("Failed to fetch user history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-4 text-white font-mono">
      <h1 className="text-3xl text-center font-bold mb-8">📜 Your History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {display.map((product, index) => (
          <motion.div
            key={index}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={product.post}
              alt={product.title || "Post"}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-white text-center">
                {product.title || "Untitled"}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/profile" className="inline-block bg-white text-pink-600 px-6 py-2 rounded-full shadow hover:bg-gray-200 transition-all">
          🔙 Back to Profile
        </Link>
      </div>
    </div>
  );
};

export default History;
