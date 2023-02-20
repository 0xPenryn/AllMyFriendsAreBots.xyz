import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from 'next-auth/react';
import FakeTweet from "fake-tweet";
import TweetTimeline from "../components/TweetTimeline";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const [tweetIndex, setTweetIndex] = useState(0);

  const getTweets = async () => {
    const homeTimeline = await fetch("/api/twitter/timeline")
      .then(
        (response) => response.json()
      );
    return await homeTimeline;
  };

  return (
    <div className="flex flex-col items-center">
      {/* THIS HANDLES SIGNING IN W TWITTER */}
      {!session && <>
        Not signed in <br />
        <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
      </>}
      {session && <>
        Signed in as {session.user?.name ?? "no user object"} <br />
        {/* Signed in<br /> */}
        <button onClick={() => signOut()}>Sign out</button>
        {/* fake tweet generator for timeline-style view */}
      </>}
      {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME */}

      <Head>
        <title>is this tweet ai? idk</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={() => setTweetIndex(tweetIndex + 1)}>Next Tweet!</button>
      <TweetTimeline tweetNumber={tweetIndex} />
    </div>
  );
};

export default Home;
