import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Chat = () => {
  const { id: receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  // Format timestamp nicely
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Fetch messages from API
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

  // Poll messages every 5 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [receiverId]);

  // Scroll to bottom on messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

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
    }
  };

  // Handle Enter to send, Shift+Enter new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-blue-50 shadow rounded-lg flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto border p-4 bg-white rounded mb-4 flex flex-col space-y-3">
        <AnimatePresence>
          {messages.map((msg) => {
            const isReceived = msg.sender._id === receiverId;
            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`max-w-xs p-3 rounded-lg break-words ${
                  isReceived
                    ? "bg-blue-200 self-start text-left flex items-center space-x-2"
                    : "bg-green-200 self-end text-right flex items-center space-x-2 justify-end"
                }`}
              >
                {isReceived && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {msg.sender.fullName?.[0] || "U"}
                  </div>
                )}
                <div>
                  <div>{msg.message}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
                {!isReceived && (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                    Me
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <textarea
          rows={2}
          placeholder="Type a message... (Shift + Enter for newline)"
          className="flex-1 px-3 py-2 border rounded resize-none focus:outline-none focus:ring focus:border-blue-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
