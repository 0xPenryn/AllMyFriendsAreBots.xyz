import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { TwitterApi } from 'twitter-api-v2';

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
    const homeTimeline = await client.v2.homeTimeline({ exclude: 'replies' });

    for (const fetchedTweet of homeTimeline) {
      console.log("fetched: ", fetchedTweet);
      console.log("processed: ", await client.v2.singleTweet(fetchedTweet.id));
    }

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