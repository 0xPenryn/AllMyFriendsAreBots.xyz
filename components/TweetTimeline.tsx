import FakeTweet from "fake-tweet";
import { useState, useEffect } from "react";
import { TweetConfig, loadTweet, makeAITweet } from "../utils/tweetHelper";

export default function TweetTimeline( props: { tweetNumber: number, AI: boolean } ): JSX.Element {

  const [tweet, setTweet] = useState({
      user: {
          nickname: "string",
          name: "str",
          avatar: "string",
          verified: false,
          locked: false,
      },
      display: "default",
      text: "string",
      image: [],
      date: "string",
      app: "Twitter for AI",
      retweets: -1,
      quotedTweets: -1,
      likes: -1,
      AI: false,
  } as TweetConfig);

  const [loading, setLoading] = useState(true);
  const [nextTweet, setNextTweet] = useState({});

  // loadTweet(props.tweetNumber).then((newTweet) => {
  //   console.log("loadTweet returned: ", newTweet)
  //   if (props.AI = true) {
  //     makeAITweet(newTweet)
  //   }
  //   setTweet(newTweet)
  //   setLoading(false);
  // });

  useEffect(() => {
    setLoading(true)
    const loadEffect = async () => {
      const newTweet = await loadTweet(props.tweetNumber)
      console.log("loadTweet returned: ", newTweet)
      setTweet(newTweet)
      if (props.AI == true) {
        await makeAITweet(newTweet)
        setTweet(newTweet)
      }
      setLoading(false);
    }
    loadEffect();
  }, [props.tweetNumber])

  if (loading) return <p>Loading Tweets...</p>
  // if (!data) return <p>No tweets :/</p>
  // if (tweetNumber > data.length - 1) return <p>Out of tweets! Pat yourself on the back. Now sign out and sign back in, and you can get the newest Tweets from your timeline!</p>

  // console.log("FakeTweet sees:", tweet)
  return (
    <FakeTweet config={tweet} />
  )
}
