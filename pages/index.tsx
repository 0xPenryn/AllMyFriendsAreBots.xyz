import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import { signIn, signOut, useSession } from 'next-auth/react';
import FakeTweet from "fake-tweet";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Professional");
  const [generatedBios, setGeneratedBios] = useState<String>("");
  const { data: session, status } = useSession();

  console.log("Status: ", status);

  const config1 = { // used for fake tweet testing
    user: {
      nickname: "twitter",
      name: "Twitter",
      avatar: "avatar.png",
      verified: false,
      locked: false
    },
    display: "default",
    text: "This is a fake tweet",
    image: "",
    date: "3:32 PM · Feb 14, 1997",
    app: "Twitter for iPhone",
    retweets: 32000,
    quotedTweets: 100,
    likes: 12700
  };

  console.log(JSON.stringify(session) ?? "no session object");
  // console.log(JSON.stringify(session?.accessToken) ?? "no token object");

  const config2 = { // used for fake tweet testing
    user: {
      nickname: session?.user?.name ?? "twitter",
      name: session?.user?.name ?? "Twitter",
      avatar: session?.user?.image ?? "avatar.png",
      verified: false,
      locked: false
    },
    display: "default",
    text: session?.user?.name ?? "no text",
    image: "",
    date: "3:32 PM · Feb 14, 1997",
    app: "Twitter for iPhone",
    retweets: 32000,
    quotedTweets: 100,
    likes: 12700
  };

  // console.log("Streamed response: ", generatedBios);

  const prompt =
    vibe === "Funny"
      ? `Generate 2 funny twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure there is a joke in there and it's a little ridiculous. Make sure each generated bio is at max 20 words and base it on this context: ${bio}${bio.slice(-1) === "." ? "" : "."
      }`
      : `Generate 2 ${vibe} twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure each generated bio is at least 14 words and at max 20 words and base them on this context: ${bio}${bio.slice(-1) === "." ? "" : "."
      }`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  const getTweets = async (e: any) => {
    const response = await fetch("/api/twitter/timeline", {
      method: "POST",
      body: "",
    });
    console.log("got tweets!");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();

  };

  const tweetlist = getTweets("");
  console.log(tweetlist)

  return (
    // <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
    <div className="flex flex-col items-center">
      {/* THIS HANDLES SIGNING IN W TWITTER */}
      {!session && <>
          Not signed in <br />
          <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
        </>}
        {session && <>
          Signed in as {session.user?.name ?? "no user object"} <br />
          {/* Signed in<br /> */}
          <button onClick={() => signOut()}>Sign out</button>
          Token: {session?.access_token ?? "no access token"} <br />
          Secret: {session?.refresh_token ?? "no access secret"}
        </>}
        {/* I DO NOT KNOW WHAT I AM DOING MIGUEL DO NOT CRITICIZE ME */}
        {/* fake tweet generator for timeline-style view */}
      <FakeTweet config={config1} />
      <FakeTweet config={config2} />
    
      <Head>
        <title>Twitter Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20"> */}
      <main className="flex flex-1 w-100 flex-col items-center justify-center text-center">
        
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Copy your current bio{" "}
              <span className="text-slate-500">
                (or write a few sentences about yourself)
              </span>
              .
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com."
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select your vibe.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generate your bio &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedBios && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your generated bios
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    {generatedBios
                      .substring(generatedBios.indexOf("1") + 3)
                      .split("2.")
                      .map((generatedBio) => {
                        return (
                          <div
                            className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedBio);
                              toast("Bio copied to clipboard", {
                                icon: "✂️",
                              });
                            }}
                            key={generatedBio}
                          >
                            <p>{generatedBio}</p>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
    </div>
  );
};

export default Home;
