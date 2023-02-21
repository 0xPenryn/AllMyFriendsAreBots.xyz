import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from 'next-auth/react';
import TweetTimeline from "../components/TweetTimeline";
import { useEffect } from "react";

const Endgame: NextPage = () => {
  const { data: session, status } = useSession();

  var lastScore: string | null = "0"
  var highScore: string | null = "0"
  var lastTweet: string | null = "0"
  
  useEffect(() => {
    lastScore = localStorage.getItem("lastScore")
    highScore = localStorage.getItem("highScore")
    lastTweet = localStorage.getItem("lastTweet")
  })

  {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME */ }

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <Head>
        <title>You lost!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session && <>
        <div className="grow-0 self-stretch flex flex-nowrap flex-row m-5 items-center justify-center">
          <div className="w-1/4 text-left"><button onClick={() => location.href = '/'}>Home</button></div>
          <div className="w-1/2 text-center flex flex-row flex-nowrap items-center justify-center">
            {session?.user?.image && <>
              <img src={session.user.image} className="h-10 mr-2.5 rounded-full" />
            </>}
            Signed in as {session?.user?.name}
          </div>
          <div className="w-1/4 text-right"><button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button></div>
        </div>
      </>}
      <div className="grow flex flex-col w-screen justify-center items-center">
        <h1>You lost!<br /></h1>
        <h3 className="mt-5 mx-10 text-base text-center">Your score: {lastScore ?? "unknown"}</h3>
        <h3 className="mt-5 mx-10 text-base text-center">Your high score: {highScore ?? "unknown"}</h3>
        <h3 className="mt-5 mx-10 text-base text-center">The tweet that fooled you:</h3>
        <TweetTimeline tweetNumber={parseInt(lastTweet ?? "0")} ans={"human"} />
      </div>
      <button className="grow-0 bg-slate-500 text-white text-lg rounded-md px-5 py-1.5 m-10" onClick={() => location.href = 'https://worldcoin.org/blog'}>Read more about Proof-of-Personhood</button>
    </div>
  );
};

export default Endgame;
