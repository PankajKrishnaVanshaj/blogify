import React from "react";
import Script from "next/script";
import { getWebStoryById } from "@/api/webStory.api";
import WebStoryView from "@/components/WebStoryView";


export async function generateMetadata({ params }) {
  const webStory = await getWebStoryById(params.creator);

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

  if (!webStory) return defaultMetadata;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    return {
      title: { absolute: `${webStory.title} | PK Blogify` },
      description:
        webStory.excerpt ||
        webStory.description.slice(0, 160) ||
        defaultMetadata.description,
      keywords: [
        ...new Set([...webStory.tags, "PK Blogify", "blogging", "community"]),
      ],
      openGraph: {
        title: webStory.title,
        description:
          webStory.excerpt ||
          webStory.description.slice(0, 200) ||
          defaultMetadata.openGraph.description,
        images: [{ url: `${baseUrl}/${webStory.coverImage || "blogify.png"}` }],
        url: `/${webStory._id}/web-story`,
        type: "article",
      },
      twitter: {
        title: webStory.title,
        description:
          webStory.excerpt ||
          webStory.description.slice(0, 200) ||
          defaultMetadata.twitter.description,
        images: [{ url: `${baseUrl}/${webStory.coverImage || "blogify.png"}` }],
        card: "summary_large_image",
        creator: webStory?.authorTwitter || "@pankri",
      },
    };
  } catch (error) {
    return defaultMetadata;
  }
}

const WebStory = async ({ params }) => {
  const webStory = await getWebStoryById(params.creator);
  if (!webStory) return null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: webStory.title,
    description: webStory.description.slice(0, 200),
    image: `${baseUrl}/${webStory.coverImage || "blogify.png"}`,
    author: {
      "@type": "Person",
      name: webStory.createdBy.name,
    },
    publisher: {
      "@type": "Organization",
      name: "PK Blogify",
      logo: {
        "@type": "ImageObject",
        url: `${"https://blogify.pankri.com"}/blogify.png`,
      },
    },
    datePublished: new Date(webStory.createdAt).toISOString(),
    dateModified: new Date(
      webStory.updatedAt || webStory.createdAt
    ).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${"https://blogify.pankri.com"}/${webStory._id}/web-story`,
    },
  };

  return (
    <div>
      {/* Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Web Story View */}
      <WebStoryView params={params} />
    </div>
  );
};

export default WebStory;
