import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null);
  const [userDisplay, setUserDisplay] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [successAnim, setSuccessAnim] = useState(false);

  const handleImageChange = (e) => {
    const url = e.target.value;
    setImage(url);
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !image) {
      alert("Please provide both title and image URL.");
      return;
    }

    try {
      const res = await fetch("/api/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, post: image }),
      });

      const data = await res.json();
      console.log("Response:", data);
      setSuccessAnim(true);
      setTimeout(() => setSuccessAnim(false), 1200);

      alert("Successfully uploaded!");

      setTitle("");
      setImage("");
      setPreview(null);
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4 space-y-10 pt-12">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create a Post</h2>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={handleImageChange}
            placeholder="Enter image URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        {preview && (
          <motion.img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <motion.button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          whileTap={{ scale: 0.95 }}
          disabled={successAnim}
        >
          {successAnim ? "Uploaded!" : "Submit"}
        </motion.button>
      </motion.form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
        <AnimatePresence>
          {userDisplay.map((postObject) => (
            <motion.div
              key={postObject._id}
              className="bg-white p-3 rounded shadow flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              layout
            >
              <img
                src={postObject.post}
                alt={postObject.title}
                className="w-36 h-36 object-cover rounded-md"
              />
              <h2 className="mt-3 text-center font-semibold">{postObject.title}</h2>
              <button
                onClick={() => handleDelete(postObject._id)}
                disabled={deletingId === postObject._id}
                className={`mt-3 w-full py-1 rounded text-white transition ${
                  deletingId === postObject._id
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deletingId === postObject._id ? "Deleting..." : "Delete"}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreatePage;
