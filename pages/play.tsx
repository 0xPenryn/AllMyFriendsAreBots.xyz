import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signOut, useSession } from 'next-auth/react';
import TweetTimeline from "../components/TweetTimeline";
import { loadTweets, makeAITweet, TweetConfig } from "../utils/tweetHelper";

function clearState() {
  localStorage.removeItem("lastScore");
  localStorage.removeItem("highScore");
  localStorage.removeItem("lastTweet");
  localStorage.removeItem("tweetData");
  localStorage.removeItem("lastTweetType");
}

const Play: NextPage = () => {
  const { data: session, status } = useSession();
  const [tweetId, setTweetId] = useState("0");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [tweets, setTweets] = useState<TweetConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHighScore(parseInt(localStorage.getItem("highScore") ?? "0"));
    loadTweets().then((tweets) => {
      setTweets(tweets);
      setLoading(false);
    })
  }, [])

  useEffect(() => {
    async function doAi() {
      if (Math.random() >= 0.5) {
        tweets.unshift(await makeAITweet(tweets.shift()!))
      }
    }
    async function loadMoreTweets() {
        loadTweets(tweets[0].id).then((tweets) => {
          setTweets(tweets);
        })
    }
    doAi();
    if (tweets.length == 2) {
      loadMoreTweets();
    }
  }, [tweetId])

  var tweet = tweets.shift()!;

  function userGuess(tweet: TweetConfig, userAns: string) {
    setLoading(true);
    localStorage.setItem("tweetData", JSON.stringify(tweets))
    if ((userAns == "ai") == tweet?.AI) {
      setTweetId(tweet.id)
      setScore(score + 1)
    } else {
      // store last score
      localStorage.setItem("lastScore", score.toString())
      // store highest score, if needed
      if (score > parseInt(localStorage.getItem("highScore") ?? "0")) {
        localStorage.setItem("highScore", score.toString())
      }
      // store tweet that fooled them
      localStorage.setItem("lastTweet", JSON.stringify(tweet))
      localStorage.setItem("lastTweetType", (userAns == "ai") ? "human" : "ai") // if userAns is "ai", then the tweet was human bc they're only here if they were wrong
      setScore(0)
      // alert("You lost!")
      location.href = '/endgame'
    }
    setLoading(false);
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
          <p>Your Previous Best Score: {highScore}</p>
          {loading && <p>Loading Tweet...</p>}
          {!loading && <><TweetTimeline tweet={tweet} /></>}
          <div className="flex flex-row content-center">
            <button className="mx-5 bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => userGuess(tweet, "human")}>Human</button>
            <button className="mx-5 bg-blue-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => userGuess(tweet, "ai")}>AI</button>
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
