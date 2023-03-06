import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from 'next-auth/react';
import TweetTimeline from "../components/TweetTimeline";
import { useState, useEffect } from "react";
import { loadTweets, makeAITweet, TweetConfig } from "../utils/tweetHelper";
import Footer from "../components/Footer";

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
  const [lastTweet, setLastTweet] = useState<TweetConfig>();
  const [lastTweetType, setLastTweetType] = useState("human");

  useEffect(() => {
    function checkUserData() {
      setLastScore(localStorage.getItem("lastScore")!)
      setHighScore(localStorage.getItem("highScore")!)
      setLastTweet(JSON.parse(localStorage.getItem("lastTweet")!))
      setLastTweetType(localStorage.getItem("lastTweetType")!)
    }

    // window.addEventListener('load', checkUserData)
    checkUserData()
    // console.log(lastScore, highScore, lastTweet, "end of effect")
    // return () => {
    //   // window.removeEventListener('load', checkUserData)
    //   console.log(lastScore, highScore, lastTweet, "end of listener")
    // }
  }, [])

  const tweetText = 'See if you can tell which Tweets are real and which are AI-generated!'
  const tweetLink = 'https://AllMyFriendsAreBots.xyz'

  {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME */ }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
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
              clearState();
              signOut({ callbackUrl: "/" });
            }}>Sign out</button>
          </>}</div>
      </div>
      <div className="grow flex flex-col w-screen justify-center items-center">
        <h1>You ran out of Tweets!<br /></h1>
        <h3 className="mt-2 mx-10 text-base text-center">We can only show you so many Tweets unless you sign in.</h3>
        {(lastScore) && <h3 className="mt-2 mx-10 text-base text-center">Seems like you're doing well though -- {lastScore} is a great score!</h3>}
        <h3 className="mt-2 mx-10 text-base text-center">See if you're this good on Tweets from accounts you follow...</h3>
        <div className="flex flex-row content-center">
          <button className="bg-slate-500 text-white text-lg rounded-md px-5 py-1.5 m-5" onClick={() => {
            clearState();
            signIn("twitter", {
              callbackUrl: `${window.location.origin}/pregame`,
            });
          }}>Sign In and Play Again</button>
          <button className="bg-sky-500 text-white text-lg rounded-md px-5 py-1.5 m-5" onClick={() => location.href = 'https://twitter.com/intent/tweet' + `?text=${encodeURIComponent(tweetText)}`+ ` ${encodeURIComponent(tweetLink)}`}>Share on Twitter</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Endgame;
