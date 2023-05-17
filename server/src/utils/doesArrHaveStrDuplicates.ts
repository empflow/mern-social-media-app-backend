export default function doesArrHaveStrDuplicates(arr: string[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (j === i) continue;
      if (arr[i] === arr[j]) return true;
    }
  }

  return false;
}
