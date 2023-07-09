import {
  APIGatewayEvent,
  APIGatewayProxyCallback,
  Context,
  Handler,
} from 'aws-lambda';

import {Chatgpt} from '../src/chatgpt';
import {Twitter} from '../src/twitter';
import {TimeLineService} from '../src/timeline.service';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb';

const enum PROMPT_TYPES {
  CLASSIFY = 1,
  TWITTER = 2,
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const ddClient = new DynamoDBClient({region: 'eu-west-1'});

const ddbDocClient = DynamoDBDocument.from(ddClient);

export const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
) => {
  const credentialsTableName = process.env.CREDENTIALS_TABLE;
  const promptsTableName = process.env.PROMPTS_TABLE;
  const tweetsTable = process.env.TWEETS_TABLE;

  const {Item: session} = await ddbDocClient.get({
    TableName: credentialsTableName,
    Key: {
      sessionId: '1',
    },
  });

  if (!session?.header) {
    return callback('no session header');
  }

  const twitter = new Twitter(session?.header);

  const {Item: chatgptKey} = await ddbDocClient.get({
    TableName: credentialsTableName,
    Key: {
      sessionId: '2',
    },
  });

  const chatgpt = new Chatgpt(chatgptKey?.key);
  const timeLineSvc = new TimeLineService(chatgpt);

  const seenTweets = await ddbDocClient.scan({
    TableName: tweetsTable,
    IndexName: 'dateIndex',
    FilterExpression: '#seenDate > :seenDate',
    ExpressionAttributeValues: {
      ':seenDate': new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    ExpressionAttributeNames: {
      '#seenDate': 'seenDate',
    },
  });

  const seenTweetIds = seenTweets.Items?.map(tweets => tweets.tweetId);

  const seenTweetIdLookup = seenTweetIds?.reduce((acc, tweetId) => {
    return {
      ...acc,
      [tweetId]: true,
    };
  }, {});

  const posts = await twitter.getTimeLinePosts(
    seenTweetIdLookup,
    Object.keys(seenTweetIdLookup)
  );

  if (!posts.length) {
    return callback('no posts');
  }

  const allPrompts = await ddbDocClient.scan({
    TableName: promptsTableName,
    FilterExpression: '#active = :active',
    ExpressionAttributeValues: {
      ':active': true,
    },
    ExpressionAttributeNames: {
      '#active': 'active',
    },
  });

  const activeClassifyPrompt = allPrompts?.Items?.find(
    item => item.type === PROMPT_TYPES.CLASSIFY
  );
  const activeTweetPrompt = allPrompts?.Items?.find(
    item => item.type === PROMPT_TYPES.TWITTER
  );

  console.log(!!activeClassifyPrompt);

  if (!activeClassifyPrompt) {
    return callback('no activeClassifyPrompt');
  }

  const shareablePosts = await timeLineSvc.getSharablePosts(
    posts,
    activeClassifyPrompt?.prompt
  );

  console.log(JSON.stringify({shareablePosts: shareablePosts.length}));

  for await (const post of posts) {
    await ddbDocClient.put({
      TableName: tweetsTable,
      Item: {
        tweetId: post.id,
        seenDate: new Date().toISOString(),
      },
    });
  }

  for await (const iterator of shareablePosts.slice(0, 3)) {
    const newTweet = await chatgpt.createNewTweet(
      iterator.fullText ?? '',
      activeTweetPrompt?.prompt
    );
    const answer = JSON.parse(newTweet ?? '{}')?.target_audience_tweet;

    if (!answer) {
      return callback('No Answer');
    }
    await ddbDocClient.put({
      TableName: tweetsTable,
      Item: {
        tweetId: iterator.id,
        sentDm: true,
        categories: {
          primary: iterator.primary,
          secondary: iterator.secondary,
        },
        newTweet: answer,
      },
    });

    await twitter.sendDm(
      '1674386938789232640',
      answer + '\n' + iterator.media?.join('\n')
    );

    await sleep(1000);
  }

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      type: 4,
      data: {
        success: true,
      },
    }),
  });
};
