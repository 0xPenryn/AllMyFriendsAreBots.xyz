// import { AnimatePresence, motion } from "framer-motion";
// import type { NextPage } from "next";
// import Head from "next/head";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { Toaster, toast } from "react-hot-toast";
// import DropDown, { VibeType } from "../components/DropDown";
// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import LoadingDots from "../components/LoadingDots";
// import ResizablePanel from "../components/ResizablePanel";
// import { signIn, signOut, useSession } from 'next-auth/react';
// import FakeTweet from "fake-tweet";
// import TweetTimeline from "../components/TweetTimeline";

// const Home: NextPage = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   // const [bio, setBio] = useState("");
//   // const [vibe, setVibe] = useState<VibeType>("Professional");
//   // const [generatedBios, setGeneratedBios] = useState<String>("");
//   const { data: session, status } = useSession();

//   const blankTweet = { // used for fake tweet testing
//     user: {
//       nickname: "twitter",
//       name: "Twitter",
//       avatar: "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg",
//       verified: false,
//       locked: false
//     },
//     display: "default",
//     text: "This is a placeholder tweet.",
//     image: "",
//     date: "3:32 PM · Feb 14, 1997",
//     app: "Twitter for iPhone",
//     retweets: 1,
//     quotedTweets: 0,
//     likes: 5
//   };

//   var tweets = [] as any;

//   var tweetdata = blankTweet;

//   var nickname = "Placeholder";
//   var name = "Placeholder";
//   var avatar = "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
//   var text = "Placeholder";
//   var date = "Placeholder";

//   // const prompt =
//   //   vibe === "Funny"
//   //     ? `Generate 2 funny twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure there is a joke in there and it's a little ridiculous. Make sure each generated bio is at max 20 words and base it on this context: ${bio}${bio.slice(-1) === "." ? "" : "."
//   //     }`
//   //     : `Generate 2 ${vibe} twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure each generated bio is at least 14 words and at max 20 words and base them on this context: ${bio}${bio.slice(-1) === "." ? "" : "."
//   //     }`;

//   // const generateBio = async (e: any) => {
//   //   e.preventDefault();
//   //   setGeneratedBios("");
//   //   setLoading(true);
//   //   const response = await fetch("/api/generate", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: JSON.stringify({
//   //       prompt,
//   //     }),
//   //   });
//   //   console.log("Edge function returned.");

//   //   if (!response.ok) {
//   //     throw new Error(response.statusText);
//   //   }

//   //   // This data is a ReadableStream
//   //   const data = response.body;
//   //   if (!data) {
//   //     return;
//   //   }

//   //   const reader = data.getReader();
//   //   const decoder = new TextDecoder();
//   //   let done = false;

//   //   while (!done) {
//   //     const { value, done: doneReading } = await reader.read();
//   //     done = doneReading;
//   //     const chunkValue = decoder.decode(value);
//   //     setGeneratedBios((prev) => prev + chunkValue);
//   //   }

//   //   setLoading(false);
//   // };

//   // const getTweets = async (e: any) => {
//   //   const tweets = await fetch("/api/twitter/timeline")
//   //   .then(
//   //     (response) => response.json()
//   //   );
//   //   // console.log("got tweets!");

//   //   // if (!response.ok) {
//   //   //   throw new Error(response.statusText);
//   //   // }

//   //   return await tweets;

//   // };

//   // var tweetList = getTweets("").then((res) => {
//   //   console.log("promise tweet list: ", res ?? "no promise tweetlist");
//   // });
//   // console.log("tweetlist: ", tweetList ?? "no tweetlist");


//   // const config2 = { // used for fake tweet testing
//   //   user: {
//   //     nickname: session?.user?.name ?? "twitter",
//   //     name: session?.user?.name ?? "Twitter",
//   //     avatar: session?.user?.image ?? "avatar.png",
//   //     verified: false,
//   //     locked: false
//   //   },
//   //   display: "default",
//   //   // text: JSON.stringify(tweetlist) ?? "no text",
//   //   text: "This is a fake tweet",
//   //   image: "",
//   //   date: "3:32 PM · Feb 14, 1997",
//   //   app: "Twitter for iPhone",
//   //   retweets: 32000,
//   //   quotedTweets: 100,
//   //   likes: 12700
//   // };


//   const getTweets = async () => {
//     const homeTimeline = await fetch("/api/twitter/timeline")
//       .then(
//         (response) => response.json()
//       );
  
//     // console.log("homeTimeline: ", homeTimeline)

//     return await homeTimeline;

