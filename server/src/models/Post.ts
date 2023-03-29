import mongoose from "mongoose";
import { Types } from "mongoose";
import { imageAttachmentsValidator, videoAttachmentsValidator } from "./validators";

const PostSchema = new mongoose.Schema({
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  body: { type: String, default: null },
  postPath: { type: String, required: true },
  imageAttachments: {
    type: Array,
    validate: imageAttachmentsValidator,
    default: null
  },
  videoAttachments: {
    type: Array,
    validate: videoAttachmentsValidator,
    default: null
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

const Post = mongoose.model("Post", PostSchema);
export default Post;