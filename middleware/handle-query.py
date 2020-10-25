import json
import boto3
import random
import os
import datetime


def lambda_handler(event, context):

    interrogatives = ['who','what','when','where','why','how','which','whose']
    keywords = ['watch','eat','weather','name','game','win','live','are','you']
    quips = ["Hey, Pop... Never mind, he's asleep.",
            "You've got something on your shirt...",
            "You can't get that on antenna TV.",
            "You should know that! We talked about it yesterday",
            "I want to eat, eat, eat, yablaka and banaans.",
            "Only Grammy knows that one.",
            "That's stupid.",
            "I'd ask my sister, but she's an idiot"]
    query = event['query']
    # terms = query.split(' ')
    score = []
    [score.append(x) for x in interrogatives if x in query]
    [score.append(x) for x in keywords if x in query]

    update_table(query)

    if 'what' and 'name' in score:
        response = "I'm Uncle Paul. It says my name all over the screen."
    elif 'where' and 'you' and 'live' in score:
        response = "I live in this computer now. I don't even have internet. Pretty cool, right?"
    else:
        response = quips[random.randint(0,len(quips))-1]
        #response = "You've got something on your shirt..."

    return {
        'statusCode': 200,
        'body': json.dumps(response)} 


def update_table(submission):

    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    history = dynamodb.Table('question-history')

    item = {
        'question': submission,
        'timestamp': str(datetime.datetime.now())
    }

    history.put_item(
        Item = item
    )
