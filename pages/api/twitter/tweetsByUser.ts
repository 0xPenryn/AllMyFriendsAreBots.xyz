import { getToken } from 'next-auth/jwt';
import { TweetUserTimelineV2Paginator, TweetV2HomeTimelineParams, TwitterApi } from 'twitter-api-v2';
import { TwitterV2IncludesHelper } from 'twitter-api-v2';
import { parseTweet } from '../../../utils/tweetHelper';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {

  // console.log("timeline was called!")

  const token = await getToken({ req });

  if (!token?.access_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  var tweetList = [];

  const client = new TwitterApi(token.access_token as string);

  var tweetsOfUser: TweetUserTimelineV2Paginator;

  var timelineFields: TweetV2HomeTimelineParams = {
    'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld', 'public_metrics'],
    expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id'],
    'media.fields': ['url'],
    'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
    exclude: ['replies', 'retweets'],
    max_results: 25,
  };

  if (req.body) {
    for (var tries = 0; tries < 20; tries++) {
      try {
        console.log("trying to get user timeline, try number:", tries)
        tweetsOfUser = await client.v2.userTimeline(req.body.user_id, timelineFields);
      } catch (error) {
        console.log("error getting user timeline, trying again");
        continue;
      }
      break;
    }
  } else {
    return res.status(418).json({ message: 'I\'m a teapot, and you didn\'t include a userID' })
  }

  const includes = new TwitterV2IncludesHelper(tweetsOfUser!);

  for (const tweet of tweetsOfUser!.tweets) {
    // ignores tweets with polls, quotes, media, and by protected users
    if (!includes.poll(tweet) && !includes.quote(tweet) && !tweet.attachments && !includes.author(tweet)?.protected && !tweet.in_reply_to_user_id) {
      const parsedTweet = parseTweet({
        tweet: tweet,
        author: includes.author(tweet)!,
      }).text
      // console.log("adding to list:", parsedTweet);
      tweetList.push(parsedTweet);
    }
  }
  // console.log("tweets from User ", req.body.userID, ":", tweetList)
  return res.status(200).send(tweetList);
}