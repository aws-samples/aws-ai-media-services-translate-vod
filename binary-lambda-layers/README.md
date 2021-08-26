## The following Lambda layers contain binaries and must be created by the end-user manually prior to launching the CloudFormation stack.
* boto3
* ffmpeg and ffprobe
* pydub
  
    
## Create the boto3 layer by completing these steps:
  
[Read about boto3 here](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)
  
a) Launch an Amazon Linux 2 t2.micro EC2 instance and connect via SSH as ec2-user
  
b) Execute the following commands:
```
mkdir -p ~/boto3-layer/python ~/boto3-pip
pip3 install boto3 --prefix ~/boto3-pip
cp -a ~/boto3-pip/lib/python3.7/site-packages/* ~/boto3-layer/python
cd ~/boto3-layer
zip -r ../boto3.zip python
```
note: the "python" folder should be at the top level of the boto3.zip file
  
c) Download the ~/boto3.zip file to your local system. Continue creating the next Lambda Layer .zip file.
  
  
## Create the ffmpeg layer by completing these steps:
  
[Read about ffmpeg here](https://www.ffmpeg.org/)  
[Read about ffmpeg license information here](https://www.ffmpeg.org/legal.html)
  
a) Execute the following commands on the EC2 instance as ec2-user: 
```
cd ~
mkdir -p ~/ffmpeg-layer/bin
wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
tar xvf ffmpeg-release-amd64-static.tar.xz
cd ffmpeg*
cp ffmpeg ~/ffmpeg-layer/bin
cp ffprobe ~/ffmpeg-layer/bin
cd ~/ffmpeg-layer
zip -r ../ffmpeg.zip bin
```
note: the "bin" folder should be at the top level of the ffmpeg.zip file
  
b) Download the ~/ffmpeg.zip file to your local system. Continue creating the next Lambda Layer .zip file.
  
  
## Create the pydub layer by completing these steps:
  
[Read about pydub here](https://pypi.org/project/pydub/)
  
a) Execute the following commands on the EC2 instance as ec2-user: 
```
cd ~
mkdir -p ~/pydub-layer/python/lib/python3.8/site-packages ~/pydub-pip
pip3 install pydub --prefix ~/pydub-pip
cp -a ~/pydub-pip/lib/python3.7/site-packages/* ~/pydub-layer/python/lib/python3.8/site-packages
cd ~/pydub-layer
zip -r ../pydublayer.zip python
```
note: the "python" folder should be at the top level of the pydublayer.zip file
    
b) Download the ~/pydublayer.zip file to your local system. Continue creating the next Lambda Layer .zip file.
  
  
## Next Steps 
  
The Amazon Linux EC2 instance may be terminated.
  
You are now ready to return to the [CloudFormation README.md](../cloudformation/README.md) and continue with Step 6 (upload the 3 newly created layer .zip files to your source S3 bucket).
