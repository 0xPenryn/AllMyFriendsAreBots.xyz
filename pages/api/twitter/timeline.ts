import { getToken } from 'next-auth/jwt';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterV2IncludesHelper } from 'twitter-api-v2';
import { NextApiRequest } from 'next';
import { parseTweet } from '../../../utils/tweetHelper';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { json } from 'stream/consumers';

// export const config = {
//   runtime: "edge",
// };


export default async function handler(req: VercelRequest, res: VercelResponse) {
  // const encoder = new TextEncoder();

  console.log("timeline was called!")

  const token = await getToken({ req });

  if (!token?.access_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // for (const tweet of homeTimeline.tweets) {
  //   // to avoid media in tweets
  //   if (!includes.poll(tweet) && !includes.quote(tweet) && !tweet.attachments) {
  //     body.push(parseTweet({
  //       tweet: tweet,
  //       author: includes.author(tweet) ?? null,
  //     }));
  //   }
    // to show media in tweets
    /* if (!includes.poll(tweet) && !includes.quote(tweet)) {
      body.push({
        tweet: tweet,
        author: includes.author(tweet),
        media: includes.medias(tweet) ?? null,
      });
    } */

  // }

  var tweetList = [];

  const client = new TwitterApi(token.access_token as string);
      const homeTimeline = await client.v2.homeTimeline({
        'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld', 'public_metrics'],
        expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id'],
        'media.fields': ['url'],
        'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
        exclude: ['retweets', 'replies'],
      });
      const includes = new TwitterV2IncludesHelper(homeTimeline);

      for (const tweet of homeTimeline.tweets) {
        if (!includes.poll(tweet) && !includes.quote(tweet) && !tweet.attachments) {
          const parsedTweet = parseTweet({
            tweet: tweet,
            author: includes.author(tweet) ?? null,
          })
          console.log("adding to list:", parsedTweet);
          tweetList.push(parsedTweet);
        }
      }

  const customReadable = new ReadableStream({
    async start(controller) {
      const client = new TwitterApi(token.access_token as string);
      const homeTimeline = await client.v2.homeTimeline({
        'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld', 'public_metrics'],
        expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id'],
        'media.fields': ['url'],
        'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
        exclude: ['retweets', 'replies'],
      });

      homeTimeline.fetchNext(250);
      const includes = new TwitterV2IncludesHelper(homeTimeline);

      for (const tweet of homeTimeline.tweets) {
        if (!includes.poll(tweet) && !includes.quote(tweet) && !tweet.attachments) {
          const parsedTweet = parseTweet({
            tweet: tweet,
            author: includes.author(tweet) ?? null,
          })
          console.log("queueing:", parsedTweet);
          controller.enqueue(parsedTweet);
        }
      }
      console.log("closing controller")
      controller.close()
    },
    // pull(controller) {
    //   const timelinePage = homeTimeline.next();
    //   timelinePage.then((timelinePage) => {
    //     for (const tweet of timelinePage.tweets) {
    //       if (!includes.poll(tweet) && !includes.quote(tweet) && !tweet.attachments) {
    //         const parsedTweet = parseTweet({
    //           tweet: tweet,
    //           author: includes.author(tweet) ?? null,
    //         })
    //         console.log(parsedTweet);
    //         controller.enqueue(parsedTweet);
    //       }
    //     }
    //   })
    // }
  },
    // { highWaterMark: 3 }
  );

  // return new Response(customReadable);
  return res.status(200).send(tweetList);
}

// https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/paginators.md for reference here

// async (req: NextRequest, res: Response) => {

//   const token = await getToken({ req });

//   if (!token) {
//     return res.status(401).json({
//       status: 'Unauthorized'
//     });
//   }

//   try {
//     const client = new TwitterApi(token.access_token);
//     const homeTimeline = await client.v2.homeTimeline({
//       'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld', 'public_metrics'],
//       expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id'],
//       'media.fields': ['url'],
//       'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
//       exclude: ['retweets', 'replies'],
//     });
//     await homeTimeline.fetchLast(1000);
//     const includes = new TwitterV2IncludesHelper(homeTimeline);
//     const body = [];
//     for (const tweet of homeTimeline.tweets) {
//       // to show media in tweets
//       /* if (!includes.poll(tweet) && !includes.quote(tweet)) {
//         body.push({
//           tweet: tweet,
//           author: includes.author(tweet),
//           media: includes.medias(tweet) ?? null,
//         });
//       } */
//       // to avoid media in tweets
//       if (!includes.poll(tweet) && !includes.quote(tweet) && !tweet.attachments) {
//         body.push(parseTweet({
//           tweet: tweet,
//           author: includes.author(tweet) ?? null,
//         }));
//       }
//     }

//     return res.status(200).json(body);
//   } catch (e) {
//     return res.status(400).json({
//       status: e.message
//     });
//   }
// }

// const handler = async (req: NextApiRequest, res: Response): Promise<Response> => {

  

//   // await homeTimeline.fetch();
//   const includes = new TwitterV2IncludesHelper(homeTimeline);

//   for (const tweet of homeTimeline.tweets) {
//     // to avoid media in tweets
//     if (!includes.poll(tweet) && !includes.quote(tweet) && !tweet.attachments) {
//       // body.push(parseTweet({
//       //   tweet: tweet,
//       //   author: includes.author(tweet) ?? null,
//       // }));
//     }
//     // to show media in tweets
//     /* if (!includes.poll(tweet) && !includes.quote(tweet)) {
//       body.push({
//         tweet: tweet,
//         author: includes.author(tweet),
//         media: includes.medias(tweet) ?? null,
//       });
//     } */

//   }

//   const payload: TweetStream = {
    
//   };

//   const stream = await OpenAIStream(payload);
//   return new Response(stream);
// };

// export default handler;
