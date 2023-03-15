import BadRequestErr from "./BadRequestErr";
import InternalServerErr from "./InternalServerErr";
import NotFoundErr from "./NotFoundErr";
import UnauthorizedErr from "./UnauthorizedErr";

export type TApiErrs = BadRequestErr | UnauthorizedErr | NotFoundErr | InternalServerErr;

export {
  BadRequestErr,
  InternalServerErr,
  NotFoundErr,
  UnauthorizedErr
}