import mongoose from "mongoose";
import { Types } from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  body: {
    type: String,
    required: true
  },
  likesCount: {
    type: Number,
    default: 0
  },
  dislikesCount: {
    type: Number,
    default: 0
  },
  isReply: {
    type: {
      status: Boolean,
      replyTo: { type: Types.ObjectId, ref: "Comment" }
    },
    required: true
  },
  imageUrls: {
    type: Array
  },
  videoUrls: {
    type: Array
  }
}, { timestamps: true });

const CommentModel = mongoose.model("Comment", CommentSchema);
export default CommentModel;