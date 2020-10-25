import subprocess


def deploy():

    # Set local env variables
    #path = 'c:/users/jskrable/code/unclepaulknowsall/'
    path = 'c:/users/jskra/code/unclepaulknowsall/'
    front = path + 'frontend/'
    mid = path + 'middleware/'
    package = mid + 'package/function.zip'
    function = mid + 'handle-query.py'
    zipfile = 'fileb://' + package
    # Set AWS env variables
    s3 = 's3://unclepaulknowsall.com'
    lambdaFunction = 'getQuip'
    #profile = 'personal'
    profile = 'DEFAULT'
    region = 'us-east-2'
    
    print('Deploying site code to S3 Bucket ' + s3 + '...') 
    subprocess.check_output(['aws','s3','sync',front,s3,'--profile',profile],
                            shell=True,
                            stderr=subprocess.STDOUT)
    
    print('Zipping function package ' + function + '...')
    subprocess.check_output(['7z','a',package,function],
                            shell=True,
                            stderr=subprocess.STDOUT)

    print('Deploying Lambda function package to ' + lambdaFunction + '...')
    subprocess.check_output(['aws','lambda','update-function-code','--function-name',lambdaFunction,'--zip-file',
                            zipfile,'--profile',profile,'--region',region],
                            shell=True,
                            stderr=subprocess.STDOUT)

deploy()