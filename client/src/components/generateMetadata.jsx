export async function generateMetadata(postId) {
  // Default metadata if postId is missing
  if (!postId) {
    return {
      title: "PK Blogify | Explore, Write, and Connect",
      description:
        "PK Blogify is a dynamic social media blog platform designed to bring creators, writers, and readers together in one engaging space.",
      keywords: ["PK Blogify", "Blogify", "pankri", "pk"],
      openGraph: {
        title: "PK Blogify | Explore, Write, and Connect",
        description: "PK Blogify is a dynamic social media blog platform.",
        images: [{ url: "/blogify.png" }],
      },
      twitter: {
        title: "PK Blogify | Explore, Write, and Connect",
        description: "PK Blogify is a dynamic social media blog platform.",
        images: [{ url: "/blogify.png" }],
        card: "summary_large_image",
        creator: "pankri",
      },
    };
  }

  try {
    return {
      title: {
        absolute: postId?.title || "PK Blogify | Explore, Write, and Connect",
      },
      description: postId.content || "PK Blogify description...",
      keywords: postId.tags || ["PK Blogify", "Blogify", "pankri", "pk"],
      openGraph: {
        title: postId.title || "PK Blogify | Explore, Write, and Connect",
        description: postId.content || "PK Blogify description...",
        images: [{ url: postId.banner || "/blogify.png" }],
      },
      twitter: {
        title: postId.title || "PK Blogify | Explore, Write, and Connect",
        description: postId.content || "PK Blogify description...",
        images: [{ url: postId.banner || "/blogify.png" }],
        card: "summary_large_image",
        creator: "pankri",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "PK Blogify | Explore, Write, and Connect",
      description: "PK Blogify is a dynamic social media blog platform...",
      keywords: ["PK Blogify", "Blogify", "pankri", "pk"],
      openGraph: {
        title: "PK Blogify | Explore, Write, and Connect",
        description: "PK Blogify is a dynamic social media blog platform...",
        images: [{ url: "/blogify.png" }],
      },
      twitter: {
        title: "PK Blogify | Explore, Write, and Connect",
        description: "PK Blogify is a dynamic social media blog platform...",
        images: [{ url: "/blogify.png" }],
        card: "summary_large_image",
        creator: "pankri",
      },
    };
  }
}
