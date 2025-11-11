import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Message = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data (replace with real-time data later)
  const unreadMessages = {};
  const onlineUsers = new Set();

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      y: -4,
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  // Fetch user profiles
  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/user/allprofile", { 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to fetch profiles");
      const data = await res.json();
      setProfiles(data.response || []);
    } catch (err) {
      console.error("❌ Error fetching profiles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Filter users based on search input
  const filteredProfiles = profiles.filter((user) =>
    [user.username, user.fullName]
      .filter(Boolean)
      .some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Generate consistent color based on user ID
  const getUserColor = (userId) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-orange-500 to-orange-600',
      'from-teal-500 to-teal-600'
    ];
    const index = userId?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl shadow-sm border border-white/50"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-lg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Messages
        </h1>
        <p className="text-gray-600 text-sm">
          Connect with your friends and colleagues
        </p>
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-6"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* User List */}
      <div className="max-h-[500px] overflow-y-auto pr-2">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredProfiles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No users found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm ? "Try a different search term" : "No users available"}
                  </p>
                </motion.div>
              ) : (
                filteredProfiles.map((user, index) => {
                  const isOnline = onlineUsers.has(user._id);
                  const unreadCount = unreadMessages[user._id] || 0;
                  const userColor = getUserColor(user._id);

                  return (
                    <motion.div
                      key={user._id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => navigate(`/messages/${user._id}`)}
                      className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 overflow-hidden"
                    >
                      {/* Background gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative flex items-center gap-4 p-4">
                        {/* Profile Image with Online Indicator */}
                        <div className="relative flex-shrink-0">
                          {user.profileImg ? (
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400 }}
                              src={user.profileImg}
                              alt={`${user.username || "User"} profile`}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg"
                            />
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${userColor} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                            >
                              {user.username?.[0]?.toUpperCase() || "U"}
                            </motion.div>
                          )}
                          
                          {/* Online Status Indicator */}
                          {isOnline && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-lg"
                            >
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-full h-full bg-green-400 rounded-full opacity-75"
                              />
                            </motion.div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <motion.h2 
                            className="font-semibold text-gray-800 text-lg truncate"
                            layoutId={`username-${user._id}`}
                          >
                            {user.username}
                          </motion.h2>
                          <motion.p 
                            className="text-gray-600 text-sm truncate"
                            layoutId={`fullname-${user._id}`}
                          >
                            {user.fullName}
                          </motion.p>
                          
                          {/* Last message preview (you can add this later) */}
                          <motion.p 
                            className="text-gray-400 text-xs truncate mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            Tap to start chatting...
                          </motion.p>
                        </div>

                        {/* Unread Message Count */}
                        <AnimatePresence>
                          {unreadCount > 0 && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              whileHover={{ scale: 1.2 }}
                              className="flex-shrink-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg min-w-[24px] text-center"
                            >
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Chevron Icon */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-gray-400 group-hover:text-blue-500 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button (Optional) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 right-6"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Message;