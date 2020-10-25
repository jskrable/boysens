
echo Deploying site code to S3 bucket
aws s3 sync /home/jskrable/code/boysens/frontend/ s3://theboysens.com

echo Compressing lambda functions
zip middleware/package/getMemories.zip middleware/getMemories.py -j
zip middleware/package/saveMemory.zip middleware/saveMemory.py -j

echo Deploying lambda functions
aws lambda update-function-code --function-name 'getMemories' --zip-file fileb://./middleware/package/getMemories.zip --region 'us-east-2'
aws lambda update-function-code --function-name 'saveMemory' --zip-file fileb://./middleware/package/saveMemory.zip --region 'us-east-2'

