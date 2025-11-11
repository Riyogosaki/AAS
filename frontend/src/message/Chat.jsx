import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Chat = () => {
  const { id: receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Floating animation variants
  const floatingVariants = {
    initial: { y: 20, opacity: 0, scale: 0.9 },
    animate: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  // Container animation for message list
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/message/${receiverId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.data);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching messages:", err.message);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [receiverId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "nearest"
    });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/message/${receiverId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.data]);
        setMessage("");
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Send error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  // Generate consistent color based on user ID
  const getUserColor = (userId) => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-pink-500 to-pink-600',
      'bg-gradient-to-r from-orange-500 to-orange-600'
    ];
    const index = userId?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl rounded-2xl flex flex-col h-[80vh] min-h-[600px] border border-white/50 backdrop-blur-sm">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-lg border border-white/50"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full ${getUserColor(receiverId)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {messages.find(m => m.sender._id === receiverId)?.sender.fullName?.[0] || "U"}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">
              {messages.find(m => m.sender._id === receiverId)?.sender.fullName || "User"}
            </h2>
            <p className="text-sm text-gray-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-4 mb-4 flex flex-col space-y-3 shadow-inner"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => {
            const isReceived = msg.sender._id === receiverId;
            const showAvatar = isReceived && (index === 0 || messages[index - 1]?.sender._id !== receiverId);
            
            return (
              <motion.div
                key={msg._id}
                layout
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`flex ${isReceived ? "justify-start" : "justify-end"} items-end space-x-2`}
              >
                {isReceived && showAvatar && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-8 h-8 rounded-full ${getUserColor(msg.sender._id)} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}
                  >
                    {msg.sender.fullName?.[0] || "U"}
                  </motion.div>
                )}
                
                {isReceived && !showAvatar && <div className="w-8 flex-shrink-0" />}
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`max-w-xs lg:max-w-md p-4 rounded-2xl break-words shadow-lg ${
                    isReceived
                      ? "bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 rounded-tl-none"
                      : "bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 rounded-tr-none"
                  }`}
                >
                  <div className="text-gray-800 leading-relaxed">{msg.message}</div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`text-xs text-gray-500 mt-2 ${isReceived ? "text-left" : "text-right"}`}
                  >
                    {formatTime(msg.createdAt)}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Loading indicator when sending */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-xs p-4 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 rounded-tr-none shadow-lg">
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-gray-600 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-600 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-600 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={chatEndRef} />
      </motion.div>

      {/* Input Area */}
      <motion.form 
        onSubmit={sendMessage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/50"
      >
        <motion.textarea
          rows={1}
          placeholder="Type a message... (Shift + Enter for newline)"
          className="flex-1 px-4 py-3 border-0 bg-transparent resize-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        />
        <motion.button
          type="submit"
          disabled={isLoading || !message.trim()}
          whileHover={{ 
            scale: message.trim() ? 1.05 : 1,
            boxShadow: message.trim() ? "0 10px 25px -5px rgba(59, 130, 246, 0.4)" : "none"
          }}
          whileTap={{ scale: message.trim() ? 0.95 : 1 }}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            message.trim() 
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <motion.span
            animate={{ 
              rotate: isLoading ? 360 : 0,
              scale: isLoading ? 1.1 : 1
            }}
            transition={{ 
              rotate: { duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }
            }}
          >
            {isLoading ? "⏳" : "📤"}
          </motion.span>
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Chat;