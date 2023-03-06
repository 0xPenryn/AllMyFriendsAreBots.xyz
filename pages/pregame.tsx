import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signOut, useSession } from 'next-auth/react';
import { loadTweets } from "../utils/tweetHelper";
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
    if (status !== "loading") {
      console.log("loading in initial useEffect")
      loadTweets(session ? true : false, JSON.parse(localStorage.getItem("lastTweet")!)?.id).then(() => {
        setLoading(false);
      })
    }
  }, [])

  useEffect(() => {
    console.log("status effect status:", status)
    if (status == "loading") {
      return
    } else if (status == "authenticated") {
      loadTweets(true, JSON.parse(localStorage.getItem("lastTweet")!)?.id).then((tweets) => {
        setLoading(false);
      })
    } else {
      loadTweets(false, JSON.parse(localStorage.getItem("lastTweet")!)?.id).then((tweets) => {
        setLoading(false);
      })
    }
  }, [status])

  {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME */ }

  return (
    <div className="flex flex-col h-screen justify-between items-center">
      <Head>
        <title>AMFAB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="self-stretch flex flex-nowrap flex-row m-5 mx-8 items-center justify-start">
        <div className="w-1/4 text-left"><button className="hover:underline" onClick={() => location.href = '/'}>Home</button></div>
        <div className="w-1/2 text-center flex flex-col flex-nowrap items-center justify-center">
          <h3>All My Friends Are Bots</h3>
          {/* <div className="text-center flex flex-row flex-nowrap items-center justify-center">
            {session && session.user?.image && <>
            <img src={session.user.image} className="h-10 mr-2.5 rounded-full" />
              Signed in as {session?.user?.name}
            </>}
          </div> */}
        </div>
        <div className="w-1/4 flex flex-row justify-end">
          {session?.user && <>
            <button className="hover:underline" onClick={() => {
              clearState();
              signOut({ callbackUrl: "/" });
            }}>Sign out</button>
            <img src={session.user.image!} className="h-10 ml-2.5 rounded-full" />
          </>}</div>
      </div>
      <div className="flex flex-col w-screen justify-center items-center text-center">
        <p className="mx-5">Think you know what's AI and what's not? Let's find out! <br /> 
        You'll see one Tweet at a time -- guess if it's real or AI-generated. <br /> 
        See how many you can guess correct in a row!</p>
          {loading && <button className="mx-5 bg-slate-400 text-white rounded-md px-5 py-1.5 mt-5 text-xl">Hold on, loading Tweets...</button>}
          {!loading && <button className="mx-5 bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300" onClick={() => location.href = '/play'}>Let's Play!</button>}
        </div>
      <Footer />
    </div>
  );
};

export default PreGame;
