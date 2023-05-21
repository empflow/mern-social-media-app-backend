/**
 * expects that views, likes, dislikes and shares are set to 0
 * @param body the body of the response
 */
export default function expectMetadataToBeZero(body: any) {
  const { views, likes, dislikes, shares } = body;
  expect([views, likes, dislikes, shares]).toEqual([0, 0, 0, 0]);
}
