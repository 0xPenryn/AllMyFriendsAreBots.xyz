import { TweetHomeTimelineV2Paginator, TweetV2, TwitterApi, TwitterV2IncludesHelper } from 'twitter-api-v2';
import FakeTweet from "fake-tweet";
import { useState, useEffect } from "react";

var nickname = "Placeholder";
var name = "Placeholder";
var avatar = "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
var text = "Placeholder";
var image: Array<string> = [];
var date: number = 0;
var retweets = 1;
var quotedTweets = 0;
var likes = 5;

interface TweetTimeline {
  tweetNumber: number;
}

export default function TweetTimeline({ tweetNumber }: TweetTimeline): JSX.Element {

  const [data, setData] = useState([] as Array<any>);
  const [loading, setLoading] = useState(true);
  const [handoff, setHandoff] = useState(false);
  // const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    setLoading(true)
    fetch('/api/twitter/timeline')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log("first data: ", data)
        console.log("first tweetNumber: ", tweetNumber)
        nickname = data[tweetNumber].author.username ?? "New Placeholder";
        console.log("first nickname: ", nickname)
        name = data[tweetNumber].author.name ?? "New Placeholder";
        avatar = data[tweetNumber].author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
        text = data[tweetNumber].tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '') ?? "New Placeholder";
        image = [];
        for (let i = 0; i < data[tweetNumber].tweet?.attachments?.media_keys.length ?? 0; i++) {
          image.push(data[tweetNumber].media[i].url)
        }
        date = Date.parse(data[tweetNumber].tweet.created_at) ?? "New Placeholder";
        retweets = data[tweetNumber].tweet.public_metrics.retweet_count ?? 10;
        quotedTweets = data[tweetNumber].tweet.public_metrics.quote_count ?? 10;
        likes = data[tweetNumber].tweet.public_metrics.like_count ?? 10;
        // setLoading(false)
        setLoading(false)
        // setHandoff(true)
        console.log("end of first effect")
      })
  }, [])

  useEffect(() => {
    // if (!handoff) return () => {<p>what the hell is going on</p>}
    if (loading) return () => {<p>Loading Tweet...</p>}
    if (!data) return () => {<p>No Tweet :/</p>}
    // console.log("second data: ", data)
    console.log("second tweetNumber: ", tweetNumber)
    nickname = data[tweetNumber].author.username ?? "New Placeholder";
    console.log("second nickname: ", nickname)
    name = data[tweetNumber].author.name ?? "New Placeholder";
    avatar = data[tweetNumber].author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
    text = data[tweetNumber].tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '') ?? "New Placeholder";
    image = [];
    for (let i = 0; i < data[tweetNumber].tweet?.attachments?.media_keys.length ?? 0; i++) {
      image.push(data[tweetNumber].media[i].url)
    }
    date = Date.parse(data[tweetNumber].tweet.created_at) ?? "New Placeholder";
    retweets = data[tweetNumber].tweet.public_metrics.retweet_count ?? 10;
    quotedTweets = data[tweetNumber].tweet.public_metrics.quote_count ?? 10;
    likes = data[tweetNumber].tweet.public_metrics.like_count ?? 10;
    console.log("end of second effect")
    return () => {
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
        image: image,
        date: new Date(date).toLocaleString('en-US'),
        app: "Twitter for AI effect",
        retweets: retweets,
        quotedTweets: quotedTweets,
        likes: likes
      }} />
    }
  }, [tweetNumber, handoff, data])

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
      image: image,
      date: new Date(date).toLocaleString('en-US'),
      app: "Twitter for AI",
      retweets: retweets,
      quotedTweets: quotedTweets,
      likes: likes
    }} />
  )
}
