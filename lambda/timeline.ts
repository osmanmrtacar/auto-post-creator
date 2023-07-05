import {
  APIGatewayEvent,
  APIGatewayProxyCallback,
  Context,
  Handler,
} from 'aws-lambda';
import axios from 'axios';
import {
  CLASSIFY_RESPONSE,
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
  TWITTER = 2,
}

const CLASSIFICATION_CATEGORIES = {
  MOVIE: 'Movie',
  TV: 'TV Shows',
  MUSIC: 'Music',
  PERSON: 'Person',
  TRAVEL: 'Travel',
  FINANCE: 'Finance',
  CRYPTO: ' Digital Assets & Crypto',
  NAN: 'NaN',
};

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
    categories?: CLASSIFY_RESPONSE;
    media: string[] | undefined;
    fullText: string | undefined;
    postId: string | undefined;
    via: string | undefined;
  }[] = [];

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
    return callback(null, {
      statusCode: 404,
      body: JSON.stringify({
        type: 4,
        data: {
          content: 'Hello, World.',
        },
      }),
    });
  }

  await Promise.all(
    posts.map(async tweet => {
      if (tweet.fullText) {
        const resp = await chatgpt.sendRequest(
          tweet.fullText,
          activeClassifyPrompt?.prompt
        );

        let parsedResp: CLASSIFY_RESPONSE = {};

        try {
          parsedResp = JSON.parse(resp ?? '{}');
        } catch (error) {
          console.log(JSON.stringify(error));
        }

        const {primary, secondary} = parsedResp;

        if (
          primary === CLASSIFICATION_CATEGORIES.MOVIE ||
          primary === CLASSIFICATION_CATEGORIES.TV ||
          secondary === CLASSIFICATION_CATEGORIES.MOVIE ||
          secondary === CLASSIFICATION_CATEGORIES.TV
        ) {
          shareablePosts.push({...tweet, categories: parsedResp});
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
    const newTweet = await chatgpt.sendRequest(
      iterator.fullText ?? '',
      activeTweetPrompt?.prompt
    );
    const answer = JSON.parse(newTweet ?? '{}')?.target_audience_tweet;

    if (!answer) {
      if (!activeClassifyPrompt) {
        return callback(null, {
          statusCode: 404,
          body: JSON.stringify({
            type: 4,
            data: {
              content: 'No Answer',
            },
          }),
        });
      }
    }
    await ddbDocClient.put({
      TableName: tweetsTable,
      Item: {
        tweetId: iterator.id,
        sentDm: true,
        categories: iterator.categories,
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
        content: 'Hello, World.',
      },
    }),
  });
};
