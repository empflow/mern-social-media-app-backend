import mongoose, { Types, Schema } from "mongoose";
import { imageAttachmentsValidator, videoAttachmentsValidator } from "./validators";


export interface IPost {
  onUser: Types.ObjectId,
  createdBy: Types.ObjectId,
  content: null | string,
  postPath: string,
  tinyPreview: string,
  imgs: IImg[],
  vids: IVid[],
  views: number,
  likes: number,
  dislikes: number,
  shares: number,
  comments: Types.ObjectId[],
  createdAt: Date,
  updatedAt: Date
}

export interface IImg {
  fullSize: string,
  previewSize: string,
  feedSize: string
}

export interface IVid {
  preview: string,
  vid: string
}


// imgs subdocuments (also used for Comment schema)
export const ImgsSchema = new Schema<IImg>({
  fullSize: { type: String, required: true },
  feedSize: { type: String, required: true },
  previewSize: { type: String, required: true }
}, { _id: false });


const PostSchema = new Schema<IPost>({
  onUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: { type: String, default: null },
  postPath: { type: String, required: true },
  tinyPreview: { type: String, default: null },
  imgs: {
    type: [ImgsSchema],
    validate: imageAttachmentsValidator,
    default: []
  },
  vids: {
    type: [{ preview: String, vid: String }],
    validate: videoAttachmentsValidator,
    default: []
  },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  comments: {
    type: [{ type: Types.ObjectId, ref: "Comment" }],
    default: []
  }
}, { timestamps: true });


const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;
