import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from 'next-auth/react';

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME */ }

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <Head>
        <title>PoP Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session && <>
        <div className="self-stretch flex flex-nowrap flex-row m-5 items-center justify-center">
          <div className="w-1/4 text-left"><button onClick={() => location.href = '/'}>Home</button></div>
          <div className="w-1/2 text-center flex flex-row flex-nowrap items-center justify-center">
            {session?.user?.image && <>
            <img src={session.user.image} className="h-10" />
            </>}
            Signed in as @{session?.user?.name}
          </div>
          <div className="w-1/4 text-right"><button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button></div>
        </div>
      </>}
      <div className="flex flex-col h-screen w-screen justify-center items-center">
        <h1>Personhood is hard to prove. <br /></h1>
        <h3 className="mt-5 text-base">Can you tell which Tweets are made by humans and AI?</h3>
        {session && <>
          <button className="bg-green-500 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => location.href = '/play'}>You're already signed in -- play now!</button>
        </>}
        {!session && <>
          <button className="bg-sky-400 text-white rounded-md px-5 py-1.5 mt-5 text-xl" onClick={() => signIn("twitter", {
            callbackUrl: `${window.location.origin}/play`,
          })}>Sign in with Twitter</button>
          <p className="w-1/3 text-slate-500 text-center text-xs mt-2">We personalize the game to your feed. We only use public Tweets, and we won't post or act on your behalf.</p>
          <button className="bg-slate-400 text-white opacity-80 text-xs rounded-md px-5 py-1.5 mt-4" onClick={() => alert("Not yet supported.")}>Play without Signing In</button>
        </>}
      </div>
      <button className="bg-slate-500 text-white text-lg rounded-md px-5 py-1.5 m-10" onClick={() => location.href = 'https://worldcoin.org/blog'}>Read more about Proof-of-Personhood</button>
    </div>
  );
};

export default Home;
