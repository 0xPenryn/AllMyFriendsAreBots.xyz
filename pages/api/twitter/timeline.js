import { getToken } from 'next-auth/jwt';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterV2IncludesHelper } from 'twitter-api-v2';

// https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/paginators.md for reference here

export default async (req, res) => {

  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({
      status: 'Unauthorized'
    });
  }

  try {
    const client = new TwitterApi(token.access_token);
    const homeTimeline = await client.v2.homeTimeline({
      'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld', 'public_metrics'],
      expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id'],
      'media.fields': ['url'],
      'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
      exclude: ['retweets', 'replies'],
    });
    const includes = new TwitterV2IncludesHelper(homeTimeline);
    const body = [];
    for (const tweet of homeTimeline.tweets) {
      if (!includes.poll(tweet) && !includes.quote(tweet)) {
        body.push({
          tweet: tweet,
          author: includes.author(tweet),
          media: includes.medias(tweet) ?? null,
        });
      }
    }

    return res.status(200).json(body);
  } catch (e) {
    return res.status(400).json({
      status: e.message
    });
  }
}