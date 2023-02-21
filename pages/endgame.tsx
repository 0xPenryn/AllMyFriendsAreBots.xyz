import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from 'next-auth/react';
import TweetTimeline from "../components/TweetTimeline";
import { useEffect } from "react";
import { useState } from "react";

function clearState() {
  localStorage.removeItem("lastScore");
  localStorage.removeItem("highScore");
  localStorage.removeItem("lastTweet");
  localStorage.removeItem("tweetData");
  localStorage.removeItem("lastTweetType");
}

const Endgame: NextPage = () => {
  const { data: session, status } = useSession();

  const [lastScore, setLastScore] = useState("0");
  const [highScore, setHighScore] = useState("0");
  const [lastTweet, setLastTweet] = useState("0");
  const [lastTweetType, setLastTweetType] = useState("human");

  useEffect(() => {
    function checkUserData() {
      setLastScore(localStorage.getItem("lastScore")!)
      setHighScore(localStorage.getItem("highScore")!)
      setLastTweet(localStorage.getItem("lastTweet")!)
      setLastTweetType(localStorage.getItem("lastTweetType")!)
    }

    window.addEventListener('load', checkUserData)
    console.log(lastScore, highScore, lastTweet, "end of effect")
    return () => {
      window.removeEventListener('load', checkUserData)
      console.log(lastScore, highScore, lastTweet, "end of listener")
    }
  }, [])

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
          <div className="w-1/4 text-right"><button onClick={() => {
            signOut({ callbackUrl: "/" });
            clearState();
          }}>Sign out</button></div>
        </div>
      </>}
      <div className="grow flex flex-col w-screen justify-center items-center">
        <h1>You lost!<br /></h1>
        <h3 className="mt-2 mx-10 text-base text-center">Your score: {lastScore ?? "unknown"}</h3>
        <h3 className="mt-2 mx-10 text-base text-center">Your high score: {highScore ?? "unknown"}</h3>
        <h3 className="mt-2 mx-10 text-base text-center">This is the Tweet you got wrong:</h3>
        <TweetTimeline tweetNumber={parseInt(lastTweet)} ans={lastTweetType} />
        {(lastTweetType == "ai") && <>
          <h3 className="mt-2 mx-10 text-base text-center">Here's the actual Tweet:</h3>
          <TweetTimeline tweetNumber={parseInt(lastTweet)} ans={"real"} />
        </>}
        {(lastTweetType == "real") && <>
          <h3 className="mt-2 mx-10 text-base text-center">That's a real human's Tweet!</h3>
        </>}
        <button className="bg-slate-500 text-white text-lg rounded-md px-5 py-1.5 m-10" onClick={() => location.href = '/play'}>Play Again</button>
      </div>
      <button className="grow-0 bg-slate-500 text-white text-lg rounded-md px-5 py-1.5 m-10" onClick={() => location.href = 'https://worldcoin.org/blog'}>Read more about Proof-of-Personhood</button>
    </div>
  );
};

export default Endgame;
