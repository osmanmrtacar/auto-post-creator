import {
  APIGatewayEvent,
  APIGatewayProxyCallback,
  Context,
  Handler,
} from 'aws-lambda';
import axios from 'axios';
import {
  ExtendedEntities,
  Medum,
  Medum2,
  TimelineResponse,
} from '../src/interfaces';
import {Chatgpt} from '../src/chatgpt';
import {Twitter} from '../src/twitter';
import {
  DynamoDB,
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb';

const enum PROMPT_TYPES {
  CLASSIFY = 1,
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
    return callback(null, {
      statusCode: 404,
      body: JSON.stringify({
        type: 4,
        data: {
          content: 'No header',
        },
      }),
    });
  }

  const twitter = new Twitter(session?.header);

  const {Item: chatgptKey} = await ddbDocClient.get({
    TableName: credentialsTableName,
    Key: {
      sessionId: '2',
    },
  });

  const chatgpt = new Chatgpt(chatgptKey?.key);

  const seenTweets = await ddbDocClient.scan({
    TableName: tweetsTable,
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

  const shareablePosts: {
    id: string;
    resp: string | undefined;
    media: string[] | undefined;
    fullText: string | undefined;
    postId: string | undefined;
    via: string | undefined;
  }[] = [];

  const queryResponse = await ddbDocClient.scan({
    TableName: promptsTableName,
    FilterExpression: '#type = :type and #active = :active',
    ExpressionAttributeValues: {
      ':type': PROMPT_TYPES.CLASSIFY,
      ':active': true,
    },
    ExpressionAttributeNames: {
      '#type': 'type',
      '#active': 'active',
    },
    Limit: 1,
  });

  const activeClassifyPrompt = queryResponse?.Items?.[0];

  console.log(!!activeClassifyPrompt);

  await Promise.all(
    posts.map(async cl => {
      if (cl.fullText) {
        const resp = await chatgpt.classifyTweet(
          cl.fullText,
          activeClassifyPrompt?.prompt
        );

        if (!resp?.toLocaleLowerCase().includes('unrelated')) {
          shareablePosts.push({...cl, resp});
        }
      }

      return undefined;
    })
  );

  for await (const post of posts) {
    await ddbDocClient.put({
      TableName: tweetsTable,
      Item: {
        tweetId: post.id,
      },
    });
  }

  for await (const iterator of shareablePosts.slice(0, 3)) {
    await ddbDocClient.put({
      TableName: tweetsTable,
      Item: {
        tweetId: iterator.id,
        sentDm: true,
        chatgpt: iterator.resp,
      },
    });
    await twitter.sendDm(
      '1674386938789232640',
      iterator.resp + '\n' + iterator.media?.join('\n')
    );

    await sleep(5000);
  }

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      type: 4,
      data: {
        content: 'Hello, World.',
      },
    }),
  });
};
