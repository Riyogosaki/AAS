import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("image"); // "image", "video", or "youtube"
  const [preview, setPreview] = useState(null);
  const [userDisplay, setUserDisplay] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [successAnim, setSuccessAnim] = useState(false);

  // Function to detect media type
  const detectMediaType = (url) => {
    if (!url) return "image";
    
    // Check for YouTube URLs
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    if (youtubeRegex.test(url)) {
      return "youtube";
    }
    
    // Check for other video URLs
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const isVideo = videoExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    return isVideo ? "video" : "image";
  };

  // Function to extract YouTube ID
  const getYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(():mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleMediaChange = (e) => {
    const url = e.target.value;
    setMediaUrl(url);
    setPreview(url);
    
    // Auto-detect media type
    if (url) {
      const detectedType = detectMediaType(url);
      setMediaType(detectedType);
    }
  };

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    // Clear preview when switching types
    setPreview(null);
    setMediaUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !mediaUrl) {
      alert("Please provide both title and media URL.");
      return;
    }

    try {
      const res = await fetch("/api/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          title, 
          post: mediaUrl,
          mediaType // Send media type to backend
        }),
      });

      const data = await res.json();
      console.log("Response:", data);
      setSuccessAnim(true);
      setTimeout(() => setSuccessAnim(false), 1200);

      alert("Successfully uploaded!");

      setTitle("");
      setMediaUrl("");
      setPreview(null);
      setMediaType("image");
      fetchPosts();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/home/user", { credentials: "include" });
      const data = await res.json();
      setUserDisplay(data.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/home/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setUserDisplay((prev) => prev.filter((post) => post._id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Function to render appropriate media based on type
  const renderMedia = (url, type, className = "w-36 h-36 object-cover rounded-md") => {
    switch (type) {
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
            title="YouTube video"
          />
        );
      
      default: // image
        return (
          <img
            src={url}
            alt="Media content"
            className={className}
          />
        );
    }
  };

  // Function to render preview
  const renderPreview = (url, type) => {
    switch (type) {
      case "video":
        return (
          <motion.video
            src={url}
            controls
            muted
            className="w-full h-48 object-cover rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Your browser does not support the video tag.
          </motion.video>
        );
      
      case "youtube":
        const videoId = getYouTubeId(url);
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-48"
          >
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-md"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video preview"
            />
          </motion.div>
        );
      
      default: // image
        return (
          <motion.img
            src={url}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-purple-900 flex flex-col items-center justify-start p-4 space-y-10 pt-12">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-yellow-300/30"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-yellow-100">Create a Post</h2>

        {/* Media Type Selection */}
        <div>
          <label className="block text-yellow-200 font-semibold mb-2">Media Type</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleMediaTypeChange("image")}
              className={`flex-1 py-2 rounded-md transition font-semibold ${
                mediaType === "image" 
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg" 
                  : "bg-white bg-opacity-20 text-yellow-100 hover:bg-white hover:bg-opacity-30"
              }`}
            >
              Image
            </button>
            <button
              type="button"
              onClick={() => handleMediaTypeChange("video")}
              className={`flex-1 py-2 rounded-md transition font-semibold ${
                mediaType === "video" 
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg" 
                  : "bg-white bg-opacity-20 text-yellow-100 hover:bg-white hover:bg-opacity-30"
              }`}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => handleMediaTypeChange("youtube")}
              className={`flex-1 py-2 rounded-md transition font-semibold ${
                mediaType === "youtube" 
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg" 
                  : "bg-white bg-opacity-20 text-yellow-100 hover:bg-white hover:bg-opacity-30"
              }`}
            >
              YouTube
            </button>
          </div>
        </div>

        <div>
          <label className="block text-yellow-200 font-semibold mb-1">
            {mediaType === "image" ? "Image URL" : 
             mediaType === "video" ? "Video URL" : "YouTube URL"}
          </label>
          <input
            type="text"
            value={mediaUrl}
            onChange={handleMediaChange}
            placeholder={
              mediaType === "image" ? "Enter image URL" : 
              mediaType === "video" ? "Enter video URL" : "Enter YouTube URL"
            }
            className="w-full px-3 py-2 bg-white bg-opacity-10 border border-yellow-300/30 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-yellow-100 placeholder-yellow-200"
          />
          {mediaType === "youtube" && (
            <p className="text-sm text-yellow-200 mt-1">
              Supports YouTube URLs like: youtube.com/watch?v=... or youtu.be/...
            </p>
          )}
        </div>

        {preview && renderPreview(preview, mediaType)}

        <div>
          <label className="block text-yellow-200 font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full px-3 py-2 bg-white bg-opacity-10 border border-yellow-300/30 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-yellow-100 placeholder-yellow-200"
          />
        </div>

        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          disabled={successAnim}
        >
          <span className="relative z-10">
            {successAnim ? "✨ Uploaded!" : "🚀 Create Post"}
          </span>
          {successAnim && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      </motion.form>

      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-yellow-100 text-center mb-6">Your Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {userDisplay.map((postObject) => (
              <motion.div
                key={postObject._id}
                className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-yellow-300/20 hover:border-yellow-300/40 transition-all duration-300 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                layout
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {renderMedia(
                  postObject.post, 
                  postObject.mediaType || detectMediaType(postObject.post), // Fallback for old posts
                  "w-full h-48 object-cover rounded-lg"
                )}
                <h2 className="mt-3 text-center font-semibold text-yellow-100 text-lg">{postObject.title}</h2>
                <motion.button
                  onClick={() => handleDelete(postObject._id)}
                  disabled={deletingId === postObject._id}
                  className={`mt-3 w-full py-2 rounded-xl text-white font-semibold transition-all ${
                    deletingId === postObject._id
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
                  }`}
                  whileHover={{ scale: deletingId === postObject._id ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {deletingId === postObject._id ? "🗑️ Deleting..." : "🗑️ Delete"}
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {userDisplay.length === 0 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-6xl mb-4 text-yellow-200">🌞</div>
            <h3 className="text-xl text-yellow-100 mb-2">No posts yet</h3>
            <p className="text-yellow-200">Create your first cosmic post!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreatePage;