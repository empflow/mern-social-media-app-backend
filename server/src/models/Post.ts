import mongoose, { Types, Schema, HydratedDocument } from "mongoose";
import { imageAttachmentsValidator, videoAttachmentsValidator } from "./validators";

export interface IPost {
  createdBy: Types.ObjectId,
  postBody: null | string,
  postPath: string,
  imageAttachments: string[],
  videoAttachments: string[],
  views: number,
  likes: number,
  dislikes: number,
  shares: number,
  comments: Types.ObjectId[],
  createdAt: Date,
  updatedAt: Date
}

const PostSchema = new Schema<IPost>({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  postBody: { type: String, default: null },
  postPath: { type: String, required: true },
  imageAttachments: {
    type: [String],
    validate: imageAttachmentsValidator,
    default: []
  },
  videoAttachments: {
    type: [String],
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