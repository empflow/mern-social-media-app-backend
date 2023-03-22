import mongoose from "mongoose";
import { Types } from "mongoose";

const PostSchema = new mongoose.Schema({
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  body: {
    type: String,
    required: true
  },
  imageUrls: {
    type: Array
  },
  videoUrls: {
    type: Array
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likesCount: {
    type: Number,
    default: 0
  },
  dislikesCount: {
    type: Number,
    default: 0
  },
  sharesCount: {
    type: Number,
    default: 0
  },
  comments: {
    type: [{ type: Types.ObjectId, ref: "Comment" }],
    default: []
  }
}, { timestamps: true });

const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;