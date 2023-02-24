import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Can you guess which Tweets are real and which are AI-generated?"
          />
          <meta property="og:site_name" content="wld-test.vercel.app" />
          <meta
            property="og:description"
            content="Can you guess which Tweets are real and which are AI-generated?"
          />
          <meta property="og:title" content="Proof-of-Personhood Game" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Proof-of-Personhood Game" />
          <meta
            name="twitter:description"
            content="Can you guess which Tweets are real and which are AI-generated?"
          />
          <meta
            property="og:image"
            content="https://wld-test.vercel.app/wld.jpg"
          />
          <meta
            name="twitter:image"
            content="https://wld-test.vercel.app/wld.jpg"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
