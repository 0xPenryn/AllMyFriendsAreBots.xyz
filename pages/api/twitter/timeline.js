import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterV2IncludesHelper } from 'twitter-api-v2';


// https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/paginators.md for reference here

export default async (req, res) => {

  try {
    const session = await getSession({ req });
    const token = await getToken({ req });

    // if (!session || !token) {
    //   return res.status(401).json({
    //     status: 'Unauthorized'
    //   });
    // }

    const client = new TwitterApi(token.access_token);
    // const user = await client.currentUserV2();
    const homeTimeline = await client.v2.homeTimeline({ 
      'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld'],
      expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id' ],
      'media.fields': ['url'], 
      'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
    });
    const includes = new TwitterV2IncludesHelper(homeTimeline);

    // console.log("homeTimeline: ", homeTimeline)
    console.log("first tweet: ", homeTimeline.tweets[0], includes.author(homeTimeline.tweets[0]), includes.tweets(homeTimeline.tweets[0]));

    // for (const fetchedTweet of homeTimeline) {
    //   console.log("fetched: ", fetchedTweet);
    //   console.log("processed: ", await client.v2.singleTweet(fetchedTweet.id));
    // }

    return res.status(200).json({
      status: (session, 'Ok'),
      data: homeTimeline
    });
  } catch (e) {
    return res.status(400).json({
      status: e.message
    });
  }
}