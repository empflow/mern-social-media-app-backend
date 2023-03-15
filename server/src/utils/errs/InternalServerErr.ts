import ApiErr, { ErrCodes } from "./ApiErr";

export default class InternalServerErr extends ApiErr {
  constructor (
    message: string,
  ) {
    super(message, ErrCodes.InternalServer);
  }
}