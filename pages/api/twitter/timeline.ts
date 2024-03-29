import { getToken } from 'next-auth/jwt';
import { ApiResponseError, TweetHomeTimelineV2Paginator, TwitterApi } from 'twitter-api-v2';
import { TwitterV2IncludesHelper, TweetV2HomeTimelineParams } from 'twitter-api-v2';
import { parseTweet } from '../../../utils/tweetHelper';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {

  console.log("timeline was called!")

  const token = await getToken({ req });

  if (!token?.access_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  var tweetList = [];

  const client = new TwitterApi(token.access_token as string);

  var homeTimeline: TweetHomeTimelineV2Paginator;

  const timelineFieldsWithID: TweetV2HomeTimelineParams = {
    'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld', 'public_metrics'],
    expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id'],
    'media.fields': ['url'],
    'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
    exclude: ['retweets', 'replies'],
    'until_id': req.body.until_id,
  };

  const timelineFields: TweetV2HomeTimelineParams = {
    'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld', 'public_metrics'],
    expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id'],
    'media.fields': ['url'],
    'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
    exclude: ['retweets', 'replies'],
  };

  var fieldsToGet = timelineFields;

  if (req.body) fieldsToGet = timelineFieldsWithID;

  for (var tries = 0; tries < 20; tries++) {
    try {
      console.log("trying to get timeline, try number:", tries)
      homeTimeline = await client.v2.homeTimeline(fieldsToGet);
    } catch (error) {
      console.log("error getting timeline, trying again");
      // console.log("error: ", error);
      continue;
    }
    // console.log("homeTimeline:", homeTimeline!);
    break;
  }

  const includes = new TwitterV2IncludesHelper(homeTimeline!);

  for (const tweet of homeTimeline!.tweets) {
    // ignores tweets with polls, quotes, media, and by protected users
    if (!includes.poll(tweet) && !includes.quote(tweet) && !tweet.attachments && !includes.author(tweet)?.protected) {
      const parsedTweet = parseTweet({
        tweet: tweet,
        author: includes.author(tweet)!,
      })
      // console.log("adding to list:", parsedTweet);
      tweetList.push(parsedTweet);
    }
  }
  return res.status(200).send(tweetList);
}