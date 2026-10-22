import { randomUUID, randomInt } from "node:crypto";

export function newId() {
  return randomUUID();
}

// No 0, O, 1, I or L, so a code is safe to read aloud
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function newReference() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `${code.slice(0, 3)}-${code.slice(3)}`; // e.g. K7M-4QX
}