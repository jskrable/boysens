import json
import boto3


def lambda_handler(event, context):
    # TODO implement
    memories = get_memories()
    return {
        'statusCode': 200,
        'body': json.dumps(memories)
    }


def get_memories(limit=None):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('memories')
    data = table.scan()
    return data
