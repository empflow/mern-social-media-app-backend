export default function expectMetadataToBeZero(body: any) {
  expect(body.likes).toBe(0);
  expect(body.dislikes).toBe(0);
}
