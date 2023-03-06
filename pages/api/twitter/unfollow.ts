import { getToken } from 'next-auth/jwt';
import { TwitterApi } from 'twitter-api-v2';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {

  console.log("timeline was called!")

  const token = await getToken({ req });

  if (!token?.access_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const targetID = req.body.targetID;

  const client = new TwitterApi(token.access_token as string);

  await client.v2.unfollow((await client.v2.me()).data.id, targetID);

  return res.status(200);
}