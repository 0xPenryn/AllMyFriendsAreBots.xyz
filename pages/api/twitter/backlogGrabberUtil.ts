import { getToken } from 'next-auth/jwt';
import { TwitterApi, TweetV2, UserV2, TwitterV2IncludesHelper } from 'twitter-api-v2';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type TweetConfig = {
  user: {
    nickname: string;
    name: string;
    avatar: string;
    verified: boolean;
    locked: boolean;
    id: string;
  };
  display: string;
  text: string;
  image: Array<string>;
  date: string;
  app: string;
  retweets: number;
  quotedTweets: number;
  likes: number;
  AI: boolean;
  id: string;
}

interface UnparsedTweet {
  tweet: TweetV2;
  author: UserV2 | null;
}

function parseTweet(unparsedTweet: UnparsedTweet) {
  var parsedTweet: TweetConfig = {
    user: {
      nickname: unparsedTweet.author?.username!,
      name: unparsedTweet.author?.name!,
      avatar: unparsedTweet.author?.profile_image_url!,
      verified: unparsedTweet.author?.verified!,
      locked: unparsedTweet.author?.protected!,
      id: unparsedTweet.author?.id!,
    },
    display: "default",
    //for no links
    // text: unparsedTweet.tweet.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "Placeholder Tweet",
    // for links
    text: unparsedTweet.tweet.text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "Placeholder Tweet",
    image: [],
    // for tweets that include media
    // for (let i = 0; i < data[tweetNumber]?.tweet?.attachments?.media_keys.length ?? 0; i++) {
    //   image.push(data[tweetNumber]?.media[i].url)
    // }
    date: new Date(Date.parse(unparsedTweet.tweet.created_at!)).toLocaleString(),
    app: "Twitter for AI",
    retweets: unparsedTweet.tweet.public_metrics?.retweet_count ?? -1,
    quotedTweets: unparsedTweet.tweet.public_metrics?.quote_count ?? -1,
    likes: unparsedTweet.tweet.public_metrics?.like_count ?? -1,
    AI: false,
    id: unparsedTweet.tweet.id ?? "0",
  }
  return parsedTweet;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {

  console.log("backlog was called!")

  const token = await getToken({ req });

  if (!token?.access_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  var tweetList: Array<TweetConfig> = [];

  const client = new TwitterApi(token.access_token as string);

  var tweetSearch = await client.v2.search('ai is:verified lang:en -is:retweet -is:reply', {
    'tweet.fields': ['attachments', 'author_id', 'conversation_id', 'created_at', 'id', 'in_reply_to_user_id', 'lang', 'possibly_sensitive', 'referenced_tweets', 'source', 'text', 'withheld', 'public_metrics'],
    expansions: ['attachments.media_keys', 'attachments.poll_ids', 'referenced_tweets.id', 'author_id', 'entities.mentions.username', 'geo.place_id', 'in_reply_to_user_id', 'referenced_tweets.id.author_id'],
    'media.fields': ['url'],
    'user.fields': ['created_at', 'description', 'entities', 'id', 'location', 'name', 'pinned_tweet_id', 'profile_image_url', 'protected', 'public_metrics', 'url', 'username', 'verified', 'withheld'],
    'max_results': 100,
  })

  tweetSearch.fetchNext();
  tweetSearch.fetchNext();
  tweetSearch.fetchNext();
  tweetSearch.fetchNext();
  tweetSearch.fetchNext();
  tweetSearch.fetchNext();

  const includes = new TwitterV2IncludesHelper(tweetSearch);

  for (const tweet of tweetSearch.tweets) {
    // ignores tweets with polls, quotes, media, and by protected users
    if (!includes.poll(tweet) && !includes.quote(tweet) && !tweet.attachments && !includes.author(tweet)?.protected) {
      const parsedTweet = parseTweet({
        tweet: tweet,
        author: includes.author(tweet)!,
      })
      console.log("adding to list:", parsedTweet);
      // doAi(parsedTweet);
      tweetList.push(parsedTweet);
    }
  }

  return res.status(200).send(tweetList);
}