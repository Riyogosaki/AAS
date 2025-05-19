import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Message = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Mock unread messages & online data (replace with API data if available)
  const unreadMessages = {
    // userId: count
  };
  const onlineUsers = new Set(); // userIds who are online

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/user/allprofile", { credentials: "include" });
      const data = await res.json();
      setProfiles(data.response);
    } catch (err) {
      console.error("Failed to fetch profiles", err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Filter users based on search
  const filteredProfiles = profiles.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-blue-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-900">Select a User to Chat</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="space-y-3 max-h-[500px] overflow-auto">
        {filteredProfiles.length === 0 ? (
          <p className="text-center text-blue-700">No users found.</p>
        ) : (
          filteredProfiles.map((user) => {
            const isOnline = onlineUsers.has(user._id);
            const unreadCount = unreadMessages[user._id] || 0;

            return (
              <div
                key={user._id}
                onClick={() => navigate(`/messages/${user._id}`)}
                className="flex items-center gap-4 p-3 border border-blue-200 rounded cursor-pointer hover:bg-blue-100 transition relative"
              >
                <div className="relative">
                  <img
                    src={user.profileImg}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-blue-900">{user.username}</h2>
                  <p className="text-blue-700 text-sm truncate">{user.fullName}</p>
                </div>

                {unreadCount > 0 && (
                  <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Message;
