export default function assertJson(headers: any) {
  expect(headers["content-type"]).toMatch(/json/);
}
