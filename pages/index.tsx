import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from 'next-auth/react';
import Footer from "../components/Footer";

function clearState() {
  localStorage.removeItem("lastScore");
  localStorage.removeItem("highScore");
  localStorage.removeItem("lastTweet");
  localStorage.removeItem("tweetData");
  localStorage.removeItem("lastTweetType");
}

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME MIGUEL*/ }

  return (
    <div className="flex flex-col h-screen justify-center items-center">
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
      <div className="grow flex flex-col w-screen justify-center items-center">
        <h1 className="text-3xl">AI is getting <i>really</i> good.<br /></h1>
        <p className="mt-2 text-center">
          It's impossible to argue that it isn't changing everything -- it's harder than ever to tell when it's being used.<br />
          We owe it to ourselves to be able to know we're working with a human.
        </p>
        <h3 className="mt-2 mx-10 text-lg text-center">Can you tell which Tweets are real or AI-generated?</h3>
        {session && <>
          <button className="transition bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl hover:bg-green-600 active:bg-green-700 hover:outline-none hover:ring hover:ring-green-300" onClick={() => location.href = '/pregame'}>You're signed in -- play now!</button>
        </>}
        {!session && <>
          <button className="transition bg-sky-400 text-white rounded-md px-5 py-1.5 mt-5 text-xl hover:bg-sky-500 active:bg-sky-700 hover:outline-none hover:ring hover:ring-sky-300" onClick={() => {
            clearState();
            signIn("twitter", {
              callbackUrl: `${window.location.origin}/pregame`,
            });
          }}>Sign in with Twitter to Play</button>
          <Link className="transition text-slate-500 text-sm mt-3 hover:text-slate-700" href = '/pregame'>Play without Signing In</Link>
          <p className="w-2/3 max-w-sm text-slate-500 text-center text-xs mt-3 mx-5">We personalize the game to your feed. We only use public Tweets, and we won't post or act on your behalf.</p>
        </>}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
