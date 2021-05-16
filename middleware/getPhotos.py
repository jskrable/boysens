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

    bucket = client('s3')  # again assumes boto.cfg setup, assume AWS S3
    for key in conn.list_objects(Bucket='bucket_name')['Contents']:
    print(key['Key'])