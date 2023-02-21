import { TweetHomeTimelineV2Paginator, TweetV2, TwitterApi, TwitterV2IncludesHelper } from 'twitter-api-v2';
import FakeTweet from "fake-tweet";
import { useState, useEffect } from "react";

// const [tweetReal, setTweetReal] = useState("");
// const [loadingOAI, setLoadingOAI] = useState(false);
// const [tweetAI, setTweetAI] = useState<String>("");

// const prompt =
//   `Generate 2 funny twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure there is a joke in there and it's a little ridiculous. Make sure each generated bio is at max 20 words and base it on this context:`;

// const generateTweet = async (e: any) => {
//   e.preventDefault();
//   setTweetAI("");
//   setLoadingOAI(true);
//   const response = await fetch("/api/generate", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       prompt,
//     }),
//   });
//   console.log("Edge function returned.");

//   if (!response.ok) {
//     throw new Error(response.statusText);
//   }

//   // This data is a ReadableStream
//   const data = response.body;
//   if (!data) {
//     return;
//   }

//   const reader = data.getReader();
//   const decoder = new TextDecoder();
//   let done = false;

//   while (!done) {
//     const { value, done: doneReading } = await reader.read();
//     done = doneReading;
//     const chunkValue = decoder.decode(value);
//     setTweetAI((prev) => prev + chunkValue);
//   }

//   setLoadingOAI(false);
// };

var nickname = "Placeholder";
var name = "Placeholder";
var avatar = "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
var text = "Placeholder";
var image: Array<string> = [];
var date: number = 0;
var retweets = 1;
var quotedTweets = 0;
var likes = 5;

interface TweetTimeline {
  tweetNumber: number;
  ans: string;
}

function setTweet(data: Array<any>, tweetNumber: number, ans: string) {
  if (ans == "human") {
    nickname = data[tweetNumber]?.author.username ?? ["Account", tweetNumber];
    name = data[tweetNumber]?.author.name ?? ["Account ", tweetNumber];
    avatar = data[tweetNumber]?.author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
    text = data[tweetNumber]?.tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "").replace(/&amp;/g, "&") || ["Placeholder Tweet Number ", tweetNumber];
    image = [];
    for (let i = 0; i < data[tweetNumber]?.tweet?.attachments?.media_keys.length ?? 0; i++) {
      image.push(data[tweetNumber]?.media[i].url)
    }
    date = Date.parse(data[tweetNumber]?.tweet.created_at) ?? Date();
    retweets = data[tweetNumber]?.tweet.public_metrics.retweet_count ?? -1;
    quotedTweets = data[tweetNumber]?.tweet.public_metrics.quote_count ?? -1;
    likes = data[tweetNumber]?.tweet.public_metrics.like_count ?? -1;
  } else {
    nickname = data[tweetNumber]?.author.username ?? ["Account", tweetNumber];
    name = data[tweetNumber]?.author.name ?? ["Account ", tweetNumber];
    avatar = data[tweetNumber]?.author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
    // text = data[tweetNumber]?.tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "").replace(/&amp;/g, "&") || ["Placeholder Tweet Number ", tweetNumber];
    text = "AI Generated Tweet";
    image = [];
    for (let i = 0; i < data[tweetNumber]?.tweet?.attachments?.media_keys.length ?? 0; i++) {
      image.push(data[tweetNumber]?.media[i].url)
    }
    date = Date.parse(data[tweetNumber]?.tweet.created_at) ?? Date();
    retweets = data[tweetNumber]?.tweet.public_metrics.retweet_count ?? -1;
    quotedTweets = data[tweetNumber]?.tweet.public_metrics.quote_count ?? -1;
    likes = data[tweetNumber]?.tweet.public_metrics.like_count ?? -1;
  }
}

export default function TweetTimeline({ tweetNumber, ans }: TweetTimeline,): JSX.Element {

  const [data, setData] = useState([] as Array<any>);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEffect = async () => {
      setLoading(true)
      if (localStorage.getItem("tweetData") !== null || "") {
        console.log("local storage")
        setData(JSON.parse(localStorage.getItem("tweetData")!))
        console.log("first from local storage data: ", data)
        console.log("end of effect")
        setLoading(false)
      } else {
        fetch('/api/twitter/timeline')
          .then((res) => res.json())
          .then((data) => {
            setData(data)
            localStorage.setItem("tweetData", JSON.stringify(data))
            console.log("stored in local storage")
            console.log("first data: ", data)
            console.log("end of effect")
            setLoading(false)
          }
        )
      }
    }
    loadEffect();
  }, [])

  // useEffect(() => {
  if (loading) return <p>Loading Tweet...</p>
  if (!data) return <p>No tweets :/</p>

  setTweet(data, tweetNumber, ans)

  return (
    <FakeTweet config={{
      user: {
        nickname: nickname,
        name: name,
        avatar: avatar,
        verified: false,
        locked: false
      },
      display: "default",
      text: text,
      image: image,
      date: new Date(date).toLocaleString('en-US'),
      app: "Twitter for AI",
      retweets: retweets,
      quotedTweets: quotedTweets,
      likes: likes
    }} />
  )
}
