export class HttpError extends Error {
  code: number;
  msg: string;

  constructor(code: number, msg: string, err?: Error) {
    super(msg);
    this.code = code;
    this.msg = msg;
    this.stack = err?.stack;
  }
}
