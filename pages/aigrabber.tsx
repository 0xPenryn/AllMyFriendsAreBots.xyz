import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { signOut, useSession } from 'next-auth/react';
import TweetTimeline from "../components/TweetTimeline";
import { makeAITweet, TweetConfig } from "../utils/tweetHelper";
import toast, { Toaster } from 'react-hot-toast';
import Footer from "../components/Footer";

function clearState() {
  localStorage.removeItem("lastScore");
  localStorage.removeItem("highScore");
  localStorage.removeItem("lastTweet");
  localStorage.removeItem("tweetData");
  localStorage.removeItem("lastTweetType");
}

export async function loadTweets(signedIn?: boolean, tweetID?: string): Promise<Array<TweetConfig>> {
  var tweetData: Array<TweetConfig> = [];
  // const { data: session, status } = useSession();

  function shuffle(a: Array<any>) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  if (localStorage.getItem("tweetData")) {
    tweetData = JSON.parse(localStorage.getItem("tweetData")!);
    console.log("tweetData: ", tweetData)
    const neededTweet = tweetData?.findIndex(tweet => tweet.id === tweetID) || -1;
    if (neededTweet !== -1 && tweetData.slice(neededTweet).length > 20) {
      return tweetData.slice(neededTweet);
    }
  }
  if (tweetID) {
    console.log("about to fetch backlog api endpoint")
    fetch('/api/twitter/backlogGrabberUtil', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'until_id': tweetID }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data, storing now")
        tweetData = data;
        localStorage.setItem("tweetData", JSON.stringify(tweetData));
        return tweetData;
      })
  } else {
    console.log("about to fetch backlog api endpoint")
    fetch('/api/twitter/backlogGrabberUtil')
      .then((res) => res.json())
      .then((data) => {
        console.log("data, storing now")
        tweetData = data;
        localStorage.setItem("tweetData", JSON.stringify(tweetData));
        return tweetData;
      })
  }
  return tweetData;
}

var AITWEETSTUFF: Array<TweetConfig>;

const Play: NextPage = () => {
  const { data: session, status } = useSession();
  const [tweetId, setTweetId] = useState("0");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [tweets, setTweets] = useState<TweetConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHighScore(parseInt(localStorage.getItem("highScore") ?? "0"));
    AITWEETSTUFF = JSON.parse(localStorage.getItem("AITWEETSTUFF")!);
    if (session) {
      //CHANGE THIS BACK TO TRUE BEFORE LAUNCHING
      loadTweets(false).then((tweets) => {
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
        await makeAITweet(tweets[0]!).then((tweet) => {
          AITWEETSTUFF.push(tweet);
          localStorage.setItem("AITWEETSTUFF", JSON.stringify(AITWEETSTUFF));
        })
      } else {
        AITWEETSTUFF.push(tweet);
        localStorage.setItem("AITWEETSTUFF", JSON.stringify(AITWEETSTUFF));
      }
    }
    
    async function loadMoreTweets() {
        alert("out of tweets!")
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
