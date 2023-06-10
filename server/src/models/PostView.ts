import mongoose, { Schema, Types } from "mongoose";


export interface IPostView extends mongoose.Document {
  postId: Types.ObjectId,
  userId: Types.ObjectId
}


const PostViewSchema = new Schema<IPostView>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});


const PostView = mongoose.model<IPostView>("PostView", PostViewSchema);
export default PostView;
