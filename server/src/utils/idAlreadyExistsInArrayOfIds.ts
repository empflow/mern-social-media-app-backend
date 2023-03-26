export default function idAlreadyExistsInArrayOfIds(idsArr: object[], id: string) {
  const stringIdsArr = idsArr.map(id => id.toString());
  return stringIdsArr.includes(id);
}