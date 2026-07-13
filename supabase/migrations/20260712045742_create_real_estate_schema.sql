/*
# Real Estate Website — Lahore Property Dealer Schema

## Overview
This migration creates the full schema for a Lahore property dealer website.
Public visitors browse as guests. Only the admin/agent has a login.
Leads are captured via contact forms, WhatsApp clicks, and call clicks.

## Tables

### 1. admins
Admin-only table for the single property dealer account.
- id: uuid primary key
- name, email, password_hash: credentials
- phone, photo: contact/display info
- is_active: account active flag
- login_attempts, locked_until: brute-force protection
- last_login_at, created_at: audit timestamps

### 2. site_settings
Singleton table for the agent's branding and contact info.
- agent_name_en/ur: bilingual agent name
- tagline_en/ur: bilingual tagline
- phone, whatsapp, email: contact channels
- office_address_en/ur: office location
- social URLs: Facebook, Instagram, YouTube
- Stats: years_experience, deals_closed, happy_clients
- agent_photo: Cloudinary URL for agent headshot
- agent_bio_en/ur: bilingual agent bio

### 3. properties
Core listing table. Supports both SALE and RENT.
- Bilingual title/description
- Purpose enum: SALE or RENT
- Category enum: 12 property types
- Status enum: AVAILABLE, SOLD, RENTED, RESERVED
- Price: either a fixed amount or "on request"
- Location: city, society, area, address, lat/lng for maps
- Specs: size, bedrooms, bathrooms, floors, facing
- Amenities: 10+ boolean flags (gas, electricity, garage, etc.)
- Photos: array of Cloudinary URLs
- SEO slug and human-readable property ID (PROP-XXXX)
- featured, is_active for editorial control
- views counter for analytics

### 4. leads
Captures every customer inquiry/interaction.
- Links optionally to a property
- Type enum: WHATSAPP_CLICK, CALL_CLICK, CONTACT_FORM, SCHEDULE_VISIT, PRICE_REQUEST
- name, phone: customer identification (no account needed)
- message, preferred date/time for visit scheduling
- is_read: for admin unread notification badge

### 5. testimonials
Client testimonials shown on homepage and about page.
- client_name, client_area: who left it
- property_type: what they bought/rented
- rating: 1–5
- quote_text, quote_ur: bilingual quote
- is_active: editorial control

## Security

### RLS Model
This app has mixed auth:
- Properties, site_settings, testimonials: PUBLIC READ (anon + authenticated)
- Leads INSERT: PUBLIC WRITE (anon can submit leads)
- All mutations (INSERT/UPDATE/DELETE on properties, settings): admin-only
  via service role key in API routes — NOT via RLS (admin uses service_role in Next.js API)
- Admins table: service-role only (never exposed to anon client)

We use TO anon, authenticated on public SELECT policies so the anon-key
frontend client can read listings and settings without signing in.

Leads INSERT is open to anon so any visitor can submit an inquiry.
Admins table has NO anon policies — admin auth is handled server-side.
*/

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE purpose_type AS ENUM ('SALE', 'RENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE property_category AS ENUM (
    'HOUSE', 'APARTMENT', 'PLOT', 'COMMERCIAL',
    'FARMHOUSE', 'VILLA', 'ROOM', 'PORTION',
    'OFFICE', 'SHOP', 'WAREHOUSE'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE property_status AS ENUM ('AVAILABLE', 'SOLD', 'RENTED', 'RESERVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE price_type AS ENUM ('FIXED', 'ON_REQUEST');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE size_unit AS ENUM ('MARLA', 'KANAL', 'SQFT', 'SQYD');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE possession_status AS ENUM ('AVAILABLE', 'ON_BOOKING', 'UNDER_CONSTRUCTION');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_type AS ENUM (
    'WHATSAPP_CLICK', 'CALL_CLICK', 'CONTACT_FORM',
    'SCHEDULE_VISIT', 'PRICE_REQUEST'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- ADMINS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  email           text UNIQUE NOT NULL,
  password_hash   text NOT NULL,
  phone           text,
  photo           text,
  is_active       boolean NOT NULL DEFAULT true,
  login_attempts  int NOT NULL DEFAULT 0,
  locked_until    timestamptz,
  last_login_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admins table: service-role access only, no anon policies

-- ============================================================
-- SITE SETTINGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name_en       text NOT NULL DEFAULT 'Ahmed Properties',
  agent_name_ur       text,
  tagline_en          text,
  tagline_ur          text,
  phone               text NOT NULL DEFAULT '+923001234567',
  whatsapp            text NOT NULL DEFAULT '923001234567',
  email               text,
  office_address_en   text,
  office_address_ur   text,
  facebook_url        text,
  instagram_url       text,
  youtube_url         text,
  years_experience    int NOT NULL DEFAULT 0,
  deals_closed        int NOT NULL DEFAULT 0,
  happy_clients       int NOT NULL DEFAULT 0,
  agent_photo         text,
  agent_bio_en        text,
  agent_bio_ur        text,
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT
TO anon, authenticated USING (true);

-- ============================================================
-- PROPERTIES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS properties (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     text UNIQUE NOT NULL,
  slug            text UNIQUE NOT NULL,
  title           text NOT NULL,
  title_ur        text,
  description     text,
  description_ur  text,
  purpose         purpose_type NOT NULL,
  category        property_category NOT NULL,
  sub_category    text,
  status          property_status NOT NULL DEFAULT 'AVAILABLE',
  price_type      price_type NOT NULL DEFAULT 'FIXED',
  price           numeric(15,2),
  rent_price      numeric(10,2),
  size            numeric(8,2) NOT NULL,
  size_unit       size_unit NOT NULL DEFAULT 'MARLA',
  bedrooms        int,
  bathrooms       int,
  floors          int,
  facing          text,
  city            text NOT NULL DEFAULT 'Lahore',
  society         text,
  area            text,
  address         text,
  map_lat         double precision,
  map_lng         double precision,
  photos          text[] NOT NULL DEFAULT '{}',
  is_corner       boolean NOT NULL DEFAULT false,
  is_park_facing  boolean NOT NULL DEFAULT false,
  is_gated        boolean NOT NULL DEFAULT false,
  has_security    boolean NOT NULL DEFAULT false,
  has_gas         boolean NOT NULL DEFAULT false,
  has_electricity boolean NOT NULL DEFAULT false,
  has_water       boolean NOT NULL DEFAULT false,
  has_garage      boolean NOT NULL DEFAULT false,
  has_garden      boolean NOT NULL DEFAULT false,
  has_servant_qtr boolean NOT NULL DEFAULT false,
  possession      possession_status NOT NULL DEFAULT 'AVAILABLE',
  featured        boolean NOT NULL DEFAULT false,
  is_active       boolean NOT NULL DEFAULT true,
  views           int NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_properties_purpose_category ON properties(purpose, category);
CREATE INDEX IF NOT EXISTS idx_properties_purpose_status ON properties(purpose, status, is_active);
CREATE INDEX IF NOT EXISTS idx_properties_society ON properties(city, society);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured, is_active);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

DROP POLICY IF EXISTS "public_read_properties" ON properties;
CREATE POLICY "public_read_properties" ON properties FOR SELECT
TO anon, authenticated USING (is_active = true);

-- ============================================================
-- LEADS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     uuid REFERENCES properties(id) ON DELETE SET NULL,
  type            lead_type NOT NULL,
  name            text NOT NULL,
  phone           text NOT NULL,
  message         text,
  preferred_date  date,
  preferred_time  text,
  is_read         boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_leads_is_read ON leads(is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- ============================================================
-- TESTIMONIALS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name     text NOT NULL,
  client_area     text,
  property_type   text,
  rating          int NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  quote_text      text NOT NULL,
  quote_ur        text,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
TO anon, authenticated USING (is_active = true);

-- ============================================================
-- UPDATED_AT TRIGGER FOR PROPERTIES
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_updated_at ON properties;
CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
