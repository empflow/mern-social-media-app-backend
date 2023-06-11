import { imgsAmountUploadLimit, vidsAmountUploadLimit } from "../config/global";


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
  if (urls.length <= imgsAmountUploadLimit) return true;

  const msg = `you cannot upload more than ${imgsAmountUploadLimit} images in a single post`;
  return msg;
}


export function videoAttachmentsValidator(urls: string[]) {
  if (urls.length <= vidsAmountUploadLimit) return true;

  const msg = `you cannot upload more than ${vidsAmountUploadLimit} videos in a single post`;
  return msg;
}
