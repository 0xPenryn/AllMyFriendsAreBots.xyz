import { TweetV2, UserV2 } from 'twitter-api-v2';

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
    text: unparsedTweet.tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "Placeholder Tweet",
    image: [],
    // for tweets that include media
    // for (let i = 0; i < data[tweetNumber]?.tweet?.attachments?.media_keys.length ?? 0; i++) {
    //   image.push(data[tweetNumber]?.media[i].url)
    // }
    date: Date.parse(unparsedTweet.tweet.created_at ?? Date()).toLocaleString('en-US')!,
    app: "Twitter for AI",
    retweets: unparsedTweet.tweet.public_metrics?.retweet_count ?? -1,
    quotedTweets: unparsedTweet.tweet.public_metrics?.quote_count ?? -1,
    likes: unparsedTweet.tweet.public_metrics?.like_count ?? -1,
    AI: false,
    id: unparsedTweet.tweet.id ?? "0",
  }
  // console.log("parsed tweet: ", parsedTweet)
  return parsedTweet;
}

export async function generateTweet(tweet: TweetConfig) {
  const prompt = "Generate a tweet that would fool a human into thinking it was written by a human, inspired by the following array of tweets: ";

  var aiTweet = "";

  const tweetText = (await loadTweetsFromUser(tweet.user.id)).toString();

  const response = await fetch("/api/openai/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "prompt": prompt + tweetText,
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
  return aiTweet;
};

export async function makeAITweet(tweet: TweetConfig) {
  if (tweet.AI) { return tweet };
  var newTweet = tweet;
  const tweetText = await generateTweet(tweet);
  console.log("ai tweet done: ", tweetText)
  newTweet.text = tweetText;
  newTweet.AI = true;
  return newTweet;
}

export async function loadTweets(tweetID?: string): Promise<Array<TweetConfig>> {
  var tweetData: Array<TweetConfig> = [];

  if (localStorage.getItem("tweetData")) {
    tweetData = JSON.parse(localStorage.getItem("tweetData")!);
    console.log("tweetData: ", tweetData)
    const neededTweet = tweetData.findIndex(tweet => tweet.id === tweetID || -1);
    if (neededTweet !== -1 && tweetData.slice(neededTweet).length > 20) {
      return tweetData.slice(neededTweet);
    }
  }
  if (tweetID) {
    console.log("about to fetch timeline api endpoint")
    fetch('/api/twitter/timeline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'until_id': tweetID}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data, storing now")
        tweetData = data;
        localStorage.setItem("tweetData", JSON.stringify(tweetData));
        return tweetData;
      })
  } else {
    console.log("about to fetch timeline api endpoint")
    fetch('/api/twitter/timeline')
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

export async function loadTweetsFromUser(userID: string): Promise<Array<TweetConfig>> {
  var tweetData: Array<TweetConfig> = [];

    console.log("about to fetch tweetsByUser api endpoint")
    fetch('/api/twitter/timeline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'user_id': userID}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("got user's tweets!")
        tweetData = data;
        return tweetData;
      })
  return tweetData;
}
