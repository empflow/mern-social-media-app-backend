import { IReq } from "./reqResInterfaces";


export default function getNewContentOnUpdate(req: IReq) {
  let { content } = req.body;
  if (typeof content === "string") content = content.trim();
  return content;
}
