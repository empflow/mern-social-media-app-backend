import { NotFoundErr } from "../utils/errs";
import { IReq, IRes } from "../utils/reqResInterfaces";

export default function notFound() {
  throw new NotFoundErr("route does not exist");
}