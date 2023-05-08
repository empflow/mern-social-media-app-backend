export default function areAllPromiseResultsFulfilled(
  results: PromiseSettledResult<any>[]
) {
  return results.every(result => result.status === "fulfilled");
}
