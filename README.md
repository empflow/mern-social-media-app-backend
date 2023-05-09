MERN social media app

.env variables required to run:<br />

DEV_MONGO_URL=mongo url<br />
TEST_MONGO_URL=works fastest with 'mongodb://localhost:27017'<br />
PROD_MONGO_URL=mongo url<br />

JWT_SECRET=this is like a password. Better make it long and random><br />
JWT_EXPIRES_IN='30d' or something similar<br />

the default avatar url used if the user hasn't uploaded one
DEFAULT_AVATAR_URL_400_PX='https://vk.com/images/camera_400.png' or your own<br />
DEFAULT_AVATAR_URL_200_PX='https://vk.com/images/camera_200.png' or your own<br />
DEFAULT_AVATAR_URL_100_PX='https://vk.com/images/camera_100.png' or your own<br />

S3_BUCKET_NAME=your s3 bucket name<br />
S3_REGION=your s3 region like us-east-2<br />
S3_ENDPOINT=your s3 endpoint<br />
S3_ACCESS_KEY_ID=your s3 access key<br />
S3_SECRET_ACCESS_KEY=your s3 secret access key<br />
