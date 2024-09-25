"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name);
  const [username, setUsername] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [avatar, setavatar] = useState(user?.avatar);
  const token = Cookies.get("token");

  // Handle image input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setavatar(reader.result); // Set the profile image to the image preview
      };
      reader.readAsDataURL(file); // Convert the file to a base64-encoded image
    }
  };

  const handleSave = async () => {
    try {
      if (token) {
        const response = await axios.put(
          "http://localhost:55555/api/v1/auth/update",
          {
            name,
            username,
            bio,
            avatar,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        router.push("/dashboard");
      } else {
        console.log("No token found");
      }
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  return (
    <div className="w-full mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
      {/* Profile Section */}
      <div className="flex items-center space-x-8 mb-8">
        {/* Profile Image */}
        <div className="relative w-40 h-40">
          <img
            src={avatar}
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
            onChange={(e) => setUsername(e.target.value)}
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
