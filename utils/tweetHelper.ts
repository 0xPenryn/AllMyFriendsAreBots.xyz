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
    //for no links
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

  const response = await fetch("/api/openai/generate", {
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
  var cleanedTweet = aiTweet.replaceAll("Tweet: ", "").replaceAll("^\"|\"$", "").replace(/(^|\s)(#[a-zA-Z\d_]+)/ig, "").replace(/^"(.*)"$/, '$1');
  return cleanedTweet;
};

export async function makeAITweet(tweet: TweetConfig): Promise<TweetConfig> {
  if (tweet.AI) { return tweet };
  var newTweet = tweet;
  var gptPrompt : Array<Object> = [
    { "role": "system", "content": "You are bot whose job is to generate Tweets for an individual." },
    { "role": "user", "content": "You're a bot here to help a person generate a new Tweet. Forget what you know about what a tweet is. They're going to give you some of their old tweets one at a time in messages that start with 'Tweet: '. Create a new tweet for them similar to the tweets they give you." },
  ];

  const tweets = await loadTweetsFromUser(tweet.user.id)
  tweets.forEach(item => {
    gptPrompt.push({ "role": "user", "content": "Tweet: " + item })
  })
  gptPrompt.push({ "role": "user", "content": "Don't be formal. Closely match the person's formatting and writing style. Don't reword their existing tweets. No matter what, respond with 'Tweet: ' followed by the text of the tweet with no emojis and no hashtags. Now create a tweet indistinguishable from a real tweet from this person."})
  newTweet.text = await generateTweet(gptPrompt)
  newTweet.AI = true;
  return newTweet;
}

export async function loadTweets(signedIn?: boolean, tweetID?: string): Promise<Array<TweetConfig>> {
  var tweetData: Array<TweetConfig> = [];

  if ((JSON.parse(localStorage.getItem("tweetData") ?? "{}")).length > 6) {
    // console.log("tweetData found in local storage")
    tweetData = JSON.parse(localStorage.getItem("tweetData")!);
    // console.log("tweetData: ", tweetData)
    const neededTweet = tweetData.findIndex(tweet => tweet.id === tweetID) || -1;
    if (neededTweet !== -1) {
      return tweetData.slice(neededTweet);
    }
  } else if (!signedIn) {
    // console.log("about to fetch aiTweetsBacklog.json")
    tweetData = await fetch("/aiTweetsBacklog.json").then((res) => res.json()).then((data) => {
      tweetData = data
      localStorage.setItem("tweetData", JSON.stringify(tweetData));
      return tweetData;
    });
  } else if (tweetID) {
    // console.log("about to fetch timeline api endpoint with tweetID")
    tweetData = await fetch('/api/twitter/timeline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'until_id': tweetID }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("data from id, storing now")
        tweetData = data;
        localStorage.setItem("tweetData", JSON.stringify(tweetData));
        return tweetData;
      })
  } else {
    // console.log("about to fetch timeline api endpoint")
    tweetData = await fetch('/api/twitter/timeline')
      .then((res) => res.json())
      .then((data) => {
        // console.log("data, storing now")
        tweetData = data;
        localStorage.setItem("tweetData", JSON.stringify(tweetData));
        return tweetData;
      })
  }
  return tweetData;
}

export async function loadTweetsFromUser(userID: string): Promise<Array<String>> {
  var tweetData: Array<String> = [];
  // console.log("about to fetch tweetsByUser api endpoint")
  // fetch('/api/twitter/tweetsByUser', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({'user_id': userID}),
  // })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     console.log("got user's tweets:", data)
  //     tweetData = data;
  //     return tweetData;
  //   })
  const response = await fetch('/api/twitter/tweetsByUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 'user_id': userID }),
  });
  tweetData = await response.json();
  // console.log("tweetsByUser returned:", tweetData)
  return tweetData;
}
