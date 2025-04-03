"use client";
import { useEffect, useState } from "react";
import { getPostById, updatePost } from "@/api/blogPost.api";
import PostForm from "../_components/PostForm";

const EditPost = ({ params }) => {
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(params.edit);
        const formattedData = {
          title: post.title || "",
          content: typeof post.content === "string" ? post.content : JSON.stringify(post.content) || "",
          category: post.category || "",
          tags: post.tags || [],
          banner: post.banner || null,
        };
        setInitialData(formattedData);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    if (params.edit) fetchPost();
  }, [params.edit]);

  const handleSubmit = async (formData) => {
    const { success, message } = await updatePost(params.edit, formData);
    return { success, message };
  };

  return <PostForm initialData={initialData} onSubmit={handleSubmit} isEditMode />;
};

export default EditPost;