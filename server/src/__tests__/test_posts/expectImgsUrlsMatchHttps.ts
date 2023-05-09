export default function expectImgsUrlsMatchHttps(body: any, imgsAmount: number) {
  if (imgsAmount < 1) return;

  expect(body.tinyPreview).toMatch(/https:\/\//);
  for (let i = 0; i < imgsAmount; i++) {
    const img = body.imgs[i];
    expect(img.fullSize).toMatch(/https:\/\//);
    expect(img.feedSize).toMatch(/https:\/\//);
    expect(img.previewSize).toMatch(/https:\/\//);
  }
}
