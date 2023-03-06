import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signOut, useSession } from 'next-auth/react';
import TweetTimeline from "../components/TweetTimeline";
import { loadTweets, makeAITweet, TweetConfig } from "../utils/tweetHelper";
import toast, { Toaster } from 'react-hot-toast';
import Footer from "../components/Footer";

function clearState() {
  localStorage.removeItem("lastScore");
  localStorage.removeItem("highScore");
  localStorage.removeItem("lastTweet");
  localStorage.removeItem("tweetData");
  localStorage.removeItem("lastTweetType");
}


async function doAi(tweet: TweetConfig) {
  if (Math.random() >= 0.5) {
    const tweetAi = await makeAITweet(tweet)
    return tweetAi;
  } else {
    return tweet;
  }
}

async function Aify() {
  const data = await fetch("https://allmyfriendsarebots.xyz/noSignInTweets.json")
  const json: Array<TweetConfig> = await data.json()
  var tweetList = await Promise.all(json.map(async (tweet: TweetConfig) => await doAi(tweet)))
  localStorage.setItem("AITWEETSTUFF", JSON.stringify(tweetList))
  return tweetList;
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
    if (session) {
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

  }, [])


  useEffect(() => {
    async function doAi() {
      if (Math.random() >= 0.5) {
        await makeAITweet(tweets.shift()!).then((tweet) => {
          tweets.unshift(tweet);
        })
      }
    }
    async function loadMoreTweets() {
        loadTweets(true, tweets[0].id).then((tweets) => {
          setTweets(tweets);
        })
    }
    doAi();
    if (tweets.length == 2 && session) {
      loadMoreTweets();
    }
  }, [tweetId])

  var tweet = tweets.shift()!;

  const notifyCorrect = () => toast('That was correct!',{
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
      {/* {session && <> */}
        <div className="flex flex-col w-screen justify-center items-center">
          <p>Your Score: {score}</p>
          <p>Your Previous Best Score: {highScore}</p>
          {loading && <p>Loading Tweet...</p>}
          {!loading && <>
          {/* <div className="flex justify-center w-screen"> */}
            <TweetTimeline tweet={tweet} />
          {/* </div> */}
          </>}
          <div className="flex flex-row content-center">
            <button className="mx-5 bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => userGuess(tweet, "human")}>Human</button>
            <button className="mx-5 bg-blue-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => userGuess(tweet, "ai")}>AI</button>
          </div>
        </div>
      {/* </>} */}
      {/* {!session && <>
        <div />
        <div className="flex flex-col content-center text-center">
          <p className="justify-self-center text-2xl">Loading your session...</p>
          <p className="justify-self-center text-md">If you're stuck here, press the button below.</p>
          <button className="text-center mt-2 bg-slate-400 text-white text-xs rounded-md px-1.5 py-1.5" onClick={() => signOut({ callbackUrl: "/" })}>Return Home</button>
        </div>
      </>} */}
      {/* <button className="bg-violet-400 text-white text-lg rounded-md px-5 py-1.5 m-10" onClick={() => location.href = 'https://worldcoin.org/blog'}>Read more about Proof-of-Personhood</button> */}
      <Footer />
      <Toaster />
    </div>
  );
};

export default Play;
