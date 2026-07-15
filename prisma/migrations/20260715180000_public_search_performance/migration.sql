-- Public listing indexes match the predicates used by every public card/search query.
-- Partial indexes stay small by excluding drafts, inactive, sold, rented, and unpublished rows.
CREATE INDEX IF NOT EXISTS "properties_public_created_idx"
ON "properties" ("created_at" DESC)
WHERE "is_active" = true AND "status" = 'AVAILABLE' AND "published_at" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "properties_public_filter_idx"
ON "properties" ("purpose", "category", "location_id", "created_at" DESC)
WHERE "is_active" = true AND "status" = 'AVAILABLE' AND "published_at" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "properties_public_featured_idx"
ON "properties" ("featured", "created_at" DESC)
WHERE "is_active" = true AND "status" = 'AVAILABLE' AND "published_at" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "properties_public_sale_price_idx"
ON "properties" ("purpose", "price")
WHERE "is_active" = true AND "status" = 'AVAILABLE' AND "published_at" IS NOT NULL AND "price" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "properties_public_rent_price_idx"
ON "properties" ("purpose", "rent_price")
WHERE "is_active" = true AND "status" = 'AVAILABLE' AND "published_at" IS NOT NULL AND "rent_price" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "properties_public_area_rooms_idx"
ON "properties" ("purpose", "size", "bedrooms", "bathrooms")
WHERE "is_active" = true AND "status" = 'AVAILABLE' AND "published_at" IS NOT NULL;
