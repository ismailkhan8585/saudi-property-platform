# Public site performance verification — 2026-07-15

## Scope

Production-mode checks covered the homepage, filtered search, public properties API, and a property detail page. The responsive pass covered the homepage at 320, 360, 375, 390, 414, 480, 768, 1024, 1280, and 1440 pixels, plus search and detail pages at 320, 768, and 1440 pixels.

## Root causes found

- Public reads were uncached and repeated across homepage sections.
- Homepage sections requested counts and full property records even when only six card summaries were rendered.
- Cards transferred all photos and long descriptions.
- Location hierarchy resolution and aggregate counts were repeatedly queried.
- Search filtering needed purpose-specific price sorting and database indexes.
- Mobile navigation and filters shipped dialog code on initial load and lacked a focused bottom-sheet interaction.
- Detail-page related listings blocked completion of the primary property response.

## Production curl timings

These are server response timings from the same local machine and database connection. They are not browser paint metrics.

| Route | Before | After first optimized request | After warm cache |
| --- | ---: | ---: | ---: |
| Homepage total | 9.689 s | 7.420 s | 0.046–0.051 s |
| Filtered search total | 2.561–3.419 s | 1.682 s | 0.018–0.057 s |
| Property detail total | 2.828–3.137 s | 3.124 s | 0.020–0.046 s |

The homepage cold completion improved about 23%, filtered search about 34%, and repeated public reads about 98–99%. True cold timings still depend heavily on the remote Neon/PostgreSQL connection. Streaming keeps initial headers fast while slower sections resolve independently.

The final clean-build smoke returned HTTP 200 for:

- `/`
- `/search?purpose=SALE&city=riyadh&district=malqa`
- `/api/properties?purpose=SALE&city=riyadh&district=malqa`
- `/properties/demo-malqa-sale-villa-4`

## Payload and JavaScript

| Route | Before first-load JS | After first-load JS |
| --- | ---: | ---: |
| Homepage | 123 kB | 124 kB |
| Search | 125 kB | 126 kB |
| Property detail | 132 kB | 134 kB |

Shared first-load JavaScript is 103 kB. Accessible Radix mobile navigation and filter sheets are loaded only when opened, preventing their dialog code from adding roughly 20 kB to initial route bundles. Homepage HTML dropped from approximately 345.5 kB to 271.3 kB (about 21.5%) through lean property selects and one-photo card payloads.

## Cache policy

- Property/search reads: 300 seconds, tagged `properties`.
- Location hierarchy: 24 hours, tagged `locations`.
- Testimonials: 1 hour, tagged `testimonials`.
- Site settings: tagged `settings`.
- Property create/update/delete and settings mutations invalidate their relevant tags.
- Admin, authentication, lead, and other private data are never stored in the public data cache.

## Database work

Migration `20260715180000_public_search_performance` adds non-destructive partial indexes for published listing recency, purpose/category/location combinations, featured listings, sale/rent price sorting, and common area/bedroom/bathroom filters. Filtering, sorting, and pagination remain in Prisma/PostgreSQL; no full property table is loaded into application memory.

## Responsive and accessibility verification

The successful automated Arabic matrix contains 16 cases with matching requested/client widths, RTL document direction, and zero horizontal overflow. See `reports/responsive-smoke.json`. English homepage checks covered all ten widths with LTR direction and zero overflow. Search and detail endpoints were also verified in English through the locale cookie; layout uses the same responsive breakpoints and logical-direction styles.

Mobile changes include 44–48 px touch targets, safe-area-aware fixed contact actions, an accessible focus-trapped navigation sheet, a bottom filter sheet, real form labels, active filter chips, transition feedback, reduced-motion support, readable cards, and 320 px-safe header/content spacing.

## Metrics not claimed

Lighthouse and browser Core Web Vitals (LCP, INP, CLS, and FCP) were not captured because the integrated interactive browser runtime was unavailable and the local Chrome debugging socket was unreliable during the final pass. No synthetic scores are reported. These should be captured in deployment with Lighthouse and real-user monitoring because local remote-database cold starts are not representative of production users.
