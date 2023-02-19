import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
// import Twitter from 'twitter-lite';
import { TwitterApi } from 'twitter-api-v2';

export default async (req, res) => {
  const session = await getSession({ req });
  const token = await getToken({ req });

  // for twitter-lite
  // const client = new Twitter({
  //   subdomain: "api", // "api" is the default (change for other subdomains)
  //   version: "1.1", // version "1.1" is the default (change for other subdomains)
  //   consumer_key: process.env.TWITTER_CLIENT_ID, // from Twitter.
  //   consumer_secret: process.env.TWITTER_CLIENT_SECRET, // from Twitter.
  //   access_token_key: token.access_token, // from your User (oauth_token)
  //   access_token_secret: token.refresh_token, // from your User (oauth_token_secret)
  // });  
  
  const client = new TwitterApi({
    appKey: process.env.TWITTER_CLIENT_ID, // from Twitter.
    appSecret: process.env.TWITTER_CLIENT_SECRET, // from Twitter.
    accessToken: token.access_token, // from your User (oauth_token)
    accessSecret: token.refresh_token, // from your User (oauth_token_secret)
  });

  // console.log(session ?? 'No session');
  // console.log(token ?? 'No token');

  const user = await client.currentUserV2()
  console.log(user ?? "No user");

  // for twitter-lite
  // client
  // .get("account/verify_credentials")
  // .then(results => {
  //   console.log("results", results);
  // })
  // .catch(console.error);

  try {
    return res.status(200).json({
      status: (session, 'Ok'),
      data: []
    });
  } catch (e) {
    return res.status(400).json({
      status: e.message
    });
  }
}