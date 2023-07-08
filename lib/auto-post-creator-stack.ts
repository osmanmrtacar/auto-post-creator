import * as cdk from 'aws-cdk-lib';
import {AttributeType, Table} from 'aws-cdk-lib/aws-dynamodb';
import {Rule, Schedule} from 'aws-cdk-lib/aws-events';
import {LambdaFunction} from 'aws-cdk-lib/aws-events-targets';
import {ManagedPolicy, Role, ServicePrincipal} from 'aws-cdk-lib/aws-iam';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Construct} from 'constructs';
import * as path from 'path';

export class AutoPostCreatorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaRole = new Role(this, 'AutoPostCreatorLambdaRole', {
      roleName: 'auto-post-creator-lambda-role',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
    );
    lambdaRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess')
    );
    lambdaRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole'
      )
    );

    const credentialsTable = new Table(this, 'CredentialsTable', {
      tableName: 'credentials',
      partitionKey: {
        name: 'sessionId',
        type: AttributeType.STRING,
      },
    });

    const promptsTable = new Table(this, 'PromptsTable', {
      tableName: 'prompts',
      partitionKey: {
        name: 'promptId',
        type: AttributeType.STRING,
      },
    });

    const tweetsTable = new Table(this, 'TweetsTable', {
      tableName: 'tweets',
      partitionKey: {
        name: 'tweetId',
        type: AttributeType.STRING,
      },
    });

    const timeLineLambda = new NodejsFunction(this, 'TimeLineHandler', {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '/../lambda/timeline.ts'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      role: lambdaRole,
      functionName: 'TimeLineLambda',
      retryAttempts: 1,
      environment: {
        CREDENTIALS_TABLE: credentialsTable.tableName,
        PROMPTS_TABLE: promptsTable.tableName,
        TWEETS_TABLE: tweetsTable.tableName,
      },
    });

    new Rule(this, 'Rule', {
      description: 'Schedule a Lambda that run every hour between',
      schedule: Schedule.cron({
        year: '*',
        month: '*',
        day: '*',
        hour: '6-21',
        minute: '15',
      }),
      targets: [new LambdaFunction(timeLineLambda)],
    });
  }
}
