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
          <meta property="og:site_name" content="AllMyFriendsAreBots.xyz" />
          <meta
            property="og:description"
            content="Can you guess which Tweets are real and which are AI-generated?"
          />
          <meta property="og:title" content="All My Friends Are Bots" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="All My Friends Are Bots" />
          <meta
            name="twitter:description"
            content="Can you guess which Tweets are real and which are AI-generated?"
          />
          <meta
            property="og:image"
            content="https://AllMyFriendsAreBots.xyz/amfabtwt.png"
          />
          <meta
            name="twitter:image"
            content="https://AllMyFriendsAreBots.xyz/amfabtwt.png"
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
