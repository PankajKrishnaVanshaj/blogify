"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  // Initialize state with current user data or empty values
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");

  // Correct way to initialize avatar URL
  const [avatar, setAvatar] = useState(
    user?.avatar ? `${process.env.NEXT_PUBLIC_BASE_URL}/${user.avatar}` : ""
  );
  const [avatarFile, setAvatarFile] = useState(null); // This will hold the actual file
  const token = Cookies.get("token");

  // Handle avatar change
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // File validation: 2MB max size and image types
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (file.size > 2 * 1024 * 1024 || !validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (Max size: 2MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Set preview URL
        setAvatarFile(file); // Store the file for submission
      };
      reader.readAsDataURL(file); // Convert file to base64 for preview
    }
  };

  // Save profile changes
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("bio", bio);
    if (avatarFile) {
      formData.append("avatar", avatarFile); // Append the actual file
    }

    try {
      if (token) {
        const response = await axios.put(
          "http://localhost:55555/api/v1/auth/update",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Set correct content type for file uploads
            },
          }
        );
        setUser(response.data); // Update the user context
        router.push("/dashboard"); // Redirect to dashboard
      } else {
        console.log("No token found");
      }
    } catch (error) {
      console.log("Error updating user:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="w-full mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
      {/* Profile Section */}
      <div className="flex items-center space-x-8 mb-8">
        {/* Profile Image */}
        <div className="relative w-40 h-40">
          <img
            src={avatar || "/default-avatar.png"} // Fallback to default if no avatar
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-primary"
          />
          {/* Image Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-grow">
          <label className="block text-sm font-bold text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter your full name"
          />

          <label className="block text-sm font-bold text-gray-700 mt-4">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={
              (e) => setUsername(e.target.value.replace(/\s/g, "")) // Remove spaces
            }
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter your username"
          />
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Bio</h2>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          rows="5"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us something about yourself..."
        ></textarea>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 font-bold bg-primary text-white rounded-lg shadow hover:bg-pink-600 transition duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
