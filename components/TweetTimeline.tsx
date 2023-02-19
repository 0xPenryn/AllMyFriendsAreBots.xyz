import { useSession } from 'next-auth/react';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterV2IncludesHelper } from 'twitter-api-v2';
import FakeTweet from "fake-tweet";

// const getTweets = async (e: any) => {
//   const tweets = await fetch("/api/twitter/timeline")
//   .then(
//     (response) => response.json()
//   );
//   // console.log("got tweets!");

//   // if (!response.ok) {
//   //   throw new Error(response.statusText);
//   // }

//   return await tweets;

// };

export default function TweetTimeline({ className }: { className?: string }) {

  const { data: session, status } = useSession();
  const client = new TwitterApi(session?.access_token ?? null);

  client.v2.homeTimeline({ 
    'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld'],
    expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id' ],
    'media.fields': ['url'], 
    'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
    exclude: ['retweets', 'replies'],
  }).then((homeTimeline) => {
    const includes = new TwitterV2IncludesHelper(homeTimeline);

    console.log("first tweet: ", homeTimeline.tweets[0], includes.author(homeTimeline.tweets[0]));

    const nickname = includes.author(homeTimeline.tweets[0])?.username ?? "Placeholder";
    const name = includes.author(homeTimeline.tweets[0])?.name ?? "Placeholder";
    const avatar = includes.author(homeTimeline.tweets[0])?.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
    const text = homeTimeline.tweets[0].text ?? "Placeholder";
    const date = homeTimeline.tweets[0].created_at ?? "Placeholder";

    return (
      <div>
        <h1>Timeline</h1>
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
          image: "",
          date: date,
          app: "Twitter for iPhone",
          retweets: 1,
          quotedTweets: 0,
          likes: 5
        }} />
      </div>
    );
  });

  return (
    <div>
      <h1>Empty Timeline</h1>
    </div>
  );

  // getTweets("").then((list) => {
  //   const includes = new TwitterV2IncludesHelper(list);
  //   for (const tweet of list.data) {
  //     console.log("item: ", tweet);
  //     const author = includes.author(tweet);
  //     console.log("author: ", author);
  //   };
  // });


  
}
