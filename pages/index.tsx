import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from 'next-auth/react';
import FakeTweet from "fake-tweet";
import TweetTimeline from "../components/TweetTimeline";

const Home: NextPage = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const blankTweet = { // used for fake tweet testing
    user: {
      nickname: "twitter",
      name: "Twitter",
      avatar: "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg",
      verified: false,
      locked: false
    },
    display: "default",
    text: "This is a placeholder tweet.",
    image: "",
    date: "3:32 PM · Feb 14, 1997",
    app: "Twitter for iPhone",
    retweets: 1,
    quotedTweets: 0,
    likes: 5
  };

  const getTweets = async () => {
    const homeTimeline = await fetch("/api/twitter/timeline")
      .then(
        (response) => response.json()
      );
  
    return await homeTimeline;
  };

  // useEffect(() => {
  //   setLoading(true);
  //   getTweets().then((data) => {
  //     setData(data);
  //     setLoading(false);
  //   });
  // }, [data]);

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

      <TweetTimeline />
    </div>
  );
};

export default Home;
