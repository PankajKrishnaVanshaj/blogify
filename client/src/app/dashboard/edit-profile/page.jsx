"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "@/api/user.api"; 
import MediaTab from "../media/_components/MediaTab";
import Image from "next/image";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState(() =>
    user?.avatar ? `${user.avatar}` : ""
  );
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isOpen, setIsOpen] = useState(false);


  const handleSelectMedia = (media) => {
    setSelectedMedia(media);
  };

  const toggleMediaTab = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("avatar", selectedMedia);

    try {
      const updatedUser = await updateProfile(formData);
      setUser(updatedUser);
      router.push("/dashboard");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };
console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/${selectedMedia}`)
  return (
    <div className="w-full mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
      <div className="flex items-center space-x-8 mb-8">
        <div onClick={toggleMediaTab} className="relative w-40 h-40">
          {selectedMedia ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${selectedMedia}`}
              width={1200}
              height={675}
              priority={true}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-primary"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              Upload Avatar
            </div>
          )}
        </div>
        {isOpen && (
          <div className="relative z-10">
            <div
              role="dialog"
              aria-labelledby="upload-form-title"
              aria-modal="true"
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <MediaTab
                toggleMediaTab={toggleMediaTab}
                onSelectMedia={handleSelectMedia}
              />
            </div>
          </div>
        )}
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
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter your username"
          />
        </div>
      </div>
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
