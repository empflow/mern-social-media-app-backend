# MERN social media app backend
(haven't come up with a real name yet)


## Steps to run:
1. Clone the repy by running `git clone https://github.com/empflow/mern-social-media-app-backend.git`
2. Run `npm i`
3. Create a file called `.env` in the root of the project
4. Add the following variables inside the `.env` file (I've provided defaults for some of them):

```
DEV_MONGO_URL=mongodb://localhost:27017
PROD_MONGO_URL=mongodb://localhost:27017

JWT_SECRET=
JWT_EXPIRES_IN='30d'

The default avatar url used if the user hasn't uploaded one
DEFAULT_AVATAR_URL_400_PX='https://vk.com/images/camera_400.png'
DEFAULT_AVATAR_URL_200_PX='https://vk.com/images/camera_200.png'
DEFAULT_AVATAR_URL_100_PX='https://vk.com/images/camera_100.png'

Your S3 provider should give you this information
S3_BUCKET_NAME=
S3_REGION=
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```
