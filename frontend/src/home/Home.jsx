import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const [display, setDisplay] = useState([]);
  const [clickedBtn, setClickedBtn] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const navigate = useNavigate();

  const response = async () => {
    const res = await fetch("/api/home");
    const data = await res.json();
    setDisplay(data.data || []);
  };

  useEffect(() => {
    response();
  }, []);

  const handleClick = (path) => {
    setClickedBtn(path);
  };

  const detectMediaType = (url) => {
    if (!url) return "image";
    
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    if (youtubeRegex.test(url)) {
      return "youtube";
    }
    
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const isVideo = videoExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    return isVideo ? "video" : "image";
  };

  const getYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const renderMedia = (url, title, className = "w-full h-64 object-cover rounded-lg") => {
    const mediaType = detectMediaType(url);

    switch (mediaType) {
      case "video":
        return (
          <video 
            className={className}
            controls
            muted
            preload="metadata"
            onClick={(e) => e.stopPropagation()}
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
            onClick={(e) => e.stopPropagation()}
          />
        );
      
      default: 
        return (
          <motion.img
            src={url}
            alt={title}
            className={className}
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 300 },
            }}
          />
        );
    }
  };

  const ExpandedView = ({ post, onClose }) => {
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <div className="bg-gray-900 flex items-center justify-center p-8">
              <div className="w-full max-w-2xl">
                {renderMedia(
                  post.post, 
                  post.title, 
                  "w-full h-96 lg:h-[500px] object-contain rounded-lg"
                )}
              </div>
            </div>
            
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  {post.title}
                </h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.userId?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {post.userId?.username || 'Unknown User'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {formatTime(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    detectMediaType(post.post) === 'image' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : detectMediaType(post.post) === 'video'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {detectMediaType(post.post).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-semibold text-lg"
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  Login to Create Your Own Posts
                </motion.button>
                
                <button
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-purple-900"
      style={{
        backgroundAttachment: "fixed",
      }}
    >
      <div className="fixed top-6 right-6 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 z-50">
        <motion.button
          onClick={() => handleClick("/Signup")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={
            clickedBtn === "/Signup"
              ? { scale: 2, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => {
            if (clickedBtn === "/Signup") navigate("/Signup");
          }}
          className="text-[20px] font-mono bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 text-white rounded-xl px-6 py-3 shadow-lg"
        >
          Sign Up
        </motion.button>

        <motion.button
          onClick={() => handleClick("/login")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={
            clickedBtn === "/login"
              ? { scale: 2, opacity: 0 }
              : { scale: 1, opacity: 1 }
          }
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => {
            if (clickedBtn === "/login") navigate("/login");
          }}
          className="text-[20px] font-mono bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 transition-all duration-300 text-white rounded-xl px-6 py-3 shadow-lg"
        >
          Log In
        </motion.button>
      </div>

      <div className="pt-32 px-8 text-center">
        <motion.h1 
          className="text-white text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-200 via-orange-300 to-red-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            textShadow: "0 0 30px rgba(255,200,0,0.5)",
          }}
        >
          SHEN
        </motion.h1>
        <motion.p 
          className="text-yellow-100 text-xl max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-yellow-300/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Discover amazing content from our  community. Images, videos, and YouTube clips - all in one place.
        </motion.p>
      </div>

      <div className="px-8 pb-16 mt-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {display.map((postObj, index) => (
            <motion.div
              key={postObj._id || index}
              className="group cursor-pointer bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300 border border-yellow-300/20"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 400 }
              }}
              onClick={() => setExpandedPost(postObj)}
            >
              {/* Media Container */}
              <div className="relative overflow-hidden rounded-lg bg-black/20">
                {renderMedia(postObj.post, postObj.title)}
                
                {/* Media Type Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    detectMediaType(postObj.post) === 'image' 
                      ? 'bg-yellow-500 text-white'
                      : detectMediaType(postObj.post) === 'video'
                      ? 'bg-orange-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {detectMediaType(postObj.post)}
                  </span>
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="bg-yellow-400/90 rounded-full p-4"
                  >
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              <h2 className="text-center mt-4 text-yellow-100 text-xl font-semibold line-clamp-2">
                {postObj.title}
              </h2>
              
              <div className="flex items-center justify-between mt-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {postObj.userId?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-yellow-200 text-sm">
                    {postObj.userId?.username || 'user1..'}
                  </span>
                </div>
                <span className="text-yellow-200 text-xs">
                  {formatTime(postObj.createdAt)}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {display.length === 0 && (
          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-yellow-200 text-6xl mb-4">🌞</div>
            <h3 className="text-yellow-100 text-2xl mb-4">No posts yet</h3>
            <p className="text-yellow-200 text-lg mb-8">Be the first to share amazing content!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
              onClick={() => navigate('/signup')}
            >
              Join Now to Post
            </motion.button>
          </motion.div>
        )}
      </div>

      {expandedPost && (
        <ExpandedView 
          post={expandedPost} 
          onClose={() => setExpandedPost(null)} 
        />
      )}
    </div>
  );
};

export default Home;