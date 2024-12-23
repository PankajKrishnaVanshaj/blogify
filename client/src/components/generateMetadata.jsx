export async function generateMetadata(post) {
  // Default metadata if post is missing
  if (!post) {
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
        absolute: post?.title || "PK Blogify | Explore, Write, and Connect",
      },
      description: post.content || "PK Blogify description...",
      keywords: post.tags || ["PK Blogify", "Blogify", "pankri", "pk"],
      openGraph: {
        title: post.title || "PK Blogify | Explore, Write, and Connect",
        description: post.content || "PK Blogify description...",
        images: [{ url: post.banner || "/blogify.png" }],
      },
      twitter: {
        title: post.title || "PK Blogify | Explore, Write, and Connect",
        description: post.content || "PK Blogify description...",
        images: [{ url: post.banner || "/blogify.png" }],
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
