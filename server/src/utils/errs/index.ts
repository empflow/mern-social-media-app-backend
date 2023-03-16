import BadRequestErr from "./BadRequestErr";
import NotFoundErr from "./NotFoundErr";
import UnauthorizedErr from "./UnauthorizedErr";

export type TApiErrs = BadRequestErr | UnauthorizedErr | NotFoundErr;

export {
  BadRequestErr,
  NotFoundErr,
  UnauthorizedErr
}