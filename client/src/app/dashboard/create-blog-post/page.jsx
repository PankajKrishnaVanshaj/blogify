"use client";
import { createPostAPI } from "@/api/blogPost.api";
import PostForm from "./_components/PostForm";

const CreatePost = () => {
  const handleSubmit = async (formData) => {
    const { success, message } = await createPostAPI(formData);
    return { success, message }; 
  };

  return <PostForm onSubmit={handleSubmit} />;
};

export default CreatePost;