export default class CustomError extends Error {
  statusCode: number;
  isJoi?: boolean;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    // Restore prototype chain for `instanceof` to work
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmMDU1MzQyYi0yZjZmLTQ1N2YtYWNiNi0yOGM0NjM5ZGU4N2YiLCJlbWFpbCI6ImFtZXIubGl2ZTQ3N0BnbWFpbC5jb20iLCJpYXQiOjE3Njk3MzA0NzEsImV4cCI6MTc3MDMzNTI3MX0.BFrz6rrPESiuuK9_YhZIpv2mnwMdikf8x-_5fpeVrVM