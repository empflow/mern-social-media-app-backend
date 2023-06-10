export default function convertFilesToDeleteIdsToArr(filesToDeleteIds: string | string[] | undefined) {
  let result: string[];

  if (typeof filesToDeleteIds === "string") {
    result = [filesToDeleteIds];
  } else if (!filesToDeleteIds) {
    result = [];
  } else {
    result = JSON.parse(JSON.stringify(filesToDeleteIds));
  }

  return result;
}
