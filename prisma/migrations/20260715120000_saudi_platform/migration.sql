-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('WHATSAPP_CLICK', 'CALL_CLICK', 'CONTACT_FORM', 'SCHEDULE_VISIT', 'PRICE_REQUEST');

-- CreateEnum
CREATE TYPE "PossessionStatus" AS ENUM ('AVAILABLE', 'ON_BOOKING', 'UNDER_CONSTRUCTION');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('FIXED', 'ON_REQUEST');

-- CreateEnum
CREATE TYPE "PropertyCategory" AS ENUM ('HOUSE', 'APARTMENT', 'PLOT', 'COMMERCIAL', 'FARMHOUSE', 'VILLA', 'ROOM', 'PORTION', 'OFFICE', 'SHOP', 'WAREHOUSE');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'SOLD', 'RENTED', 'RESERVED');

-- CreateEnum
CREATE TYPE "Purpose" AS ENUM ('SALE', 'RENT', 'DAILY_RENT', 'COMMERCIAL_LEASE');

-- CreateEnum
CREATE TYPE "SizeUnit" AS ENUM ('SQM', 'MARLA', 'KANAL', 'SQFT', 'SQYD');

-- CreateEnum
CREATE TYPE "FurnishingStatus" AS ENUM ('UNFURNISHED', 'SEMI_FURNISHED', 'FURNISHED');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('COUNTRY', 'REGION', 'CITY', 'DISTRICT');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" TEXT,
    "photo" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "property_id" TEXT,
    "type" "LeadType" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "preferred_date" TIMESTAMP(3),
    "preferred_time" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_ur" TEXT,
    "title_ar" TEXT,
    "description" TEXT,
    "description_ur" TEXT,
    "description_ar" TEXT,
    "purpose" "Purpose" NOT NULL,
    "category" "PropertyCategory" NOT NULL,
    "sub_category" TEXT,
    "status" "PropertyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "price_type" "PriceType" NOT NULL DEFAULT 'FIXED',
    "price" DECIMAL(15,2),
    "rent_price" DECIMAL(10,2),
    "size" DECIMAL(8,2) NOT NULL,
    "size_unit" "SizeUnit" NOT NULL DEFAULT 'SQM',
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "floors" INTEGER,
    "facing" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Lahore',
    "society" TEXT,
    "area" TEXT,
    "address" TEXT,
    "address_ar" TEXT,
    "location_id" TEXT,
    "map_lat" DOUBLE PRECISION,
    "map_lng" DOUBLE PRECISION,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_corner" BOOLEAN NOT NULL DEFAULT false,
    "is_park_facing" BOOLEAN NOT NULL DEFAULT false,
    "is_gated" BOOLEAN NOT NULL DEFAULT false,
    "has_security" BOOLEAN NOT NULL DEFAULT false,
    "has_gas" BOOLEAN NOT NULL DEFAULT false,
    "has_electricity" BOOLEAN NOT NULL DEFAULT false,
    "has_water" BOOLEAN NOT NULL DEFAULT false,
    "has_garage" BOOLEAN NOT NULL DEFAULT false,
    "has_garden" BOOLEAN NOT NULL DEFAULT false,
    "has_servant_qtr" BOOLEAN NOT NULL DEFAULT false,
    "furnished" "FurnishingStatus" NOT NULL DEFAULT 'UNFURNISHED',
    "property_age" INTEGER,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "search_keywords_ar" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "search_keywords_en" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "possession" "PossessionStatus" NOT NULL DEFAULT 'AVAILABLE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,
    "parent_id" TEXT,
    "aliases_ar" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aliases_en" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "agent_name_en" TEXT NOT NULL DEFAULT 'Ahmed Properties',
    "agent_name_ur" TEXT,
    "tagline_en" TEXT,
    "tagline_ur" TEXT,
    "phone" TEXT NOT NULL DEFAULT '+923029154977',
    "whatsapp" TEXT NOT NULL DEFAULT '923029154977',
    "email" TEXT,
    "office_address_en" TEXT,
    "office_address_ur" TEXT,
    "facebook_url" TEXT,
    "instagram_url" TEXT,
    "youtube_url" TEXT,
    "years_experience" INTEGER NOT NULL DEFAULT 0,
    "deals_closed" INTEGER NOT NULL DEFAULT 0,
    "happy_clients" INTEGER NOT NULL DEFAULT 0,
    "agent_photo" TEXT,
    "agent_bio_en" TEXT,
    "agent_bio_ur" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_area" TEXT,
    "property_type" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "quote_text" TEXT NOT NULL,
    "quote_ur" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "properties_property_id_key" ON "properties"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "properties_location_id_idx" ON "properties"("location_id");

-- CreateIndex
CREATE INDEX "properties_purpose_category_is_active_idx" ON "properties"("purpose", "category", "is_active");

-- CreateIndex
CREATE INDEX "properties_price_idx" ON "properties"("price");

-- CreateIndex
CREATE INDEX "properties_rent_price_idx" ON "properties"("rent_price");

-- CreateIndex
CREATE INDEX "properties_size_idx" ON "properties"("size");

-- CreateIndex
CREATE INDEX "properties_created_at_idx" ON "properties"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "locations_slug_key" ON "locations"("slug");

-- CreateIndex
CREATE INDEX "locations_parent_id_type_active_idx" ON "locations"("parent_id", "type", "active");

-- CreateIndex
CREATE INDEX "locations_name_en_idx" ON "locations"("name_en");

-- CreateIndex
CREATE INDEX "locations_name_ar_idx" ON "locations"("name_ar");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
