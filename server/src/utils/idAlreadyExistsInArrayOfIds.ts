import { ObjectId } from "mongodb";

export default function idAlreadyExistsInArrayOfIds(
  idsArr: object[], id: string | ObjectId
) {
  const idString = id.toString();
  const stringIdsArr = idsArr.map(id => id.toString());
  return stringIdsArr.includes(idString);
}