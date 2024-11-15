import React from "react";

export const metadata = {
  title: "About - PK Blogify",
  description:
    "Learn more about PK Blogify, your go-to platform for exploring, creating, and sharing amazing blog content.",
  keywords: "About, PK Blogify, blogging, content creation, writers, community",
  author: "pankri",
  openGraph: {
    title: "About PK Blogify",
    description:
      "Discover PK Blogify, a platform for writers and readers to connect, create, and inspire. Learn about our mission and vision.",
    url: "https://blogify.pankri.com/about",
    type: "website",
    images: [
      {
        url: "/blogify.png",
        width: 1200,
        height: 630,
        alt: "PK Blogify",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About PK Blogify",
    description:
      "Explore PK Blogify, a space to read, write, and connect with passionate creators.",
    image: "/blogify.png",
  },
};

const About = () => {
  return (
    <div>
      Discover PK Blogify, a platform for writers and readers to connect,
      create, and inspire. Learn about our mission and vision.
    </div>
  );
};

export default About;
