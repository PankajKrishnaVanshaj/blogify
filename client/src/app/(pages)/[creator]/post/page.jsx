import ReadPost from "@/components/ReadPost";
import { getPostById } from "@/api/blogPost.api";

export async function generateMetadata({ params }) {
  const postId = params.creator;
  let post;
  try {
    post = await getPostById(postId);
  } catch (error) {
    console.error("Error fetching post for metadata:", error);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;
  const defaultImage = "/blogify.png";

  const defaultMetadata = {
    title: "PK Blogify | Unleash Your Creativity Through Blogging",
    description:
      "Discover fresh, engaging blogs on PK Blogify—a platform connecting writers and readers.",
    keywords: ["PK Blogify", "blogging", "creative writing", "social blogging", "pankri"],
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: "PK Blogify | Unleash Your Creativity Through Blogging",
      description:
        "Explore trending blogs and connect with creators on PK Blogify.",
      images: [
        {
          url: `${baseUrl}${defaultImage}`,
          width: 1200, // High-res for Discover
          height: 630,
          alt: "PK Blogify",
        },
      ],
      url: baseUrl,
      type: "website",
      site_name: "PK Blogify",
    },
    twitter: {
      card: "summary_large_image",
      creator: "@pankri",
    },
    robots: "max-image-preview:large", // Already included for large previews
  };

  if (!post) return defaultMetadata;

  const postDescription =
    post.excerpt || post.content.replace(/<[^>]+>/g, "").slice(0, 160) || defaultMetadata.description;
  const postImage = `${baseUrl}/${post.banner || "blogify.png"}`;
  const postUrl = `${baseUrl}/${post._id}/post`;

  return {
    title: { absolute: `${post.title} | PK Blogify` },
    description: postDescription,
    keywords: [
      ...new Set([
        ...(post.tags || []),
        post.title.toLowerCase(),
        "blog post",
        "PK Blogify",
        "trending",
      ]),
    ],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: `${post.title} | PK Blogify`,
      description: postDescription,
      images: [
        {
          url: postImage,
          width: 1200, // Minimum for Discover large previews
          height: 675, // 16:9 ratio
          alt: post.title, // Descriptive for accessibility and SEO
        },
      ],
      url: postUrl,
      type: "article",
      site_name: "PK Blogify",
      locale: "en_US",
      published_time: new Date(post.createdAt).toISOString(),
    },
    twitter: {
      title: post.title,
      description: postDescription,
      images: [
        {
          url: postImage,
          alt: post.title,
        },
      ],
      card: "summary_large_image",
      creator: post.authorTwitter || "@pankri",
    },
    robots: "max-image-preview:large, index, follow", // Explicitly maximize image previews
  };
}

export default async function PostPage({ params }) {
  const postId = params.creator;
  let post;
  try {
    post = await getPostById(postId);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return <div className="p-4 text-red-500">Post not found</div>;
  }

  if (!post) {
    return <div className="p-4 text-red-500">Post not found</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://blogify.pankri.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${baseUrl}/${post._id}/post`,
    headline: post.title,
    description: post.excerpt || post.content.replace(/<[^>]+>/g, "").slice(0, 200),
    image: {
      "@type": "ImageObject",
      url: `${baseUrl}/${post.banner || "blogify.png"}`,
      width: 1200, // High-res for large previews
      height: 675,
    },
    author: {
      "@type": "Person",
      name: post.authorName || "PK Blogify Contributor",
      url: post.authorId ? `${baseUrl}/author/${post.authorId}` : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "PK Blogify",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/blogify.png`,
        width: 96,
        height: 96,
      },
    },
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.createdAt).toISOString(),
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      url: baseUrl,
      name: "PK Blogify",
      publisher: {
        "@type": "Organization",
        name: "PK Blogify",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog Posts",
          item: `${baseUrl}/posts`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `${baseUrl}/${post._id}/post`,
        },
      ],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${post._id}/post`,
    },
    keywords: (post.tags || []).join(", "),
    wordCount: post.content.replace(/<[^>]+>/g, "").split(/\s+/).length,
    articleSection: post.category || "Blogging",
    speaksAbout: post.tags || [],
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link
        rel="preload"
        href={`${baseUrl}/${post.banner || "blogify.png"}`}
        as="image"
        fetchpriority="high"
        imagesrcset={`
          ${baseUrl}/${post.banner || "blogify.png"}?w=1200 1200w,
          ${baseUrl}/${post.banner || "blogify.png"}?w=800 800w,
          ${baseUrl}/${post.banner || "blogify.png"}?w=400 400w
        `}
        imagesizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
      />
      <ReadPost params={params} />
    </section>
  );
}