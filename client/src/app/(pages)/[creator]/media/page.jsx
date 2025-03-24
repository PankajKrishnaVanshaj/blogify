import { getMediaById } from "@/api/media.api";
import Image from "next/image";
import Head from "next/head";

export async function generateMetadata({ params }) {
  try {
    const media = await getMediaById(params.creator);

    if (!media || !media.media) {
      return {
        title: "Media Not Found",
        description: "The requested media content is not available.",
      };
    }

    const tags = Array.isArray(media.tags)
      ? media.tags
      : typeof media.tags === "string"
      ? media.tags.split(",")
      : [];

    return {
      title: media.title || "Media",
      description: media.description || "Media content",
      keywords: tags.join(", "),
      openGraph: {
        title: media.title || "Media",
        description: media.description || "Media content",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${media.media}`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${media.media}`,
            alt: media.title || "Media Image",
            width: 600,
            height: 400,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while fetching metadata.",
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

    // JSON-LD structured data
    const jsonLd = {
      "@context": "http://schema.org",
      "@type": "MediaObject",
      "name": media.title || "Media",
      "description": media.description || "",
      "contentUrl": `${process.env.NEXT_PUBLIC_BASE_URL}/${media.media}`,
      "uploadDate": media.uploadDate || new Date().toISOString(),
      author: {
        "@type": "Person",
        name: media.createdBy || "PK Blogify Contributor",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${media.media || "blogify.png"}`,

      },
      "keywords": tags.join(", "),
    };

    return (
      <>
        <Head>
          <title>{media.title || "Media"}</title>
          <meta name="description" content={media.description || "Media content"} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </Head>
        <div className="flex flex-col items-center p-4 space-y-4">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${media.media}`}
            alt={media.title || "Media"}
            width={600}
            height={400}
            className="rounded-md shadow-md"
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
