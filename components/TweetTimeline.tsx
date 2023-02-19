import { TweetHomeTimelineV2Paginator, TwitterApi, TwitterV2IncludesHelper } from 'twitter-api-v2';
import FakeTweet from "fake-tweet";

const getTweets = async () => {
  const homeTimeline = await fetch("/api/twitter/timeline")
    .then(
      (response) => response.json()
    );

  console.log("homeTimeline: ", homeTimeline)

  return await homeTimeline;

};

export interface Props {
  verified: boolean;
  tweets: Array<any>;
}

export default function TweetTimeline(props: Props): JSX.Element {

  const tweets = props.tweets;

  var nickname = "Placeholder";
  var name = "Placeholder";
  var avatar = "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
  var text = "Placeholder";
  var date = "Placeholder";
  var verified = props.verified;

  // getTweets().then((tweets) => {
    nickname = tweets[0].author.name ?? "New Placeholder";
    name = tweets[0].author.username ?? "New Placeholder";
    avatar = tweets[0].author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
    text = tweets[0].tweet.text ?? "New Placeholder";
    date = tweets[0].tweet.created_at ?? "New Placeholder";

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
        image: "",
        date: date,
        app: "Twitter for iPhone",
        retweets: 1,
        quotedTweets: 0,
        likes: 5
      }} />
    )
  // });

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
      image: "",
      date: date,
      app: "Twitter for iPhone",
      retweets: 1,
      quotedTweets: 0,
      likes: 5
    }} />
  )
}
