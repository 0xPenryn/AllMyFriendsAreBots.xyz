import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signOut, useSession } from 'next-auth/react';
import { loadTweets, TweetConfig } from "../utils/tweetHelper";
import Footer from "../components/Footer";

function clearState() {
  localStorage.removeItem("lastScore");
  localStorage.removeItem("highScore");
  localStorage.removeItem("lastTweet");
  localStorage.removeItem("tweetData");
  localStorage.removeItem("lastTweetType");
}

const PreGame: NextPage = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTweets(JSON.parse(localStorage.getItem("lastTweet")!)?.id).then(() => {
      setLoading(false);
    })
  }, [])

  {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME */ }

  return (
    <div className="flex flex-col h-screen justify-between items-center">
      <Head>
        <title>AMFAB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="self-stretch flex flex-nowrap flex-row m-5 mx-8 items-center justify-start">
        <div className="w-1/4 text-left"><button onClick={() => location.href = '/'}>Home</button></div>
        <div className="w-1/2 text-center flex flex-col flex-nowrap items-center justify-center">
          <h3>All My Friends Are Bots</h3>
          {/* <div className="text-center flex flex-row flex-nowrap items-center justify-center">
            {session && session.user?.image && <>
            <img src={session.user.image} className="h-10 mr-2.5 rounded-full" />
              Signed in as {session?.user?.name}
            </>}
          </div> */}
        </div>
        <div className="w-1/4 text-right">
          {session && <>
            <button onClick={() => {
              signOut({ callbackUrl: "/" });
              clearState();
            }}>Sign out</button>
          </>}</div>
      </div>
      <div className="flex flex-col w-screen justify-center items-center text-center">
        <p className="mx-5">Think you know what's AI and what's not? Let's find out! <br /> 
        You'll see one Tweet at a time -- guess if it's real or AI-generated. <br /> 
        See how many you can guess correct in a row!</p>
          {loading && <button className="mx-5 bg-slate-400 text-white rounded-md px-5 py-1.5 mt-5 text-xl">Hold on, loading Tweets...</button>}
          {!loading && <button className="mx-5 bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => location.href = '/play'}>Let's Play!</button>}
          {/* {!loading && <><TweetTimeline tweet={tweet} /></>} */}
          {/* <div className="flex flex-row content-center">
            <button className="mx-5 bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => userGuess(tweet, "human")}>Human</button>
            <button className="mx-5 bg-blue-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => userGuess(tweet, "ai")}>AI</button>
          </div> */}
        </div>
      {/* {loading && <>
        <div />
        <div className="flex flex-col content-center text-center">
          <p className="justify-self-center text-2xl">Loading your session...</p>
          <p className="justify-self-center text-md">If you're stuck here, press the button below.</p>
          <button className="text-center mt-2 bg-slate-400 text-white text-xs rounded-md px-1.5 py-1.5" onClick={() => signOut({ callbackUrl: "/" })}>Return Home</button>
        </div>
      </>} */}
      <Footer />
    </div>
  );
};

export default PreGame;
