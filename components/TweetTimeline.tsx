import { TweetHomeTimelineV2Paginator, TwitterApi, TwitterV2IncludesHelper } from 'twitter-api-v2';
import FakeTweet from "fake-tweet";

const getTweets = async () => {
  const tweets = fetch("/api/twitter/timeline")
  // .then(
  //   (response) => response.json()
  // );
  console.log("got tweets!", await tweets);

  // if (!response.ok) {
  //   throw new Error(response.statusText);
  // }

  return await tweets;

};

export default function TweetTimeline(): JSX.Element {

  // const { data: session, status } = useSession();
    // const client = new TwitterApi(session?.access_token);

    // client.v2.homeTimeline({ 
    //   'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld'],
    //   expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id' ],
    //   'media.fields': ['url'], 
    //   'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
    //   exclude: ['retweets', 'replies'],
    // }).then((homeTimeline) => {
    //   const includes = new TwitterV2IncludesHelper(homeTimeline);

    //   console.log("first tweet: ", homeTimeline.tweets[0], includes.author(homeTimeline.tweets[0]));

    //   const nickname = includes.author(homeTimeline.tweets[0])?.username ?? "Placeholder";
    //   const name = includes.author(homeTimeline.tweets[0])?.name ?? "Placeholder";
    //   const avatar = includes.author(homeTimeline.tweets[0])?.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
    //   const text = homeTimeline.tweets[0].text ?? "Placeholder";
    //   const date = homeTimeline.tweets[0].created_at ?? "Placeholder";

    //   return (
    //     <div>
    //       <h1>Timeline</h1>
    //       <FakeTweet config={{
    //         user: {
    //           nickname: nickname,
    //           name: name,
    //           avatar: avatar,
    //           verified: false,
    //           locked: false
    //         },
    //         display: "default",
    //         text: text,
    //         image: "",
    //         date: date,
    //         app: "Twitter for iPhone",
    //         retweets: 1,
    //         quotedTweets: 0,
    //         likes: 5
    //       }} />
    //     </div>
    //   );
    // });

    // return (
    //   <div>
    //     <h1>Empty Timeline</h1>
    //   </div>
    // );

    getTweets().then((homeTimeline) => {
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
}
