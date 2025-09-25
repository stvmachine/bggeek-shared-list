import NextDocument, { Head, Html, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="description" content="Shared Shelf - Organize and share your board game collection" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#0B2540" />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/img/logo.svg" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Shared Shelf" />
          <meta property="og:description" content="Organize and share your board game collection" />
          <meta property="og:image" content="/img/logo.svg" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Shared Shelf" />
          <meta name="twitter:description" content="Organize and share your board game collection" />
          <meta name="twitter:image" content="/img/logo.svg" />
          
          <title>Shared Shelf</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
