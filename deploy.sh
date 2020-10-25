

aws s3 sync /home/jskrable/code/boysens/frontend/ s3://boysens.com

zip middleware/package/getMemories.zip middleware/getMemories.py -j
zip middleware/package/saveMemory.zip middleware/saveMemory.py -j

aws lambda update-function-code --function-name 'getMemories' --zip-file fileb://./middleware/package/getMemories.zip --region 'us-east-2'
aws lambda update-function-code --function-name 'saveMemory' --zip-file fileb://./middleware/package/saveMemory.zip --region 'us-east-2'

