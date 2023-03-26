import mongoose from "mongoose";
import { Types } from "mongoose";
import { imageUrlsValidator, videoUrlsValidator } from "./validators";

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
  postPath: {
    type: String,
    required: true
  },
  imageUrls: {
    type: Array,
    maxlength: 10,
    validate: {
      validator: imageUrlsValidator,
      message: "you cannot upload more than 10 images in a single comment"
    }
  },
  videoUrls: {
    type: Array,
    validate: {
      validator: videoUrlsValidator,
      message: "you cannot upload more than 2 videos in a single comment"
    }
  },
  viewsCount: {
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