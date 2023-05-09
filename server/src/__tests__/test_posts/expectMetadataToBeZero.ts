export default function expectMetadataToBeZero(body: any) {
  const { views, likes, dislikes, shares } = body;
  expect([views, likes, dislikes, shares]).toEqual([0, 0, 0, 0]);
}
