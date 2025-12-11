import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [userdisplay, setUserDisplay] = useState([]);

  const fetchUserProfile = async () => {
    const res = await fetch(`https://aas-i4rm.onrender.com/api/user/userprofile/${username}`);
    const data = await res.json();
    setProfile(data.datauser);
  };

  const response = async () => {
    const res = await fetch("https://aasapi/home/user", { credentials: "include" });
    const data = await res.json();
    setUserDisplay(data.data);
  };

  useEffect(() => {
    response();
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

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
  const renderMedia = (url, title, className = "w-full h-40 object-cover rounded-md") => {
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

  if (!profile) return <div className="text-center text-yellow-100 mt-10">Loading...</div>;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-purple-900 p-4 text-yellow-100 font-mono">
      <motion.div
        className="max-w-xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center border border-yellow-300/30"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src={profile.profileImg} alt="profile" className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-300" />
        <h1 className="text-2xl mt-4 font-bold text-yellow-100">Welcome, {profile.fullName}</h1>
        <p className="text-yellow-200 text-sm">@{profile.username}</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/createpost">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
            >
              ✍️ Create
            </motion.button>
          </Link>
          <Link to="/history">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
            >
              📜 History
            </motion.button>
          </Link>
          <Link to="/messages">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
            >
              💬 Chat
            </motion.button>
          </Link>
          <Link to="/">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
            >
              🏠 Home
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* User Posts */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-yellow-100 text-center mb-4">Your Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
          {userdisplay.map((postObj, index) => (
            <motion.div
              key={postObj._id || index}
              className="bg-white bg-opacity-10 p-4 rounded-xl shadow-lg backdrop-blur-sm border border-yellow-300/20 hover:border-yellow-300/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {renderMedia(postObj.post, postObj.title, "w-full h-48 object-cover rounded-lg")}
              <h3 className="text-center mt-3 text-yellow-100 font-semibold text-lg">{postObj.title}</h3>
              
              {/* Timestamp */}
              <div className="text-center mt-2">
                <span className="text-xs text-yellow-200 bg-black/20 rounded-full px-2 py-1">
                  {formatTime(postObj.createdAt)}
                </span>
              </div>
              
              {/* Media type badge */}
              <div className="text-center mt-2">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  detectMediaType(postObj.post) === 'image' 
                    ? 'bg-yellow-500 text-white'
                    : detectMediaType(postObj.post) === 'video'
                    ? 'bg-orange-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {detectMediaType(postObj.post)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Empty state */}
        {userdisplay.length === 0 && (
          <motion.div 
            className="text-center text-yellow-100 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-6xl mb-4">🌞</div>
            <p className="text-xl mb-2">No posts yet</p>
            <p className="text-yellow-200 mb-6">Start sharing your cosmic creations!</p>
            <Link to="/createpost">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,200,0,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
              >
                Create your first post
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;