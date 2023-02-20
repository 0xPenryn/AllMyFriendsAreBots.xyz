import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from 'next-auth/react';
import TweetTimeline from "../components/TweetTimeline";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const [tweetIndex, setTweetIndex] = useState(0);
  const [score, setScore] = useState(0);

  {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME */}

  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>is this tweet ai? idk</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!session && <>
        {/* Not signed in.<br /> */}
        <h1>Personhood is hard to prove. <br /></h1>
        <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
      </>}
      {/* {session && <> */}
      Signed in as {session?.user?.name ?? "no user object"} <br />
      <button onClick={() => signOut()}>Sign out</button> <br />
      <TweetTimeline tweetNumber={tweetIndex} />
      <div className="flex flex-row">
        <button className="mx-5" onClick={() => setTweetIndex(tweetIndex + 1)}>Human</button>
        <button className="mx-5" onClick={() => setTweetIndex(tweetIndex + 1)}>AI</button>
      </div>
      {/* </>} */}
    </div>
  );
};

export default Home;
