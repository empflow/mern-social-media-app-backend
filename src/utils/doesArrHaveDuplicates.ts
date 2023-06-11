import deepCopy from "./deepCopy";


export default function doesArrHaveDuplicates(arr: any) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (j === i) continue;
      
      const iVal = deepCopy(arr[i]);
      const jVal = deepCopy(arr[j]);
      if (iVal === jVal) return true;
    }
  }

  return false;
}
