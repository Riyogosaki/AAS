import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [auth, setAuth] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    profileImg: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setAuth((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Account created successfully!");
        console.log("Storing token:", data.token);
        localStorage.setItem("token", data.token);
        navigate(`/profile/${auth.username}`);
      } else {
        alert(data.error || "An error occurred");
        console.error(data);
      }
    } catch (error) {
      alert("An error occurred while submitting the form");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Signup Page
        </h1>
        <form onSubmit={handleForm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={auth.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={auth.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={auth.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
            <input
              type="text"
              name="profileImg"
              placeholder="Enter image URL"
              value={auth.profileImg}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
            />
            {auth.profileImg && (
              <motion.img
                src={auth.profileImg}
                alt="Profile Preview"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mt-2 rounded-full border-2 border-pink-400 shadow-md mx-auto"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={auth.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-pink-600 text-white py-2 rounded-md font-semibold hover:bg-pink-700 transition"
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
