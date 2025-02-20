import Script from "next/script";
import dynamic from "next/dynamic";
import { getWebStoryById } from "@/api/webStory.api";

const WebStoryView = dynamic(() => import("@/components/WebStoryView"), {
  ssr: false,
});

export async function generateMetadata({ params }) {
  let webStory;
  try {
    webStory = await getWebStoryById(params.creator);
  } catch (error) {
    console.error("Failed to fetch web story for metadata:", error);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://blogify.pankri.com";
  const defaultImage = "blogify.png";

  const defaultMetadata = {
    title: "PK Blogify | Unleash Your Creativity Through Blogging",
    description: "Discover engaging blogs and articles on PK Blogify...",
    keywords: ["PK Blogify", "pankri Blogify", "social blogging", "creative writing", "pankri"],
    openGraph: {
      title: "PK Blogify | Unleash Your Creativity Through Blogging",
      description: "Engage with an innovative blogging platform...",
      images: [{ url: `${baseUrl}/${defaultImage}` }],
      url: baseUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      creator: "@pankri",
    },
  };

  if (!webStory) return defaultMetadata;

  const storyImage = `${baseUrl}/${webStory.coverImage || defaultImage}`;
  const storyDescription =
    webStory.excerpt || webStory.description?.slice(0, 160) || defaultMetadata.description;

  return {
    title: `${webStory.title} | PK Blogify`,
    description: storyDescription,
    keywords: [...new Set([...(webStory.tags || []), "PK Blogify", "blogging"])],
    openGraph: {
      title: webStory.title,
      description: storyDescription,
      images: [{ url: storyImage }],
      url: `${baseUrl}/${webStory._id}/web-story`,
      type: "website", // Changed to "website" to match WebPage schema
    },
    twitter: {
      title: webStory.title,
      description: storyDescription,
      images: [{ url: storyImage }],
      card: "summary_large_image",
      creator: webStory.authorTwitter || "@pankri",
    },
  };
}

export default async function WebStory({ params }) {
  let webStory;
  try {
    webStory = await getWebStoryById(params.creator);
  } catch (error) {
    console.error("Failed to fetch web story:", error);
    return <div>Web Story not found</div>;
  }

  if (!webStory) {
    return <div>Web Story not found</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://blogify.pankri.com";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": webStory.title,
    "description": webStory.description || "A story from PK Blogify",
    "url": `${baseUrl}/${webStory._id}/web-story`,
    "image": `${baseUrl}/${webStory.coverImage || "blogify.png"}`,
    "publisher": {
      "@type": "Organization",
      "name": "PK Blogify",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/blogify.png`,
        "width": 96, // Adjust to actual dimensions if different
        "height": 96
      }
    },
    "author": {
      "@type": "Person",
      "name": webStory.createdBy || "PK Blogify Contributor"
    },
    "datePublished": new Date(webStory.createdAt).toISOString(),
    "dateModified": new Date(webStory.updatedAt || webStory.createdAt).toISOString(),
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": webStory.storySlides.map((slide, index) => ({
        "@type": "WebPageElement",
        "position": index + 1,
        "name": slide.content ? slide.content.replace(/<[^>]+>/g, "").slice(0, 60) : `Slide ${index + 1}`,
        "image": slide.media ? `${baseUrl}/${slide.media}` : `${baseUrl}/${webStory.coverImage || "blogify.png"}`
      }))
    },
    "potentialAction": {
      "@type": "ReadAction",
      "target": `${baseUrl}/${webStory._id}/web-story`
    }
  };

  return (
    <>
      <link rel="preload" href="https://cdn.ampproject.org/v0.js" as="script" />
      <link rel="preload" href="https://cdn.ampproject.org/v0/amp-story-1.0.js" as="script" />
      <Script src="https://cdn.ampproject.org/v0.js" async strategy="beforeInteractive" />
      <Script
        src="https://cdn.ampproject.org/v0/amp-story-1.0.js"
        async
        custom-element="amp-story"
        strategy="beforeInteractive"
      />
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <WebStoryView params={params} webStory={webStory} />
    </>
  );
}