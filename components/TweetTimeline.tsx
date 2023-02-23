import FakeTweet from "fake-tweet";
import { useState, useEffect } from "react";
import { TweetConfig, loadTweet, makeAITweet } from "../utils/tweetHelper";


const [tweetIndex, setTweetIndex] = useState(0);
const [score, setScore] = useState(0);
const [isAI, setIsAI] = useState(false);

function userGuess(userAns: string) {
  if ((userAns == "ai") == isAI) {
    var isNextAI = Math.random() > 0.1 ? false : true;
    setIsAI(isNextAI);
    setTweetIndex(tweetIndex + 1)
    setScore(score + 1)
  } else {
    // store last score
    localStorage.setItem("lastScore", score.toString())
    // store highest score, if needed
    if (score > parseInt(localStorage.getItem("highScore") ?? "0")) {
      localStorage.setItem("highScore", score.toString())
    }
    // store tweet that fooled them
    localStorage.setItem("lastTweet", tweetIndex.toString())
    localStorage.setItem("lastTweetType", isAI ? "ai" : "human")
    setScore(0)
    // alert("You lost!")
    location.href = '/endgame'
  }
};

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
      if (props.AI == true) {
        await makeAITweet(newTweet)
        setTweet(newTweet)
        setLoading(false)
      } else {
        setTweet(newTweet)
        setLoading(false)
      }
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
