export default function getRandomUserId(length: number) {
  let id = "";
  for (let i = 0; i < length; i++) {
    const num = Math.floor(Math.random() * 10);
    id += num;
  }
  return id;
}