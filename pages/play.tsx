import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { signOut, useSession } from 'next-auth/react';
import TweetTimeline from "../components/TweetTimeline";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const [tweetIndex, setTweetIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAns, setCorrectAns] = useState("human");

  const userGuess = (userAns: string) => {
    if (userAns === correctAns) {
      var nextAns = Math.random() > 0.5 ? "human" : "ai";
      setCorrectAns(nextAns);
      setTweetIndex(tweetIndex + 1)
      setScore(score + 1)
    } else {
      // store last score
      // store highest score, if needed
      // store tweet that fooled them
      setScore(score + 1)
      alert("You lost!")
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
          <div className="w-1/4 text-right"><button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button></div>
        </div>
        <div className="flex flex-col w-screen justify-center items-center">
          <p>Your Score: {score}</p>
          <TweetTimeline tweetNumber={tweetIndex} ans={correctAns} />
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

export default Home;
