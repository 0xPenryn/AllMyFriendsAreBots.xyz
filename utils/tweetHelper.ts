import { TweetV2, UserV2 } from 'twitter-api-v2';

export type TweetConfig = {
    user: {
        nickname: string;
        name: string;
        avatar: string;
        verified: boolean;
        locked: boolean;
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
}

// export interface TweetStream {
//     tweets: Array<TweetConfig>;
// }

export interface UnparsedTweet {
    tweet: TweetV2;
    author: UserV2 | null;
}

export function parseTweet(unparsedTweet: UnparsedTweet) {
    var parsedTweet: TweetConfig = {
        "user": {
            "nickname": unparsedTweet.author?.username!,
            "name": unparsedTweet.author?.name!,
            "avatar": unparsedTweet.author?.profile_image_url!,
            "verified": unparsedTweet.author?.verified!,
            "locked": unparsedTweet.author?.protected!,
        },
        "display": "default",
        "text": unparsedTweet.tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "Placeholder Tweet",
        "image": [],
        // for tweets that include media
        // for (let i = 0; i < data[tweetNumber]?.tweet?.attachments?.media_keys.length ?? 0; i++) {
        //   image.push(data[tweetNumber]?.media[i].url)
        // }
        "date": Date.parse(unparsedTweet.tweet.created_at ?? Date()).toLocaleString('en-US')!,
        "app": "Twitter for AI",
        "retweets": unparsedTweet.tweet.public_metrics?.retweet_count ?? -1,
        "quotedTweets": unparsedTweet.tweet.public_metrics?.quote_count ?? -1,
        "likes": unparsedTweet.tweet.public_metrics?.like_count ?? -1,
        "AI": false,
    }
    return parsedTweet;
}

export async function generateTweet(tweet: TweetConfig) {
    const prompt = "Generate a tweet that would fool a human into thinking it was written by a human, inspired by the following tweet in brackets: [";

    var aiTweet = "";

    const tweetText = tweet.text;

    const response = await fetch("/api/openai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "prompt": prompt + tweetText + "]",
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

export async function changeTweet(tweet: TweetConfig) {
    const tweetText = await generateTweet(tweet);
    console.log("ai tweet done: ", tweetText)
    tweet.text = tweetText;
    return tweet;
}

export async function loadTweet(twIndex: number): Promise<TweetConfig> {
    // if (!localStorage.getItem("tweetData")) {
    //     fetch('/api/twitter/timeline')
    //         .then((res) => {
    //             const reader = res.body!.getReader();
    //             reader.read().then((result) => {
    //                 const tweet = JSON.parse(result.value!.toString()!);
    //                 tweetData.push(tweet)
    //                 localStorage.setItem("tweetData", JSON.stringify(tweetData));
    //             })
    //         })
    // }
    const tweetData = JSON.parse(localStorage.getItem("tweetData")!);
    console.log("tweetData: ", tweetData)
    if ((twIndex + 3) >= (tweetData?.length ?? 0)) {
        fetch('/api/twitter/timeline')
            .then((res) => {
                const reader = res.body!.getReader();
                while (twIndex >= tweetData.length) {
                    reader.read().then((result) => {
                        const tweet = JSON.parse(result.value!.toString()!);
                        console.log("tweet: ", tweet)
                        tweetData.push(tweet)
                        localStorage.setItem("tweetData", JSON.stringify(tweetData));
                    })
                }
            })
    }
    if (!tweetData) { throw Error("No tweet data found") }
    var tweet = tweetData[twIndex];
    // 25% chance to make it ai-generated
    if (Math.random() < 0.25) {
        tweet = changeTweet(tweet);
    }
    return tweetData[twIndex];
}
