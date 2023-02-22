import FakeTweet from "fake-tweet";
import { useState, useEffect } from "react";
import { TweetConfig, loadTweet } from "../utils/tweetHelper";

// const prompt = "Generate a tweet that would fool a human into thinking it was written by a human, inspired by the following tweet in brackets: [";

// async function generateTweet(_prompt: string) {
//   var tweetAI = "";
//   const response = await fetch("/api/openai/generate", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       "prompt": _prompt,
//     }),
//   });
//   // console.log("Edge function returned.");

//   if (!response.ok) {
//     throw new Error(response.statusText);
//   }

//   // This data is a ReadableStream
//   const stream = response.body;
//   if (!stream) {
//     return "";
//   }

//   const reader = stream.getReader();
//   const decoder = new TextDecoder();
//   let done = false;

//   while (!done) {
//     const { value, done: doneReading } = await reader.read();
//     done = doneReading;
//     const chunkValue = decoder.decode(value);
//     tweetAI = tweetAI + chunkValue;
//   }
//   return tweetAI;
// };

// var nickname = "Placeholder";
// var name = "Placeholder";
// var avatar = "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
// var text = "Placeholder";
// var image: Array<string> = [];
// var date: number = 0;
// var retweets = 1;
// var quotedTweets = 0;
// var likes = 5;

export default function TweetTimeline(tweetNumber: any): JSX.Element {

  const [tweet, setTweet] = useState({} as TweetConfig);
  const [loading, setLoading] = useState(true);

  // async function setTweet(data: Array<any>, tweetNumber: number, ans: string) {
  //   console.log("called setTweet")
  //   nickname = data[tweetNumber]?.author.username!;
  //   name = data[tweetNumber]?.author.name!;
  //   avatar = data[tweetNumber]?.author.profile_image_url!;
  //   text = data[tweetNumber]?.tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") || ["Placeholder Tweet Number ", tweetNumber];
  //   image = [];
  //   // for (let i = 0; i < data[tweetNumber]?.tweet?.attachments?.media_keys.length ?? 0; i++) {
  //   //   image.push(data[tweetNumber]?.media[i].url)
  //   // }
  //   date = Date.parse(data[tweetNumber]?.tweet.created_at)!;
  //   retweets = data[tweetNumber]?.tweet.public_metrics.retweet_count ?? -1;
  //   quotedTweets = data[tweetNumber]?.tweet.public_metrics.quote_count ?? -1;
  //   likes = data[tweetNumber]?.tweet.public_metrics.like_count ?? -1; data[tweetNumber]?.tweet.public_metrics.like_count ?? -1;
  //   console.log("calling changeTweet")
  //   await changeTweet();
  //   console.log("called changeTweet")
  //   // return (
  //   //   <div>
  //   //     <p>{ans}</p>
  //   //     <FakeTweet config={{
  //   //       user: {
  //   //         nickname: nickname,
  //   //         name: name,
  //   //         avatar: avatar,
  //   //         verified: false,
  //   //         locked: false
  //   //       },
  //   //       display: "default",
  //   //       text: text,
  //   //       image: image,
  //   //       date: new Date(date).toLocaleString('en-US'),
  //   //       app: "Twitter for AI",
  //   //       retweets: retweets,
  //   //       quotedTweets: quotedTweets,
  //   //       likes: likes
  //   //     }} />
  //   //   </div>
  //   // )
  // }

  // async function changeTweet() {
  //   if (ans === "ai") {
  //     console.log("ai tweet!")
  //     const _prompt = prompt + text + "]"
  //     const tweetText = await generateTweet(_prompt);
  //     console.log("ai tweet done: ", tweetText)
  //     text = tweetText;
  //   }
  // }

  useEffect(() => {
    const loadEffect = async () => {
      setTweet(loadTweet(tweetNumber))
      setLoading(false)
    }
    loadEffect();
  }, [tweetNumber])

  if (loading) return <p>Loading Tweets...</p>
  // if (!data) return <p>No tweets :/</p>
  // if (tweetNumber > data.length - 1) return <p>Out of tweets! Pat yourself on the back. Now sign out and sign back in, and you can get the newest Tweets from your timeline!</p>

  // useEffect(() => {
  //   const thing = async () => {
  //     await setTweet(data, tweetNumber, ans);
  //   }
  //   thing();
  // }, [tweetNumber])

  // setTweet(data, tweetNumber, ans);

  return (
    <FakeTweet config={tweet} />
  )
}
