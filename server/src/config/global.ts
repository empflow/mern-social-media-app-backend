import { IComment } from "../models/Comment";
import { IPost } from "../models/Post";


export const imgSizeLimitInMb = 8;

export const imgsAmountUploadLimit = 10;
export const vidsAmountUploadLimit = 2;

export const allowedFileExts = [".png", ".jpg", ".jpeg", ".webp"];


export type TDocWithMedia = IComment | IPost;
