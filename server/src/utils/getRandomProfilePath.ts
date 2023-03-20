export default function getRandomProfilePath(length: number) {
  let path = "user";
  for (let i = 0; i < length; i++) {
    const num = Math.floor(Math.random() * 10);
    path += num;
  }
  return path;
}