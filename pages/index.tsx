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
      <div className="grow flex flex-col w-screen justify-center items-center">
        <h1 className="text-3xl">AI is getting <i>really</i> good.<br /></h1>
        <p className="mt-2 text-center">
          It's impossible to argue that it isn't changing everything -- it's harder than ever to tell when it's being used.<br />
          We owe it to ourselves to be able to know we're working with a human.
        </p>
        <h3 className="mt-2 mx-10 text-lg text-center">Can you tell which Tweets are real or AI-generated?</h3>
        {session && <>
          <button className="bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => location.href = '/pregame'}>You're signed in -- play now!</button>
        </>}
        {!session && <>
          <button className="bg-sky-400 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => {
            signIn("twitter", {
              callbackUrl: `${window.location.origin}/pregame`,
            });
            clearState();
          }}>Sign in with Twitter to Play</button>
          <p className="w-2/3 max-w-sm text-slate-500 text-center text-xs mt-3 mx-5">We personalize the game to your feed. We only use public Tweets, and we won't post or act on your behalf.</p>
          <button className="bg-slate-400 text-white opacity-80 text-xs rounded-md px-5 py-1.5 mt-4" onClick={() => location.href = '/pregame'}>Play without Signing In</button>
        </>}
      </div>
      <Footer />
      <p className='mb-5 text-sm'> Built by <Link className='text-black' href="https://twitter.com/0xPenryn">0xPenryn</Link> and <Link className='text-black' href="https://hyperflu.id">Hyperfluid</Link>.</p>
    </div>
  );
};

export default Home;
