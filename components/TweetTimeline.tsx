import { TweetHomeTimelineV2Paginator, TweetV2, TwitterApi, TwitterV2IncludesHelper } from 'twitter-api-v2';
import FakeTweet from "fake-tweet";
import { useState, useEffect } from "react";


const getTweets = async () => {
  const homeTimeline = await fetch("/api/twitter/timeline")
    .then(
      (response) => response.json()
    );

  console.log("homeTimeline: ", homeTimeline)

  return await homeTimeline;

};

var nickname = "Placeholder";
var name = "Placeholder";
var avatar = "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
var text = "Placeholder";
var date: number;
var retweets = 1;
var quotedTweets = 0;
var likes = 5;

interface TweetTimeline {
  tweetNumber: number;
}

export default function TweetTimeline({ tweetNumber }: TweetTimeline): JSX.Element {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    setLoading(true)
    fetch('/api/twitter/timeline')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log("data: ", data)
        nickname = data[tweetNumber].author.name ?? "New Placeholder";
        name = data[tweetNumber].author.username ?? "New Placeholder";
        avatar = data[tweetNumber].author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
        text = data[tweetNumber].tweet.text ?? "New Placeholder";
        date = Date.parse(data[tweetNumber].tweet.created_at) ?? "New Placeholder";
        retweets = data[tweetNumber].tweet.public_metrics.retweet_count ?? 10;
        quotedTweets = data[tweetNumber].tweet.public_metrics.quote_count ?? 10;
        likes = data[tweetNumber].tweet.public_metrics.like_count ?? 10;
        setLoading(false)
      })
  }, [tweetNumber])

  // useEffect(() => {
  //   // console.log("data: ", data)
  //   nickname = data[tweetNumber].author.name ?? "New Placeholder";
  //   name = data[tweetNumber].author.username ?? "New Placeholder";
  //   avatar = data[tweetNumber].author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
  //   text = data[tweetNumber].tweet.text ?? "New Placeholder";
  //   date = Date.parse(data[tweetNumber].tweet.created_at) ?? "New Placeholder";
  //   retweets = data[tweetNumber].tweet.public_metrics.retweet_count ?? 10;
  //   quotedTweets = data[tweetNumber].tweet.public_metrics.quote_count ?? 10;
  //   likes = data[tweetNumber].tweet.public_metrics.like_count ?? 10;
  // }, [tweetNumber])

  if (loading) return <p>Loading Tweet...</p>
  if (!data) return <p>No tweet :/</p>

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
      date: new Date(date).toLocaleString('en-US'),
      app: "Twitter for AI",
      retweets: retweets,
      quotedTweets: quotedTweets,
      likes: likes
    }} />
  )
}
