export function profilePathValidator(path: string) {
  const urlRegex = /^[a-z0-9-_]+$/i;
  return (urlRegex.test(path) && path.length > 3);
}

export function friendsValidator(friends: object[]) {
  const len = friends.length;
  const msg = "this person already exists in the list of your friends";

  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      const prev = friends[i].toString();
      const curr = friends[j].toString();
      if (prev === curr) return msg;
    }
  }
  return true;
}

export function imageAttachmentsValidator(urls: string[]) {
  const limit = 10;
  const msg = `you cannot upload more than ${limit} images in a single comment`;

  if (urls.length <= limit) return true;
  return msg;
}

export function videoAttachmentsValidator(urls: string[]) {
  const limit = 2;
  const msg = `you cannot upload more than ${limit} videos in a single comment`;

  if (urls.length <= limit) return true;
  return msg;
}