import mongoose, { Types, Schema, HydratedDocument } from "mongoose";
import { imageAttachmentsValidator, videoAttachmentsValidator } from "./validators";


export interface IPost extends mongoose.Document {
  onUser: Types.ObjectId,
  createdBy: Types.ObjectId,
  content: null | string,
  postPath: string,
  tinyPreview: null | string,
  imgs: IPostImg[],
  vids: IVid[],
  views: number,
  likes: number,
  likedBy: Types.ObjectId[]
  dislikes: number,
  dislikedBy: Types.ObjectId[],
  shares: number,
  comments: Types.ObjectId[],
  createdAt: Date,
  updatedAt: Date
}

export interface IPostImg {
  fullSize: string,
  previewSize: string,
  feedSize: string,
  _id: Types.ObjectId
}

export interface IVid {
  preview: string,
  vid: string
}


// imgs subdocuments (also used for Comment schema)
export const ImgsSchema = new Schema<IPostImg>({
  fullSize: { type: String, required: true },
  feedSize: { type: String, required: true },
  previewSize: { type: String, required: true }
});


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
  likedBy: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
  dislikes: { type: Number, default: 0 },
  dislikedBy: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
  shares: { type: Number, default: 0 },
  comments: { type: [{ type: Schema.Types.ObjectId, ref: "Comment" }], default: [] }
}, { timestamps: true });


const Post = mongoose.model<IPost>("Post", PostSchema);
export default Post;
