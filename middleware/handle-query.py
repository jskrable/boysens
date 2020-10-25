import json
import boto3
import datetime
import uuid


def lambda_handler(event, context):

    
    saved = update_table(event['memory'])

    return {
        'statusCode': 200,
        'body': json.dumps({"message": "Submitted"})} 


def update_table(memory):

    dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
    history = dynamodb.Table('memories')

    item = {
        'id': uuid.uuid1().hex,
        'memory': submission,
        'timestamp': str(datetime.datetime.now())
    }

    history.put_item(
        Item = item
    )
