import Post, { IPost } from "../../models/Post";
import { getPostPath } from "../../utils/pathsGenerators";
import { user1 } from "./posts.test";


export default function createPost(data: Partial<IPost> = {}) {
  return Post.create({
    ...data,
    onUser: user1.id,
    createdBy: user1.id,
    postPath: getPostPath(data?.content ?? null)
  })
}
