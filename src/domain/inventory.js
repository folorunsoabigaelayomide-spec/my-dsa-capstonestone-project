import { DomainError } from "./errors.js";
import { newId, newReference } from "./ids.js";
import { Queue } from "./waitlistQueue.js";

function requireText(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new DomainError("VALIDATION", `${field} must be a non-empty string`);
  }
}

function requireWholeNumber(value, field, min) {
  if (!Number.isInteger(value) || value < min) {
    throw new DomainError("VALIDATION", `${field} must be a whole number, at least ${min}`);
  }
}

export function createStore() {
  return {
    events: new Map(),
    bookingsByReference: new Map(),
  };
}

function getEvent(store, eventId) {
  const event = store.events.get(eventId);
  if (!event) throw new DomainError("NOT_FOUND", `Event ${eventId} not found`);
  return event;
}

export function createEvent(store, { name, date }) {
  requireText(name, "name");
  requireText(date, "date");
  const event = { id: newId(), name, date, tiers: new Map(), waitlist: new Queue() };
  store.events.set(event.id, event);
  return event;
}

export function addTier(store, eventId, { name, priceCents, capacity }) {
  const event = getEvent(store, eventId);
  requireText(name, "tier name");
  requireWholeNumber(priceCents, "priceCents", 0);
  requireWholeNumber(capacity, "capacity", 1);
  if (event.tiers.has(name)) {
    throw new DomainError("VALIDATION", `Tier ${name} already exists`);
  }
  const tier = { name, priceCents, capacity, seatsLeft: capacity };
  event.tiers.set(name, tier);
  return tier;
}

export function bookTickets(store, eventId, tierName, quantity, customerName) {
  const event = getEvent(store, eventId);
  const tier = event.tiers.get(tierName);
  if (!tier) throw new DomainError("NOT_FOUND", `Tier ${tierName} not found`);
  requireText(customerName, "customerName");
  requireWholeNumber(quantity, "quantity", 1);
  if (quantity > 10) {
    throw new DomainError("VALIDATION", "A booking is for 1 to 10 tickets");
  }
  if (quantity > tier.seatsLeft) {
    throw new DomainError("SOLD_OUT", `Only ${tier.seatsLeft} seat(s) left`);
  }

  // Every check passed, so it is now safe to change things
  tier.seatsLeft -= quantity;
  let reference = newReference();
  while (store.bookingsByReference.has(reference)) reference = newReference();

  const booking = {
    id: newId(),
    reference,
    eventId,
    tierName,
    customerName,
    quantity,
    totalCents: tier.priceCents * quantity,
    status: "CONFIRMED",
  };
  store.bookingsByReference.set(reference, booking);
  return booking;
}

export function findBookingByReference(store, reference) {
  const booking = store.bookingsByReference.get(reference);
  if (!booking) throw new DomainError("NOT_FOUND", `Booking ${reference} not found`);
  return booking;
}

export function cancelBooking(store, reference) {
  const booking = findBookingByReference(store, reference);
  if (booking.status === "CANCELLED") {
    throw new DomainError("ALREADY_CANCELLED", `Booking ${reference} is already cancelled`);
  }
  const tier = getEvent(store, booking.eventId).tiers.get(booking.tierName);
  tier.seatsLeft += booking.quantity;
  booking.status = "CANCELLED";
  return booking;
}

export function joinWaitlist(store, eventId, customerName) {
  const event = getEvent(store, eventId);
  requireText(customerName, "customerName");
  event.waitlist.enqueue(customerName);
  return event.waitlist.size; // their place in line
}