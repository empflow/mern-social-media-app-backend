import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";
import { IVid } from "./Post";
import { imageAttachmentsValidator, videoAttachmentsValidator } from "./validators";


export interface ICommentImg {
  previewSize: string,
  fullSize: string
}

export interface IComment {
  createdBy: Types.ObjectId,
  onPost: string,
  content: string,
  likes: number,
  dislikes: number,
  replyTo: null | Types.ObjectId,
  imgs: ICommentImg[],
  vids: IVid[],
  createdAt: Date,
  updatedAt: Date
}

const ImgsSchema = new Schema<ICommentImg>({
  previewSize: {
    type: String,
    required: true
  },
  fullSize: {
    type: String,
    required: true
  }
}, { _id: false });


const CommentSchema = new Schema<IComment>({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  onPost: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  replyTo: {
    default: null,
    type: Schema.Types.ObjectId,
    ref: "Comment"
  },
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
}, { timestamps: true });


const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
