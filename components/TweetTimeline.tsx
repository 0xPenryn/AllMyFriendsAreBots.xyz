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
var date = "Placeholder";
var retweets = 1;
var quotedTweets = 0;
var likes = 5;

export default function TweetTimeline(): JSX.Element {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    fetch('/api/twitter/timeline')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log("data: ", data)
        nickname = data[0].author.name ?? "New Placeholder";
        name = data[0].author.username ?? "New Placeholder";
        avatar = data[0].author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
        text = data[0].tweet.text ?? "New Placeholder";
        date = Date.parse(data[0].tweet.created_at).toLocaleString('en-US') ?? "New Placeholder";
        retweets = data[0].tweet.public_metrics.retweet_count ?? 10;
        quotedTweets = data[0].tweet.public_metrics.quote_count ?? 10;
        likes = data[0].tweet.public_metrics.like_count ?? 10;
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading Timeline...</p>
  if (!data) return <p>No timeline</p>

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
