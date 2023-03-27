import mongoose from "mongoose";
import { Types } from "mongoose";

const CommentSchema = new mongoose.Schema({
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  body: {
    type: String,
    required: true
  },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  replyTo: {
    default: null,
    type: {
      commentId: {
        type: Types.ObjectId,
        ref: "Comment",
        required: true
      },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true }
    }
  },
  imageAttachments: {
    type: [{ type: String }]
  },
  videoAttachments: {
    type: [{ type: String }]
  }
}, { timestamps: true });

const CommentModel = mongoose.model("Comment", CommentSchema);
export default CommentModel;