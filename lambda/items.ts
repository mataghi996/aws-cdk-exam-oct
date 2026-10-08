import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDBClient({});

export const handler = async (event: any) => {

  const id = event.pathParameters?.id;


  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');

    await dynamodb.send(new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: { S: body.id },
        name: { S: body.name }
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item added' })
    };
  }

  if (event.httpMethod === 'GET') {
    const result = await dynamodb.send(new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: { S: id }
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item || {})
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Invalid request' })
  };
};