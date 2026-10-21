const BOOKINGS = 100000;
const LOOKUPS = 500;

const list = [];
const map = new Map();
for (let i = 0; i < BOOKINGS; i++) {
  const booking = { id: i, reference: `REF-${i}` };
  list.push(booking);
  map.set(booking.reference, booking);
}

const targets = [];
for (let i = 0; i < LOOKUPS; i++) {
  targets.push(`REF-${Math.floor(Math.random() * BOOKINGS)}`);
}

let start = performance.now();
for (const ref of targets) list.find((b) => b.reference === ref);
const arrayMs = performance.now() - start;

start = performance.now();
for (const ref of targets) map.get(ref);
const mapMs = performance.now() - start;

console.log(`Bookings: ${BOOKINGS}, lookups: ${LOOKUPS}`);
console.log(`Array.find: ${arrayMs.toFixed(2)} ms`);
console.log(`Map.get:    ${mapMs.toFixed(2)} ms`);
console.log(`Map was about ${Math.round(arrayMs / mapMs)}x faster`);