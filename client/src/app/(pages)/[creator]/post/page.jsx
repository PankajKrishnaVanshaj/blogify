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

  const baseUrl = "https://blogify.pankri.com";
  const imageBaseUrl = "https://server.blogify.pankri.com";
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
          url: `${imageBaseUrl}${defaultImage}`,
          width: 1200,
          height: 630,
          alt: "PK Blogify",
        },
      ],
      url: baseUrl,
      type: "website",
      site_name: "PK Blogify",
      locale: "en_US", // Added locale
      // Replace with your actual Facebook App ID
      // app_id: "YOUR_FACEBOOK_APP_ID_HERE", // Fix: Added fb:app_id
    },
    twitter: {
      card: "summary_large_image",
      creator: "@pankri",
    },
    robots: "max-image-preview:large",
  };

  if (!post) return defaultMetadata;

  const postDescription =
    post.excerpt || post.content.replace(/<[^>]+>/g, "").slice(0, 160) || defaultMetadata.description;
  const postImage = post.banner ? `${imageBaseUrl}/${post.banner}` : `${imageBaseUrl}${defaultImage}`;
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
          width: 1200,
          height: 675,
          alt: post.title,
        },
      ],
      url: postUrl,
      type: "article",
      site_name: "PK Blogify",
      locale: "en_US", // Added locale
      published_time: new Date(post.createdAt).toISOString(),
      // app_id: "YOUR_FACEBOOK_APP_ID_HERE", // Fix: Added fb:app_id
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
      creator:  "@pankri",
    },
    robots: "max-image-preview:large, index, follow",
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

  const baseUrl = "https://blogify.pankri.com";
  const imageBaseUrl = "https://server.blogify.pankri.com";
  const postImage = post.banner ? `${imageBaseUrl}/${post.banner}` : `${imageBaseUrl}/blogify.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${baseUrl}/${post._id}/post`,
    headline: post.title,
    description: post.excerpt || post.content.replace(/<[^>]+>/g, "").slice(0, 200),
    image: {
      "@type": "ImageObject",
      url: postImage,
      width: 1200,
      height: 675,
    },
    author: {
      "@type": "Person",
      name: post.authorName || "PK Blogify Contributor",
      url: post.createdBy , 
    },
    publisher: {
      "@type": "Organization",
      name: "PK Blogify",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${imageBaseUrl}/blogify.png`,
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
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Blog Posts", item: `${baseUrl}/posts` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${baseUrl}/${post._id}/post` },
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
      <link rel="preload" href={postImage} as="image" fetchPriority="high" />
      <ReadPost params={params} />
    </section>
  );
}