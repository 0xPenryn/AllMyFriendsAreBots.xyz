import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signOut, useSession } from 'next-auth/react';
import TweetTimeline from "../components/TweetTimeline";

function clearState() {
  localStorage.removeItem("lastScore");
  localStorage.removeItem("highScore");
  localStorage.removeItem("lastTweet");
  localStorage.removeItem("tweetData");
  localStorage.removeItem("lastTweetType");
}

const Play: NextPage = () => {
  const { data: session, status } = useSession();
  const [tweetIndex, setTweetIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAns, setCorrectAns] = useState("human");

  useEffect(() => {
    function checkUserData() {
      setTweetIndex(JSON.parse(localStorage.getItem("lastTweet")!) + 1) ;
    }

    checkUserData()
    console.log(tweetIndex, "end of effect")
    // return () => {
    //   // window.removeEventListener('load', checkUserData)
    //   console.log(tweetIndex, "end of listener")
    // }
  }, [])

  function userGuess(userAns: string) {
    if (userAns === correctAns) {
      var nextAns = Math.random() > 0.1 ? "human" : "ai";
      setCorrectAns(nextAns);
      setTweetIndex(tweetIndex + 1)
      setScore(score + 1)
    } else {
      // store last score
      localStorage.setItem("lastScore", score.toString())
      // store highest score, if needed
      if (score > parseInt(localStorage.getItem("highScore") ?? "0")) {
        localStorage.setItem("highScore", score.toString())
      }
      // store tweet that fooled them
      localStorage.setItem("lastTweet", tweetIndex.toString())
      localStorage.setItem("lastTweetType", correctAns)
      setScore(0)
      // alert("You lost!")
      location.href = '/endgame'
    }
  };

  {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME */ }

  return (
    <div className="flex flex-col h-screen justify-between items-center">
      <Head>
        <title>PoP Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session && <>
        <div className="self-stretch flex flex-nowrap flex-row m-5 mx-8 items-center justify-center">
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
        <div className="flex flex-col w-screen justify-center items-center">
          <p>Your Score: {score}</p>
          <TweetTimeline tweetNumber={tweetIndex} />
          <div className="flex flex-row content-center">
            <button className="mx-5 bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => userGuess("human")}>Human</button>
            <button className="mx-5 bg-blue-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => userGuess("ai")}>AI</button>
          </div>
        </div>
      </>}
      {!session && <>
        <div />
        <div className="flex flex-col">
          <p className="justify-self-center text-2xl">You must log in to play.</p>
          <button className="text-center mt-2 bg-slate-400 text-white rounded-md px-1.5 py-1.5" onClick={() => signOut({ callbackUrl: "/" })}>Sign out and return Home</button>
        </div>
      </>}
      <button className="bg-slate-500 text-white text-lg rounded-md px-5 py-1.5 m-10" onClick={() => location.href = 'https://worldcoin.org/blog'}>Read more about Proof-of-Personhood</button>
    </div>
  );
};

export default Play;
