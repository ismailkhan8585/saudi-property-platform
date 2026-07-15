# Dar Al Aqar — Saudi property platform

Arabic-first, bilingual Saudi property discovery platform built with Next.js 15, React 18, TypeScript, Prisma, PostgreSQL, Tailwind CSS, Radix UI, and Zod.

## Local setup

1. Install the locked dependencies with `npm ci`.
2. Set `DATABASE_URL` to a PostgreSQL connection string in `.env`. The older mixed-case `Database_URL` key is supported temporarily for local compatibility, but new environments must use `DATABASE_URL`.
3. Set `SESSION_SECRET` to a random value of at least 32 characters.
4. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD`; there are no default admin credentials.
5. Optionally set `NEXT_PUBLIC_APP_URL` to the deployed public origin.
6. Set `WHATSAPP_NUMBER` to the verified international WhatsApp number using digits only, for example `966XXXXXXXXX`.
7. Set `BUSINESS_PHONE` to the verified international public telephone number using digits only and optionally set `BUSINESS_EMAIL`.
8. Run `npx prisma migrate deploy`.
9. Run `npm run seed:saudi`.
10. Run `npm run seed:societies` to audit and fill deterministic search coverage.
11. Run `npm run verify:search-coverage`.
12. Run `npm run dev`.

## Data safety

The Saudi and search-coverage seeds validate records with Zod, use stable location slugs and property references, run in transactions, and upsert rather than deleting. Every generated property has `is_demo = true` and bilingual demo disclosure. Re-running a seed never creates duplicate references or slugs.

Search requests are read-only. Demo coverage is created only by the deployment seed, never by a GET request or an empty search. The bounded coverage contract checks sale/rent residential profiles in every active district, price and area bands, one-to-five-bedroom minimum behavior, furnishing, amenities, featured apartment/villa inventory, and broader featured categories in Riyadh, Jeddah, Makkah, Madinah, Dammam, and Khobar. The latest machine-readable audit is written to `reports/search-coverage.json`.

## Verification

```text
npx prisma validate
npx prisma generate
npm run lint
npm run typecheck
npm run build
npm run verify:search-coverage
npm run verify:data
```

`verify:search-coverage` fails when any required search combination, demo translation, or location relationship is missing. `verify:data` checks location/property/lead relationships, 13-region coverage, demo-property locations, image URLs, and unique property references/slugs.

## Public-data caching and revalidation

Public property searches, card summaries, property details, related listings, counts, and site settings use the Next.js server data cache for 300 seconds. Saudi location metadata uses a 24-hour cache because the hierarchy changes rarely. Testimonial data uses a one-hour cache. React request memoization prevents identical work during one render, while cache keys include the complete normalized public query so results from different filters are never mixed.

Property create, update, publish, unpublish, and soft-delete routes invalidate the `public-properties` tag. Settings updates invalidate `site-settings`. Admin, authentication, lead, and other private data are never stored in the public cache. Search requests remain read-only and all filtering, sorting, and pagination of properties stays in PostgreSQL.

The migration `20260715180000_public_search_performance` adds partial indexes for published/available listing order, location/purpose/type filtering, featured listings, sale and rent price ranges, area, bedrooms, and bathrooms. It creates indexes only and does not modify property records.

## Deployment

Use Node.js 20 or newer and PostgreSQL. Configure all environment values in the hosting provider, run `npx prisma migrate deploy` as the release migration step, seed once (safe to repeat), then start with `npm start`. Until verified `WHATSAPP_NUMBER` and `BUSINESS_PHONE` values are supplied, the UI clearly labels contact details as awaiting client confirmation and routes the floating contact action to the contact page. Never expose `DATABASE_URL`, `SESSION_SECRET`, or admin credentials as `NEXT_PUBLIC_*` variables.
