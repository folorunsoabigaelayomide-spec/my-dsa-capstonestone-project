# AI log

## Build 1
**Tool used:** Claude

**What I asked for:** the domain core files, demo and benchmark (from docs/build-1.md)

**What I checked:** ran npm run demo and npm run benchmark; read each file

**What was wrong or unclear:**
- AI added an ALREADY_CANCELLED error code that wasn't in the list

**Rules I was unsure about:**
- which error code to use when cancelling twice

**Benchmark:** 100,000 bookings: Array.find 468.99 ms, Map.get 0.27 ms. At 200,000: Array.find 897.20 ms, Map.get 0.31 ms.

**What i saw:**When i doubled the booking from 100,000 to 200,00 Array.find was about twice as long(468.99 ms to 897.20 ms). Map.get stayed almost the same, under 1 ms both times.

**Note:** My first runs gave messy numbers, so I ran each size three times in a steadier state and used the lowest time.

**Files created:** errors.js, ids.js, waitlistQueue.js, inventory.js, demo.js, benchmark-lookup.js