//   };

//   const tweetList: Array<JSON> = getTweets();

//   useEffect(() => {
//     setLoading(true)
//     // setData(data)
//     // console.log("data: ", data ?? "no data")
//     nickname = tweetList[0].author.name ?? "New Placeholder";
//     name = tweetList[0].author.username ?? "New Placeholder";
//     avatar = tweetList[0].author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
//     text = tweetList[0].tweet.text ?? "New Placeholder";
//     date = tweetList[0].tweet.created_at ?? "New Placeholder";
//     setLoading(false)
//   }, [tweetList]);

//   // useEffect(() => {
//   //   setLoading(true)
//   //   tweets = fetch('/api/twitter/timeline')
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       // setData(data)
//   //       // console.log("data: ", data ?? "no data")
//   //       nickname = data[0].author.name ?? "New Placeholder";
//   //       name = data[0].author.username ?? "New Placeholder";
//   //       avatar = data[0].author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
//   //       text = data[0].tweet.text ?? "New Placeholder";
//   //       date = data[0].tweet.created_at ?? "New Placeholder";
//   //       setLoading(false)
//   //     });
//   // }), [data];



//   return (
//     <div className="flex flex-col items-center">
//       {/* THIS HANDLES SIGNING IN W TWITTER */}
//       {!session && <>
//         Not signed in <br />
//         <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
//       </>}
//       {session && <>
//         Signed in as {session.user?.name ?? "no user object"} <br />
//         {/* Signed in<br /> */}
//         <button onClick={() => signOut()}>Sign out</button>
//         {/* fake tweet generator for timeline-style view */}
//       </>}
//       {/* I DO NOT KNOW WHAT I AM DOING DO NOT CRITICIZE ME */}

//       <Head>
//         <title>is this tweet ai? idk</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       {!loading && <>
//         <FakeTweet config={{
//             user: {
//               nickname: nickname,
//               name: name,
//               avatar: avatar,
//               verified: false,
//               locked: false
//             },
//             display: "default",
//             text: text,
//             image: "",
//             date: date,
//             app: "Twitter for iPhone",
//             retweets: 1,
//             quotedTweets: 0,
//             likes: 5
//           }} />
//       </>}
//       {/* <main className="flex flex-1 w-100 flex-col items-center justify-center text-center">
//         <div className="max-w-xl w-full">
//           <div className="flex mt-10 items-center space-x-3">
//             <Image
//               src="/1-black.png"
//               width={30}
//               height={30}
//               alt="1 icon"
//               className="mb-5 sm:mb-0"
//             />
//             <p className="text-left font-medium">
//               Copy your current bio{" "}
//               <span className="text-slate-500">
//                 (or write a few sentences about yourself)
//               </span>
//               .
//             </p>
//           </div>
//           <textarea
//             value={bio}
//             onChange={(e) => setBio(e.target.value)}
//             rows={4}
//             className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
//             placeholder={
//               "e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com."
//             }
//           />
//           <div className="flex mb-5 items-center space-x-3">
//             <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
//             <p className="text-left font-medium">Select your vibe.</p>
//           </div>
//           <div className="block">
//             <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
//           </div>

//           {!loading && (
//             <button
//               className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
//               onClick={(e) => generateBio(e)}
//             >
//               Generate your bio &rarr;
//             </button>
//           )}
//           {loading && (
//             <button
//               className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
//               disabled
//             >
//               <LoadingDots color="white" style="large" />
//             </button>
//           )}
//         </div>
//         <Toaster
//           position="top-center"
//           reverseOrder={false}
//           toastOptions={{ duration: 2000 }}
//         />
//         <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
//         <ResizablePanel>
//           <AnimatePresence mode="wait">
//             <motion.div className="space-y-10 my-10">
//               {generatedBios && (
//                 <>
//                   <div>
//                     <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
//                       Your generated bios
//                     </h2>
//                   </div>
//                   <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
//                     {generatedBios
//                       .substring(generatedBios.indexOf("1") + 3)
//                       .split("2.")
//                       .map((generatedBio) => {
//                         return (
//                           <div
//                             className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
//                             onClick={() => {
//                               navigator.clipboard.writeText(generatedBio);
//                               toast("Bio copied to clipboard", {
//                                 icon: "✂️",
//                               });
//                             }}
//                             key={generatedBio}
//                           >
//                             <p>{generatedBio}</p>
//                           </div>
//                         );
//                       })}
//                   </div>
//                 </>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </ResizablePanel>
//       </main> */}
//     </div>
//   );
// };

// export default Home;
