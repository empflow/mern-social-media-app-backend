export default function deepCopy<T>(val: T): T {
  try {
    return JSON.parse(JSON.stringify(val));
  } catch (err) {
    return val;
  }
}
