interface IImgObj {
  fullSize: string,
  previewSize: string
}

export default function expectCommentImgsUrlsMatchHttps(body: any) {
  body.imgs.forEach((img: IImgObj) => {
    expect(img.fullSize).toMatch(/https:\/\//);
    expect(img.previewSize).toMatch(/https:\/\//);
  })
}