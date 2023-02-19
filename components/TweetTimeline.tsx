import { TweetHomeTimelineV2Paginator, TwitterApi, TwitterV2IncludesHelper } from 'twitter-api-v2';
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

export default function TweetTimeline(): JSX.Element {

  // const tweets = props.tweets;

  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  var tweets = [] as any;

  useEffect(() => {
    setLoading(true)
    tweets = fetch('/api/twitter/timeline')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log("data: ", data ?? "no data")
        setLoading(false)
        getTweets().then((tweets) => {
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
        });
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No Timeline</p>

  var nickname = "Placeholder";
  var name = "Placeholder";
  var avatar = "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
  var text = "Placeholder";
  var date = "Placeholder";

  // nickname = tweets[0].author.name ?? "New Placeholder";
  // name = tweets[0].author.username ?? "New Placeholder";
  // avatar = tweets[0].author.profile_image_url ?? "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg";
  // text = tweets[0].tweet.text ?? "New Placeholder";
  // date = tweets[0].tweet.created_at ?? "New Placeholder";

  getTweets().then((tweets) => {
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
  });

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
