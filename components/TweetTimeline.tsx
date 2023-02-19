import { TweetHomeTimelineV2Paginator, TwitterApi } from 'twitter-api-v2';
import { TwitterV2IncludesHelper } from 'twitter-api-v2';

const getTweets = async (e: any) => {
  const tweets = await fetch("/api/twitter/timeline")
  .then(
    (response) => response.json()
  );
  // console.log("got tweets!");

  // if (!response.ok) {
  //   throw new Error(response.statusText);
  // }

  return await tweets;

};

const client = new TwitterApi();

export default function TweetTimeline({ className }: { className?: string }) {

  getTweets("").then((list: TweetHomeTimelineV2Paginator) => {
    const includes = new TwitterV2IncludesHelper(list);
    for (const tweet of list.tweets) {
      console.log("item: ", tweet);
      const author = includes.author(tweet);
      console.log("author: ", author);
    };
  });


  return (
    null
  );
}
