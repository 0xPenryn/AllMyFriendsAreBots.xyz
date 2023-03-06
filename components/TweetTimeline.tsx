import FakeTweet from "fake-tweet";
import { TweetConfig } from "../utils/tweetHelper";

export default function TweetTimeline( props: { tweet: TweetConfig } ): JSX.Element {
  return (
    <FakeTweet config={props.tweet} />
  )
}
