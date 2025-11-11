import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [display, setDisplay] = useState({
    username: "",
    password: "",
  });

  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
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

  // Sun Ray Component
  const SunRay = ({ angle, delay }) => (
    <motion.div
      className="absolute w-1 h-16 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-full opacity-60"
      style={{
        transformOrigin: "bottom center",
        transform: `rotate(${angle}deg)`,
        bottom: "50%",
        left: "50%",
        marginLeft: "-0.5px",
      }}
      animate={{
        scaleY: [0.3, 1.2, 0.3],
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    />
  );

  // Solar Flare Particle
  const SolarFlare = ({ delay, size, color }) => (
    <motion.div
      className={`absolute rounded-full ${color} opacity-0`}
      style={{
        width: size,
        height: size,
        filter: "blur(2px)",
      }}
      animate={{
        opacity: [0, 0.9, 0],
        scale: [0, 1.5, 0],
        x: [0, (Math.random() - 0.5) * 200],
        y: [0, (Math.random() - 0.5) * 200],
      }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    />
  );

  // Sun Core Animation
  const SunCore = () => (
    <motion.div
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
        filter: "blur(8px)",
      }}
      animate={{
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Central Sun */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, type: "spring" }}
      >
        {/* Sun Core */}
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-full shadow-2xl"
          animate={{
            rotate: 360,
            boxShadow: [
              "0 0 50px rgba(255,200,0,0.8)",
              "0 0 70px rgba(255,100,0,0.9)",
              "0 0 50px rgba(255,200,0,0.8)",
            ],
          }}
          transition={{
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            },
            boxShadow: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <SunCore />
        </motion.div>

        {/* Sun Rays */}
        <div className="absolute inset-0">
          {[...Array(18)].map((_, i) => (
            <SunRay key={i} angle={i * 20} delay={i * 0.1} />
          ))}
        </div>
      </motion.div>

      {/* Solar Background Elements */}
      <div className="absolute inset-0">
        {/* Solar Flares */}
        {[...Array(25)].map((_, i) => (
          <SolarFlare 
            key={i} 
            delay={i * 0.2} 
            size={Math.random() * 5 + 2}
            color={i % 3 === 0 ? "bg-yellow-300" : i % 3 === 1 ? "bg-orange-400" : "bg-red-400"}
          />
        ))}
        
        {/* Large Glowing Orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-yellow-500 rounded-full opacity-5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-orange-500 rounded-full opacity-5 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.05, 0.08],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Solar Container */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.7, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 1.5,
          type: "spring",
          stiffness: 80
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        {/* Solar Glass Effect */}
        <motion.div
          className="relative bg-white bg-opacity-10 backdrop-blur-xl p-8 rounded-3xl border border-yellow-300 border-opacity-30 shadow-2xl"
          animate={{
            y: [0, -5, 0],
            rotateY: [0, 1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: `
              0 0 40px rgba(255,200,0,0.4),
              0 0 80px rgba(255,100,0,0.3),
              inset 0 0 60px rgba(255,255,255,0.15)
            `,
          }}
        >
          {/* Solar Inner Glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent)",
              filter: "blur(8px)",
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Solar Title */}
          <motion.h1 
            className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-200 via-orange-300 to-red-300 bg-clip-text text-transparent"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            style={{
              textShadow: "0 0 25px rgba(255,200,0,0.6)",
            }}
          >
            Welcome Back
          </motion.h1>

          <form onSubmit={handleForm} className="space-y-6 relative z-10">
            {/* Username Field */}
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.02 }}
            >
              <label className="block mb-2 text-sm font-medium text-yellow-100 text-opacity-90">
                Username
              </label>
              <motion.input
                type="text"
                name="username"
                placeholder="Enter username"
                value={display.username}
                onChange={handleSubmit}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-yellow-300 border-opacity-40 rounded-xl focus:outline-none text-yellow-100 placeholder-yellow-200 placeholder-opacity-50 backdrop-blur-sm"
                required
                whileFocus={{
                  boxShadow: "0 0 25px rgba(255,200,0,0.5)",
                  borderColor: "rgba(255,200,0,0.8)",
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.02 }}
            >
              <label className="block mb-2 text-sm font-medium text-yellow-100 text-opacity-90">
                Password
              </label>
              <motion.input
                type="password"
                name="password"
                placeholder="Enter password"
                value={display.password}
                onChange={handleSubmit}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-yellow-300 border-opacity-40 rounded-xl focus:outline-none text-yellow-100 placeholder-yellow-200 placeholder-opacity-50 backdrop-blur-sm"
                required
                whileFocus={{
                  boxShadow: "0 0 25px rgba(255,150,0,0.5)",
                  borderColor: "rgba(255,150,0,0.8)",
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Solar Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 40px rgba(255,200,0,0.7)",
                y: -2
              }}
              whileTap={{ 
                scale: 0.98,
                y: 0
              }}
              className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-3 rounded-xl font-bold relative overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <motion.span
                className="relative z-10"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                Sign In
              </motion.span>
              
              {/* Button Solar Flare Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />

              {/* Pulsing Solar Glow */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,200,0,0.5)",
                    "0 0 40px rgba(255,150,0,0.7)",
                    "0 0 20px rgba(255,200,0,0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>

            {/* Sign Up Link with Solar Hover Effect */}
            <motion.div className="text-center pt-4">
              <Link 
                to="/Signup"
                className="text-yellow-100 text-opacity-80 hover:text-opacity-100 transition-all duration-300"
              >
                <motion.span
                  whileHover={{ 
                    scale: 1.05,
                    textShadow: "0 0 10px rgba(255,200,0,0.8)"
                  }}
                  className="inline-block"
                >
                  Don't have an account? <u className="text-yellow-300">Join the Solar System</u>
                </motion.span>
              </Link>
            </motion.div>
          </form>
        </motion.div>

        {/* Floating Solar Orbs */}
        <motion.div
          className="absolute -top-6 -right-6 w-16 h-16 bg-yellow-400 rounded-full opacity-25 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-6 -left-6 w-14 h-14 bg-orange-400 rounded-full opacity-25 blur-xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Ambient Light Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-yellow-500 to-transparent opacity-3 pointer-events-none"
        animate={{
          opacity: [0.02, 0.06, 0.02],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default Login;