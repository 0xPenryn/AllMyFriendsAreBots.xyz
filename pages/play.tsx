import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from 'next-auth/react';
import TweetTimeline from "../components/TweetTimeline";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const [tweetIndex, setTweetIndex] = useState(0);
  const [score, setScore] = useState(0);

  {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME */ }

  return (
    <div className="flex flex-col h-screen justify-between items-center">
      <Head>
        <title>PoP Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="self-stretch flex flex-nowrap flex-row m-5 items-center justify-center">
          <div className="w-1/4"></div>
          <div className="w-1/2 text-center">
            Signed in as {session?.user?.name ?? "User"}
          </div>
          <div className="w-1/4 text-right"><button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button></div>
      </div>
      <div className="flex flex-col w-screen justify-center items-center">
        <TweetTimeline tweetNumber={tweetIndex} />
        <div className="flex flex-row content-center">
          <button className="mx-5 bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => setTweetIndex(tweetIndex + 1)}>Human</button>
          <button className="mx-5 bg-blue-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => setTweetIndex(tweetIndex + 1)}>AI</button>
        </div>
      </div>
      <button className="bg-slate-500 text-white text-lg rounded-md px-5 py-1.5 m-10" onClick={() => location.href = 'https://blog.worldcoin.org'}>Read more about Proof-of-Personhood</button>
    </div>
  );
};

export default Home;
