export function profilePathValidator(path: string) {
  const urlRegex = /^[a-z0-9-_]+$/i;
  return urlRegex.test(path);
}

export function friendsValidator(friends: object[]) {
  const len = friends.length;

  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      const prev = friends[i].toString();
      const curr = friends[j].toString();
      if (prev === curr) return false;
    }
  }
  return true;
}

export function imageUrlsValidator(urls: string[]) {
  return urls.length <= 10;
}

export function videoUrlsValidator(urls: string[]) {
  return urls.length <= 2;
}