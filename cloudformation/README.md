## CloudFormation will automatically create the following resources in your AWS account:
* IAM roles and policies
* S3 bucket for processing
* S3 bucket for final output
* Lambda Python functions with Layers
* Step Function
* SSM Parameter store resources
* CloudFront distribution for final video
  
  
## Prior the provisioning the stack, you must complete some preparation steps:

1. Create a new S3 bucket in us-east-1 region to hold the Lambda function zip files.  CloudFormation will read files from this bucket during stack creation.
1. Create a folder inside the bucket named **lambda**
1. Create a folder inside the bucket named **layers**
1. Upload the zip files from this repo **src/lambda** folder to the new bucket **lambda** folder
1. Create Lambda layers for boto3, ffmpeg, and pydub per the [binary-lambda-layers README.md](../binary-lambda-layers/README.md)
1. Upload manually created layer zip files to the new bucket **layers** folder
1. Upload the stvblog.zip from this repo **src/layers** folder to the new bucket **layers** folder
1. You are now ready to return to the main [README.md](../README.md) and continue with **Run the CloudFormation template**. The name of the S3 bucket containing the zip files will be specified as a CloudFormation template parameter **S3CodeBucket**.

