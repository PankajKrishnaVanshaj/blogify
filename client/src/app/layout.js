import "./globals.css";

export const metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL("https://blogify.pankri.com"),
  title: {
    default: "PK Blogify | Explore, Write, and Connect",
    template: "%s - PK Blogify | Explore, Write, and Connect",
  },
  description:
    "PK Blogify is a dynamic social media blog platform designed to bring creators, writers, and readers together in one engaging space. Share your thoughts, publish compelling articles, and explore diverse topics across various categories. Whether you're here to follow your favorite bloggers, discover trending posts, or engage in meaningful discussions, PK Blogify offers a seamless and interactive experience tailored to the modern storyteller.",
  keywords: [
    "PK Blogify",
    "blogify",
    "blogify pk ",
    "pankri blogify",
    "blogify pankri",
    "pankri",
    "pk",
    "blog platform",
    "social media blog",
    "write articles",
    "trending posts",
    "bloggers",
    "readers",
    "interactive experience",
    "content creators",
  ],
  openGraph: {
    title: "PK Blogify | Explore, Write, and Connect",
    description:
      "Join PK Blogify, the platform for creators and readers to connect, explore trending posts, and engage in meaningful discussions across various categories.",
    images: [
      {
        url: "/blogify.png",
        width: 1200,
        height: 630,
        alt: "PK Blogify social media blog platform",
      },
    ],
    type: "website",
    url: "http://blogify.pankri.com",
  },
  twitter: {
    title: "PK Blogify | Explore, Write, and Connect",
    description:
      "Discover PK Blogify, a social media blog platform for creators, writers, and readers to connect and explore diverse content.",
    images: "/blogify.png",
    card: "summary_large_image",
    creator: "pankri",
  },
};

export default function RootLayout({ children }) {
  const globalJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PK Blogify",
    url: "https://blogify.pankri.com",
    description:
      "PK Blogify is a dynamic social media blog platform designed to bring creators, writers, and readers together in one engaging space. Share your thoughts, publish compelling articles, and explore diverse topics across various categories. Whether you're here to follow your favorite bloggers, discover trending posts, or engage in meaningful discussions, PK Blogify offers a seamless and interactive experience tailored to the modern storyteller.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://blogify.pankri.com/search?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalJsonLd),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
