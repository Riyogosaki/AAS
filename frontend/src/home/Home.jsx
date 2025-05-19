import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const [display, setDisplay] = useState([]);
  const [clickedBtn, setClickedBtn] = useState(null);
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

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"
      style={{
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top Buttons */}
      <div className="fixed top-4 right-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 z-50">
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
          className="text-[20px] font-mono bg-cyan-500 hover:bg-cyan-600 transition-colors duration-300 text-white rounded-md px-4 py-2 shadow-md"
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
          className="text-[20px] font-mono bg-cyan-500 hover:bg-cyan-600 transition-colors duration-300 text-white rounded-md px-4 py-2 shadow-md"
        >
          Log In
        </motion.button>
      </div>

      {/* Title */}
      <div className="pt-20 px-4">
        <h1 className="text-white text-[60px] font-mono text-center blur-sm">
          AAS
        </h1>

        {/* Cards Grid */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          {display.map((postObj, index) => (
            <motion.div
              key={index}
              className="w-48 flex flex-col items-center bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl"
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
            >
              <motion.img
                src={postObj.post}
                alt={postObj.title}
                className="w-full h-40 object-cover rounded-md shadow-lg"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { type: "spring", stiffness: 300 },
                }}
                whileTap={{ scale: 0.95 }}
              />
              <h2 className="text-center mt-2 text-white text-[20px] font-mono font-semibold">
                {postObj.title}
              </h2>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
