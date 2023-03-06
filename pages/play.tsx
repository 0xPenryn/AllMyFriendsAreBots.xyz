import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signOut, useSession } from 'next-auth/react';
import { loadTweets, makeAITweet, TweetConfig } from "../utils/tweetHelper";
import toast, { Toaster } from 'react-hot-toast';
import Footer from "../components/Footer";
import FakeTweet from "fake-tweet";


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
    console.log("first load status:", status)
    if (status !== "loading") {
      loadTweets(session ? true : false).then(() => {
        setLoading(false);
      })
    }
  }, [])

  useEffect(() => {
    console.log("status effect status:", status)
    if (status == "authenticated") {
      loadTweets(true).then((tweets) => {
        setTweets(tweets);
        setLoading(false);
      })
    } else {
      loadTweets(false).then((tweets) => {
        setTweets(tweets);
        setLoading(false);
      })
    }
  }, [status])

  useEffect(() => {
    async function doAi() {
      if (!session) {
        return
      } else if (Math.random() >= 0.5) {
        await makeAITweet(tweets.shift()!).then((tweet) => {
          tweets.unshift(tweet);
        })
      }
    }
    async function loadMoreTweets() {
      if (session) {
        loadTweets(true, tweets[0].id).then((tweets) => {
          setTweets(tweets);
        })
      } else {
        location.href = "/outoftweets"
      }
    }
    doAi();
    if (tweets.length < 5 && !loading) {
      loadMoreTweets();
    }
  }, [tweetId])

  var tweet = tweets.shift()!;

  const notifyCorrect = () => toast('That was correct!', {
    "duration": 1000,
  });

  function userGuess(tweet: TweetConfig, userAns: string) {
    setLoading(true);
    localStorage.setItem("tweetData", JSON.stringify(tweets))
    if ((userAns == "ai") == tweet?.AI) {
      notifyCorrect();
      setTweetId(tweet.id)
      setScore(score + 1)
    } else {
      // store last score
      localStorage.setItem("lastScore", score.toString())
      // store highest score, if needed
      if (score >= parseInt(localStorage.getItem("highScore") ?? "0")) {
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
        <title>AMFAB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="self-stretch flex flex-nowrap flex-row m-5 mx-8 items-center justify-start">
        <div className="w-1/4 text-left"><button className="hover:underline" onClick={() => location.href = '/'}>Home</button></div>
        <div className="w-1/2 font-mono text-center flex flex-col flex-nowrap items-center justify-center">
          <h3>All My Friends Are Bots</h3>
        </div>
        <div className="w-1/4 flex flex-row justify-end">
          {session?.user && <>
            <button className="hover:underline" onClick={() => {
              clearState();
              signOut({ callbackUrl: "/" });
            }}>Sign out</button>
            <img src={session.user.image!} className="hidden md:inline h-10 ml-2.5 rounded-full" />
          </>}</div>
      </div>
      <div className="flex flex-col w-screen justify-center items-center">
        <div className='w-full flex flex-row justify-center text-center my-5'>
          <div className="mx-5 bg-slate-400 text-white rounded-md px-3 py-1.5 mt-5 text-l md:text-xl">Your Score: <br/> {score}</div>
          <div className="mx-5 bg-slate-400 text-white rounded-md px-3 py-1.5 mt-5 text-l md:text-xl">High Score: <br/> {highScore}</div>
        </div>
        {loading && <p>Loading Tweet...</p>}
        {!loading && <>
          <FakeTweet config={tweet} />
        </>}
        <div className="flex flex-row w-1/2 content-center">
          <button className="transition w-1/2 mx-5 bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl hover:bg-green-600 active:bg-green-700 hover:outline-none hover:ring hover:ring-green-300" onClick={() => userGuess(tweet, "human")}>Human</button>
          <button className="transition w-1/2 mx-5 bg-blue-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl hover:bg-blue-600 active:bg-blue-700 hover:outline-none hover:ring hover:ring-blue-300" onClick={() => userGuess(tweet, "ai")}>AI</button>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Play;
