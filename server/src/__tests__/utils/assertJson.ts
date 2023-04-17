export default function expectJson(headers: any) {
  expect(headers["content-type"]).toMatch(/json/);
}
