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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;
  const defaultImage = "blogify.png";

  const defaultMetadata = {
    title: "PK Blogify | Discover Trending Web Stories",
    description: "Explore fresh, engaging web stories on PK Blogify—a platform for creative storytelling.",
    keywords: ["PK Blogify", "web stories", "storytelling", "creative writing", "trending"],
    alternates: { canonical: baseUrl },
    openGraph: {
      title: "PK Blogify | Discover Trending Web Stories",
      description: "Dive into captivating web stories on PK Blogify, designed for mobile-first storytelling.",
      images: [{ url: `/${defaultImage}`, width: 1200, height: 675 }],
      url: baseUrl,
      type: "website",
      site_name: "PK Blogify",
    },
    twitter: {
      card: "summary_large_image",
      creator: "@pankri",
    },
    robots: "max-image-preview:large",
  };

  if (!webStory) return defaultMetadata;

  const storyImage = `${baseUrl}/${webStory.coverImage || defaultImage}`;
  const storyDescription =
    webStory.excerpt || (webStory.description?.slice(0, 160) + "...") || "A trending web story from PK Blogify.";
  const storyUrl = `${baseUrl}/${webStory._id}/web-story`;

  return {
    title: `${webStory.title} | PK Blogify Web Story`,
    description: storyDescription,
    keywords: [...new Set([...(webStory.tags || []), webStory.title.toLowerCase(), "web story", "PK Blogify", "trending stories"])],
    alternates: { canonical: storyUrl },
    openGraph: {
      title: `${webStory.title} | PK Blogify`,
      description: storyDescription,
      images: [{ url: storyImage, width: 1200, height: 675, alt: webStory.title }],
      url: storyUrl,
      type: "article",
      site_name: "PK Blogify",
      locale: "en_US",
      published_time: new Date(webStory.createdAt).toISOString(),
    },
    twitter: {
      title: webStory.title,
      description: storyDescription,
      images: [{ url: storyImage, alt: webStory.title }],
      card: "summary_large_image",
      creator: webStory.authorTwitter || "@pankri",
    },
    robots: "max-image-preview:large",
  };
}

export default async function WebStory({ params }) {
  let webStory;
  try {
    webStory = await getWebStoryById(params.creator);
  } catch (error) {
    console.error("Failed to fetch web story:", error);
    return <div className="p-4 text-red-500">Web Story not found</div>;
  }

  if (!webStory) {
    return <div className="p-4 text-red-500">Web Story not found</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${"https://blogify.pankri.com"}/${webStory._id}/web-story`,
    url: `${'https://blogify.pankri.com'}/${webStory._id}/web-story`,
    headline: webStory.title,
    description: webStory.excerpt || webStory.description || "A trending web story from PK Blogify",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      url: baseUrl,
      name: "PK Blogify",
      publisher: { "@type": "Organization", name: "PK Blogify" },
    },
    image: {
      "@type": "ImageObject",
      url: `${baseUrl}/${webStory.coverImage || "blogify.png"}`,
      width: 1200,
      height: 675,
    },
    publisher: {
      "@type": "Organization",
      name: "PK Blogify",
      url: baseUrl,
      logo: { "@type": "ImageObject", url: `/blogify.png`, width: 96, height: 96 },
    },
    author: {
      "@type": "Person",
      name: webStory.createdBy || "PK Blogify Contributor",
    },
    datePublished: new Date(webStory.createdAt).toISOString(),
    dateModified: new Date(webStory.updatedAt || webStory.createdAt).toISOString(),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://blogify.pankri.com" },
        { "@type": "ListItem", position: 2, name: "Web Stories", item: `${"https://blogify.pankri.com"}/web-stories` },
        { "@type": "ListItem", position: 3, name: webStory.title, item: `${"https://blogify.pankri.com"}/${webStory._id}/web-story` },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: `${webStory.title} Slides`,
      description: "Slides in this trending web story",
      itemListElement: webStory.storySlides.map((slide, index) => ({
        "@type": "WebPageElement",
        position: index + 1,
        name: slide.content ? slide.content.replace(/<[^>]+>/g, "").slice(0, 60) + "..." : `Slide ${index + 1}`,
        image: slide.media ? `${baseUrl}/${slide.media}` : `${baseUrl}/${webStory.coverImage || "blogify.png"}`,
      })),
    },
    potentialAction: {
      "@type": "ReadAction",
      target: `${"https://blogify.pankri.com"}/${webStory._id}/web-story`,
    },
    articleSection: webStory.category || "Stories",
    speaksAbout: webStory.tags || [],
  };

  return (
    <>
      <link
        rel="preload"
        href="https://cdn.ampproject.org/v0/amp-story-1.0.js"
        as="script"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href={`${baseUrl}/${webStory.coverImage || "blogify.png"}`}
        as="image"
        fetchpriority="high"
      />
      <Script
        src="https://cdn.ampproject.org/v0.js"
        async
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
      <Script
        src="https://cdn.ampproject.org/v0/amp-story-1.0.js"
        async
        custom-element="amp-story"
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <WebStoryView params={{ creator: webStory._id }} webStory={webStory} />
    </>
  );
}

export const revalidate = 3600;