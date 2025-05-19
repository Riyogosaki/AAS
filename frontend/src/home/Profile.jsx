import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [userdisplay, setUserDisplay] = useState([]);

  const fetchUserProfile = async () => {
    const res = await fetch(`/api/user/userprofile/${username}`);
    const data = await res.json();
    setProfile(data.datauser);
  };

  const response = async () => {
    const res = await fetch("/api/home/user", { credentials: "include" });
    const data = await res.json();
    setUserDisplay(data.data);
  };

  useEffect(() => {
    response();
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  if (!profile) return <div className="text-center text-white mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 to-purple-700 p-4 text-white font-mono">
      <motion.div
        className="max-w-xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src={profile.profileImg} alt="profile" className="w-24 h-24 rounded-full mx-auto border-4 border-white" />
        <h1 className="text-2xl mt-4 font-bold text-white">Welcome, {profile.fullName}</h1>
        <p className="text-pink-200 text-sm">@{profile.username}</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/createpost">
            <motion.button whileHover={{ scale: 1.1 }} className="bg-white text-pink-600 px-4 py-1 rounded-lg">
              ✍️ Create
            </motion.button>
          </Link>
          <Link to="/history">
            <motion.button whileHover={{ scale: 1.1 }} className="bg-white text-pink-600 px-4 py-1 rounded-lg">
              📜 History
            </motion.button>
          </Link>
          <Link to="/messages">
            <motion.button whileHover={{ scale: 1.1 }} className="bg-white text-pink-600 px-4 py-1 rounded-lg">
              💬 Chat
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* User Posts */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-white text-center mb-4">Your Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
          {userdisplay.map((postObj, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-10 p-2 rounded-lg shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={postObj.post}
                alt={postObj.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-center mt-2 text-white">{postObj.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
