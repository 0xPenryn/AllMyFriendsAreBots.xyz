import { getToken } from 'next-auth/jwt';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterV2IncludesHelper } from 'twitter-api-v2';
import { parseTweet, makeAITweet } from '../../../utils/tweetHelper';
import type { VercelRequest, VercelResponse } from '@vercel/node';


export default async function handler(req: VercelRequest, res: VercelResponse) {

  console.log("backlog was called!")

  const token = await getToken({ req });

  if (!token?.access_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  var tweetList = [];

  const client = new TwitterApi(token.access_token as string);

  var tweetSearch;

    tweetSearch = await client.v2.search("", {
      'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld', 'public_metrics'],
      expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id'],
      'media.fields': ['url'],
      'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
    })

    tweetSearch.fetchNext()
    tweetSearch.fetchNext()
    tweetSearch.fetchNext()
    tweetSearch.fetchNext()
    tweetSearch.fetchNext()
    tweetSearch.fetchNext()
    tweetSearch.fetchNext()
    tweetSearch.fetchNext()
    tweetSearch.fetchNext()
    tweetSearch.fetchNext()
    tweetSearch.fetchNext()
    tweetSearch.fetchNext()

  const includes = new TwitterV2IncludesHelper(tweetSearch);

  for (const tweet of tweetSearch.tweets) {
    // ignores tweets with polls, quotes, media, and by protected users
    if (!includes.poll(tweet) && !includes.quote(tweet) && !tweet.attachments && !includes.author(tweet)?.protected) {
      const parsedTweet = parseTweet({
        tweet: tweet,
        author: includes.author(tweet)!,
      })
      console.log("adding to list:", parsedTweet);
      tweetList.push(parsedTweet);
    }
  }

  var aiTweetList = [];

  for (const tweet of tweetList) {
    if (Math.random() > 0.5) {
      const aiTweet = makeAITweet(tweet)
      console.log("adding to list:", aiTweet);
      aiTweetList.push(aiTweet);
    } else {
      aiTweetList.push(tweet);
    }
  }
  
  return res.status(200).send(tweetList);
}