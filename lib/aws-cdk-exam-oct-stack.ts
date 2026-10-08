import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class AwsCdkExamOctStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'ExamTable', {
      tableName: 'ExamTable',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const role = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonDynamoDBFullAccess'
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        )
      ]
    });

    const itemsFunction = new lambdaNodejs.NodejsFunction(this, 'ItemsFunction', {
      entry: path.join(__dirname, '../lambda/items.ts'),
      handler: 'handler',
      role: role,
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    const api = new apigateway.RestApi(this, 'ExamAPI');
    const items = api.root.addResource('items');
    const lambdaIntegration = new apigateway.LambdaIntegration(itemsFunction);
      items.addMethod('POST', lambdaIntegration);
    const item = items.addResource('{id}');
      item.addMethod('GET', lambdaIntegration);

  }
  
}