import {
  createStore,
  createEvent,
  addTier,
  bookTickets,
  cancelBooking,
  findBookingByReference,
  joinWaitlist,
} from "../src/domain/inventory.js";
import { DomainError } from "../src/domain/errors.js";

const store = createStore();
const event = createEvent(store, { name: "Lagos Jazz Night", date: "2026-12-01" });
addTier(store, event.id, { name: "General", priceCents: 500000, capacity: 3 });
const tier = event.tiers.get("General");

console.log("1. Ada books 2 of 3 seats");
const ada = bookTickets(store, event.id, "General", 2, "Ada");
console.log(`   Reference ${ada.reference}, total ${ada.totalCents} cents, seats left: ${tier.seatsLeft}`);

console.log("2. Bayo asks for 2 seats, but only 1 is left");
try {
  bookTickets(store, event.id, "General", 2, "Bayo");
} catch (err) {
  if (err instanceof DomainError) {
    console.log(`   Refused: ${err.code} - ${err.message}`);
  } else {
    throw err;
  }
}

console.log("3. Chidi takes the last seat, so the event sells out");
bookTickets(store, event.id, "General", 1, "Chidi");
console.log(`   Seats left: ${tier.seatsLeft}`);

console.log("4. Bayo and Tunde join the waitlist");
console.log(`   Bayo is place ${joinWaitlist(store, event.id, "Bayo")}`);
console.log(`   Tunde is place ${joinWaitlist(store, event.id, "Tunde")}`);

console.log("5. Find Ada's booking by its reference");
const found = findBookingByReference(store, ada.reference);
console.log(`   Found: ${found.customerName}, ${found.quantity} ticket(s), ${found.status}`);

console.log("6. Ada cancels, which frees her seats");
cancelBooking(store, ada.reference);
console.log(`   Seats left: ${tier.seatsLeft}`);
console.log(`   Next in line: ${event.waitlist.peek()}`);