import ReadPost from "@/components/ReadPost";
import { getPostById } from "@/api/blogPost.api";

export async function generateMetadata({ params }) {
  const postId = params.creator;
  const post = await getPostById(postId);

  const defaultMetadata = {
    title: "PK Blogify | Unleash Your Creativity Through Blogging",
    description:
      "Discover engaging blogs and articles on PK Blogify. Write, explore, and connect with a dynamic community of creators and readers.",
    keywords: ["PK Blogify", "social blogging", "creative writing", "pankri"],
    openGraph: {
      title: "PK Blogify | Unleash Your Creativity Through Blogging",
      description:
        "Engage with an innovative blogging platform that connects writers and readers in a vibrant community.",
      images: [{ url: "/blogify.png" }],
      url: "https://blogify.pankri.com",
      type: "website",
    },
    twitter: {
      title: "PK Blogify | Unleash Your Creativity Through Blogging",
      description:
        "Explore creative articles and connect with like-minded individuals on PK Blogify.",
      images: [{ url: "/blogify.png" }],
      card: "summary_large_image",
      creator: "@pankri",
    },
  };

  if (!post) return defaultMetadata;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    return {
      title: { absolute: `${post.title} | PK Blogify` },
      description:
        post.excerpt || post.content.slice(0, 160) || defaultMetadata.description,
      keywords: [...new Set([...post.tags, "PK Blogify", "blogging", "community"])],
      openGraph: {
        title: post.title,
        description:
          post.excerpt ||
          post.content.slice(0, 200) ||
          defaultMetadata.openGraph.description,
        images: [{ url: `${baseUrl}/${post.banner || "blogify.png"}` }],
        url: `/${post._id}/post`,
        type: "article",
      },
      twitter: {
        title: post.title,
        description:
          post.excerpt ||
          post.content.slice(0, 200) ||
          defaultMetadata.twitter.description,
        images: [{ url: `${baseUrl}/${post.banner || "blogify.png"}` }],
        card: "summary_large_image",
        creator: post?.authorTwitter || "@pankri",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return defaultMetadata;
  }
}

const PostPage = async ({ params }) => {
  const post = await getPostById(params.creator);

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        image: [`${process.env.NEXT_PUBLIC_BASE_URL}/${post.banner || "/blogify.png"}`],
        description: post.excerpt || post.content.slice(0, 200),
        author: {
          "@type": "Person",
          name: post.authorName || "PK Blogify Contributor",
        },
        publisher: {
          "@type": "Organization",
          name: "PK Blogify",
          logo: {
            "@type": "ImageObject",
            url: "/blogify.png",
          },
        },
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
      }
    : null;

  return (
    <section>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ReadPost params={params} />
    </section>
  );
};

export default PostPage;
