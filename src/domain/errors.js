export class DomainError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "DomainError";
    this.code = code; // VALIDATION, NOT_FOUND, SOLD_OUT
  }
}