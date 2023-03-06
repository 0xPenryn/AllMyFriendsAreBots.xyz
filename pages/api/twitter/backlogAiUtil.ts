import { TweetV2, UserV2 } from 'twitter-api-v2';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: "edge",
};

export type TweetConfig = {
  user: {
    nickname: string;
    name: string;
    avatar: string;
    verified: boolean;
    locked: boolean;
    id: string;
  };
  display: string;
  text: string;
  image: Array<string>;
  date: string;
  app: string;
  retweets: number;
  quotedTweets: number;
  likes: number;
  AI: boolean;
  id: string;
}

export interface UnparsedTweet {
  tweet: TweetV2;
  author: UserV2 | null;
}

export function parseTweet(unparsedTweet: UnparsedTweet) {
  var parsedTweet: TweetConfig = {
    user: {
      nickname: unparsedTweet.author?.username!,
      name: unparsedTweet.author?.name!,
      avatar: unparsedTweet.author?.profile_image_url!,
      verified: unparsedTweet.author?.verified!,
      locked: unparsedTweet.author?.protected!,
      id: unparsedTweet.author?.id!,
    },
    display: "default",
    // for no links
    // text: unparsedTweet.tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "Placeholder Tweet",
    // for links
    text: unparsedTweet.tweet.text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "Placeholder Tweet",
    image: [],
    // for tweets that include media
    // for (let i = 0; i < data[tweetNumber]?.tweet?.attachments?.media_keys.length ?? 0; i++) {
    //   image.push(data[tweetNumber]?.media[i].url)
    // }
    date: new Date(Date.parse(unparsedTweet.tweet.created_at!)).toLocaleString(),
    app: "Twitter for AI",
    retweets: unparsedTweet.tweet.public_metrics?.retweet_count ?? -1,
    quotedTweets: unparsedTweet.tweet.public_metrics?.quote_count ?? -1,
    likes: unparsedTweet.tweet.public_metrics?.like_count ?? -1,
    AI: false,
    id: unparsedTweet.tweet.id ?? "0",
  }
  return parsedTweet;
}

export async function generateTweet(prompt: Array<Object>) {
  
  // const prompt = "Generate a single tweet without hashtags or quotes that would fool a human into thinking it was written by a human, inspired by the following array of tweets: ";

  var aiTweet = "";

  const response = await fetch("https://allmyfriendsarebots.xyz/api/openai/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "prompt": prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  // This data is a ReadableStream
  const stream = response.body;
  if (!stream) {
    return "";
  }

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    aiTweet = aiTweet + chunkValue;
  }
  var cleanedTweet = aiTweet.replaceAll("Tweet: ", "");
  return cleanedTweet.replaceAll("^\"|\"$", "");
};

export async function makeAITweet(tweet: TweetConfig): Promise<TweetConfig> {
  if (tweet.AI) { return tweet };
  var newTweet = tweet;
  var gptPrompt : Array<Object> = [
    { "role": "system", "content": "You are person whose job is to generate Tweets for an individual." },
    { "role": "user", "content": 'You will be given Tweets in messages beginning with "Tweet: " and asked to generate a single Tweet based on the content and style of Tweets you are given.' },
    { "role": "user", "content": 'Pay particular attention to how these Tweets utilize punctuation, capitalization, and tone. Style is just as important as the content of the Tweet.' },
    { "role": "user", "content": "Focus much more on the Tweets given to you than on your existing knowledge of what a Tweet should be." },
    { "role": "user", "content": 'Do NOT include "Tweet: " or surrouding quotes in your response, only reply with the text of the generated Tweet.' },
  ];

  await loadTweetsFromUser(tweet.user.id).then((tweets) => {
    console.log(tweets);
    tweets.forEach((item) => {
      gptPrompt.push({ "role": "user", "content": "Tweet: " + item })
    })
  });
  gptPrompt.push({ "role": "user", "content": "Generate a Tweet." })
  newTweet.text = await generateTweet(gptPrompt);
  newTweet.AI = true;
  return newTweet;
}

export async function loadTweetsFromUser(userID: string): Promise<Array<String>> {
  var tweetData: Array<String> = [];
  console.log("about to fetch tweetsByUser api endpoint")
  const response = await fetch('https://allmyfriendsarebots.xyz/api/twitter/tweetsByUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 'user_id': userID }),
  });
  tweetData = await response.json();
  return tweetData;
}

export async function doAi(tweet: TweetConfig) {
  if (Math.random() >= 0.5) {
    await makeAITweet(tweet).then((tweetAi) => {
      return tweetAi;
    })
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {

  var tweetList: Array<TweetConfig> = [];

  // fetch("https://allmyfriendsarebots.xyz/api/twitter/backlogGrabberUtil").then((res) => res.json()).then((data) => {
  // fetch("https://allmyfriendsarebots.xyz/noSignInTweets.json").then((res) => res.json()).then((data) => {
  //   tweetList = data.map((tweet: TweetConfig) => {doAi(tweet)})
  //   // return tweetList;
  // });

  const data = await fetch("https://allmyfriendsarebots.xyz/noSignInTweets.json")
  const json = await data.json()
  tweetList = await json.map((tweet: TweetConfig) => {doAi(tweet)})

  return new Response(JSON.stringify(tweetList));
}