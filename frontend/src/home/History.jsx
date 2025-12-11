import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const History = () => {
  const [display, setDisplay] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("https://aas-i4rm.onrender.com/api/home/user", {
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

  // Function to detect media type
  const detectMediaType = (url) => {
    if (!url) return "image";
    
    // Check for YouTube URLs
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    if (youtubeRegex.test(url)) {
      return "youtube";
    }
    
    // Check for other video URLs
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const isVideo = videoExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    return isVideo ? "video" : "image";
  };

  // Function to extract YouTube ID
  const getYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Function to render media based on type
  const renderMedia = (url, title, className = "w-full h-48 object-cover") => {
    const mediaType = detectMediaType(url);

    switch (mediaType) {
      case "video":
        return (
          <video 
            className={className}
            controls
            muted
            preload="metadata"
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      
      case "youtube":
        const videoId = getYouTubeId(url);
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <iframe
            src={embedUrl}
            className={className}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        );
      
      default: // image
        return (
          <img
            src={url}
            alt={title}
            className={className}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-4 text-white font-mono">
      <h1 className="text-3xl text-center font-bold mb-8">📜 Your History</h1>
      
      {/* Empty state */}
      {display.length === 0 && (
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xl mb-4">No posts in your history yet</p>
          <Link to="/createpost">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="bg-white text-pink-600 px-6 py-2 rounded-full shadow hover:bg-gray-200 transition-all"
            >
              Create your first post
            </motion.button>
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {display.map((product, index) => (
          <motion.div
            key={product._id || index}
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {renderMedia(product.post, product.title || "Post")}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-white text-center">
                {product.title || "Untitled"}
              </h2>
              {/* Media type badge */}
              <div className="text-center mt-2">
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  {detectMediaType(product.post)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {display.length > 0 && (
        <div className="text-center mt-10">
          <Link to="/profile" className="inline-block bg-white text-pink-600 px-6 py-2 rounded-full shadow hover:bg-gray-200 transition-all">
            🔙 Back to Profile
          </Link>
        </div>
      )}

      
    </div>
  );
};

export default History;