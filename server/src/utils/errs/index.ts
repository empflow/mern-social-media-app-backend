import BadRequestErr from "./BadRequestErr";
import ForbiddenErr from "./ForbiddenErr";
import NotFoundErr from "./NotFoundErr";
import UnauthorizedErr from "./UnauthorizedErr";

export type TApiErrs = BadRequestErr | UnauthorizedErr | NotFoundErr | ForbiddenErr;

export {
  BadRequestErr,
  NotFoundErr,
  UnauthorizedErr,
  ForbiddenErr
}