import boto3
import os
from dotenv import load_dotenv

load_dotenv()

access_key = os.getenv("AWS_S3_ACCESS_KEY_ID")
secret_key=os.getenv("AWS_S3_SECRET_ACCESS_KEY")
bucket_name = os.getenv("S3_BUCKET")

s3 = boto3.client('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_key)

dir = './pdfs'

for file_name in os.listdir(dir):
    rel_path = os.path.join(dir, file_name)

    with open(rel_path, 'rb') as f:
        s3.upload_fileobj(f, bucket_name, file_name.split('/')[-1])
    print(f'{file_name} uploaded successfully to the s3 bucket: {bucket_name}')

print('S3 uploads complete')
