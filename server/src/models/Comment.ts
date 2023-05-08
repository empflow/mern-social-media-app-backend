import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";


export interface IComment {
  createdBy: Types.ObjectId,
  onPost: string,
  content: string,
  likes: number,
  dislikes: number,
  replyTo: null | Types.ObjectId,
  imageAttachments: string[],
  videoAttachments: string[],
  createdAt: Date,
  updatedAt: Date
}


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
  imageAttachments: {
    type: [String],
    default: []
  },
  videoAttachments: {
    type: [String],
    default: []
  }
}, { timestamps: true });


const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
