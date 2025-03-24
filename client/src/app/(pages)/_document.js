import { Html, Head, Main, NextScript } from "next/document";

const criticalCSS = `
  body {
    margin: 0;
    font-family: Arial, sans-serif;
  }
  amp-story {
    background: #fff;
  }
  .slide-content {
    background: rgba(255, 255, 255, 0.6);
    padding: 8px;
    border-radius: 4px;
    color: #000;
  }
  .slide-content p {
    margin: 0;
  }
  a {
    color: #007bff;
    text-decoration: none;
    display: block;
    margin-top: 8px;
  }
`;

export default function Document({ __NEXT_DATA__ }) {
  const isAmpPage = __NEXT_DATA__.page.includes("/[creator]/web-story");

  return (
    <Html lang="en" {...(isAmpPage ? { amp: "" } : {})}>
      <Head>
        {isAmpPage && (
          <>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width,minimum-scale=1,initial-scale=1"
            />
            <style amp-custom="">{criticalCSS}</style>
            <style amp-boilerplate="">{`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}</style>
            <noscript>
              <style amp-boilerplate="">{`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}</style>
            </noscript>
          </>
        )}
      </Head>
      <body>
        <Main />
        {isAmpPage ? null : <NextScript />}
      </body>
    </Html>
  );
}