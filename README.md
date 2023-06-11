MERN social media app backend

.env variables required to run:
```
DEV_MONGO_URL=mongo url
PROD_MONGO_URL=mongo url
```
```
JWT_SECRET=this is like a password. Better make it long and random
JWT_EXPIRES_IN='30d' or something similar
```
```
the default avatar url used if the user hasn't uploaded one
DEFAULT_AVATAR_URL_400_PX='https://vk.com/images/camera_400.png' or your own
DEFAULT_AVATAR_URL_200_PX='https://vk.com/images/camera_200.png' or your own
DEFAULT_AVATAR_URL_100_PX='https://vk.com/images/camera_100.png' or your own
```
```
S3_BUCKET_NAME=your s3 bucket name
S3_REGION=your s3 region like us-east-2
S3_ENDPOINT=your s3 endpoint
S3_ACCESS_KEY_ID=your s3 access key
S3_SECRET_ACCESS_KEY=your s3 secret access key
```
