import { getMediaById } from "@/api/media.api";
import Image from "next/image";
import Head from "next/head";

export async function generateMetadata({ params }) {
  try {
    const media = await getMediaById(params.creator);

    if (!media || !media.media) {
      return {
        title: "Media Not Found | PK Blogify",
        description: "The requested media content is not available.",
      };
    }

    const tags = Array.isArray(media.tags)
      ? media.tags
      : typeof media.tags === "string"
      ? media.tags.split(",")
      : [];

    const baseUrl = "https://blogify.pankri.com";
    const imageBaseUrl = "https://server.blogify.pankri.com";
    const mediaUrl = `${imageBaseUrl}/${media.media}`;

    return {
      title: `${media.title || "Media"} | PK Blogify`,
      description: media.description || "View this media content on PK Blogify.",
      keywords: [...new Set([...tags, "media", "PK Blogify", media.title?.toLowerCase()])].join(", "),
      alternates: {
        canonical: `${baseUrl}/${media._id}/media`,
      },
      openGraph: {
        title: `${media.title || "Media"} | PK Blogify`,
        description: media.description || "View this media content on PK Blogify.",
        url: `${baseUrl}/${media._id}/media`,
        images: [
          {
            url: mediaUrl,
            alt: media.title || "Media Image",
            width: 600,
            height: 400,
          },
        ],
        type: "article", // Could also use "website" or "image" depending on context
        site_name: "PK Blogify",
        locale: "en_US", // Added locale
        // app_id: "YOUR_FACEBOOK_APP_ID_HERE", // Fix: Added fb:app_id
      },
      twitter: {
        card: "summary_large_image",
        title: media.title || "Media",
        description: media.description || "View this media content on PK Blogify.",
        images: [{ url: mediaUrl, alt: media.title || "Media Image" }],
        creator:  "@pankri",
      },
      robots: "max-image-preview:large, index, follow",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | PK Blogify",
      description: "An error occurred while fetching media metadata.",
    };
  }
}

const Media = async ({ params }) => {
  try {
    const media = await getMediaById(params.creator);

    if (!media || !media.media) {
      return (
        <div className="text-center text-gray-500">
          Media not found or unavailable.
        </div>
      );
    }

    const tags = Array.isArray(media.tags)
      ? media.tags
      : typeof media.tags === "string"
      ? media.tags.split(",")
      : [];

    const baseUrl = "https://blogify.pankri.com";
    const imageBaseUrl = "https://server.blogify.pankri.com";
    const mediaUrl = `${imageBaseUrl}/${media.media}`;

    // JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "@id": `${baseUrl}/${media._id}/media`,
      name: media.title || "Media",
      description: media.description || "Media content hosted on PK Blogify.",
      contentUrl: mediaUrl,
      uploadDate: media.uploadDate || new Date().toISOString(),
      author: {
        "@type": "Person",
        name: media.createdBy || "PK Blogify Contributor",
        url: media.createdBy 
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
      width: 600, // Added recommended field
      height: 400, // Added recommended field
      thumbnailUrl: mediaUrl, // Added recommended field
      keywords: tags.join(", "),
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        url: baseUrl,
        name: "PK Blogify",
        publisher: { "@type": "Organization", name: "PK Blogify" },
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "Media", item: `${baseUrl}/${media._id}/media` },
        ],
      },
    };

    return (
      <>
        <Head>
          <title>{media.title || "Media"} | PK Blogify</title>
          <meta name="description" content={media.description || "Media content on PK Blogify"} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <link rel="preload" href={mediaUrl} as="image" fetchPriority="high" />
        </Head>
        <div className="flex flex-col items-center p-4 space-y-4">
          <Image
            src={mediaUrl}
            alt={media.title || "Media"}
            width={600}
            height={400}
            className="rounded-md shadow-md"
            priority // Optimize loading for above-the-fold content
          />
          <div className="text-center space-y-2">
            <h1 className="text-lg font-bold text-gray-800">{media.title}</h1>
            <p className="text-sm text-gray-600">{media.description}</p>
            {tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching media:", error);
    return (
      <div className="text-center text-red-500">
        An error occurred while loading the media.
      </div>
    );
  }
};

export default Media;