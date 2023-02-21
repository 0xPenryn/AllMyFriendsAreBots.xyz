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
    <div className="flex flex-col h-screen justify-center items-center">
      <Head>
        <title>is this tweet ai? idk</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="self-stretch flex flex-nowrap flex-row m-5 items-center justify-center">
        {session && <>
          <div className="w-1/4"></div>
          <div className="w-1/2 text-center">
            Signed in as {session?.user?.name ?? "User"}
          </div>
          <div className="w-1/4 text-right"><button onClick={() => signOut()}>Sign out</button></div>
        </>}
      </div>
      <div className="flex flex-col h-screen justify-center items-center">
        {!session && <>
          <h1>Personhood is hard to prove. <br /></h1>
          <button className="bg-sky-400 text-white rounded-md px-5 py-1.5 mt-10 text-xl" onClick={() => signIn("twitter")}>Sign in with Twitter</button>
          <button className="bg-slate-400 text-slate-700 opacity-80 text-xs rounded-md px-5 py-1.5 mt-4">Play without Signing In</button>
        </>}
        <div className="">
          <TweetTimeline tweetNumber={tweetIndex} />
        </div> <br />
        <div className="flex flex-row">
          <button className="mx-5" onClick={() => setTweetIndex(tweetIndex + 1)}>Human</button>
          <button className="mx-5" onClick={() => setTweetIndex(tweetIndex + 1)}>AI</button>
        </div>
      </div>
      <button className="bg-slate-400 text-white rounded-md px-5 py-1.5 m-10" onClick={() => location.href = 'https://google.com'}>Read more</button>
    </div>
  );
};

export default Home;
