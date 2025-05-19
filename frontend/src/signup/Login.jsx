import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [display, setDisplay] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(display),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Login successfully!");
        navigate(`/profile/${display.username}`);
      } else {
        alert(data.error || "An error occurred");
        console.error(data);
      }
    } catch (error) {
      alert("An error occurred while submitting the form");
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    setDisplay({ ...display, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Log In</h1>

        <form onSubmit={handleForm} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={display.username}
              onChange={handleSubmit}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={display.password}
              onChange={handleSubmit}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;