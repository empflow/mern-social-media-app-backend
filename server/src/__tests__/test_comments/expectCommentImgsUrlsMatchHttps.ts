import { ICommentImg } from "../../models/Comment";

export default function expectCommentImgsUrlsMatchHttps(body: any) {
  body.imgs.forEach((img: ICommentImg) => {
    expect(img.fullSize).toMatch(/https:\/\//);
    expect(img.previewSize).toMatch(/https:\/\//);
  })
}
