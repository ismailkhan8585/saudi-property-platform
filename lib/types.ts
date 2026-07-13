export type Purpose = 'SALE' | 'RENT';

export type PropertyCategory =
  | 'HOUSE'
  | 'APARTMENT'
  | 'PLOT'
  | 'COMMERCIAL'
  | 'FARMHOUSE'
  | 'VILLA'
  | 'ROOM'
  | 'PORTION'
  | 'OFFICE'
  | 'SHOP'
  | 'WAREHOUSE';

export type PropertyStatus = 'AVAILABLE' | 'SOLD' | 'RENTED' | 'RESERVED';
export type PriceType = 'FIXED' | 'ON_REQUEST';
export type SizeUnit = 'MARLA' | 'KANAL' | 'SQFT' | 'SQYD';
export type PossessionStatus = 'AVAILABLE' | 'ON_BOOKING' | 'UNDER_CONSTRUCTION';
export type LeadType =
  | 'WHATSAPP_CLICK'
  | 'CALL_CLICK'
  | 'CONTACT_FORM'
  | 'SCHEDULE_VISIT'
  | 'PRICE_REQUEST';

export interface Property {
  id: string;
  propertyId: string;
  slug: string;
  title: string;
  titleUr?: string | null;
  description?: string | null;
  descriptionUr?: string | null;
  purpose: Purpose;
  category: PropertyCategory;
  subCategory?: string | null;
  status: PropertyStatus;
  priceType: PriceType;
  price?: number | null;
  rentPrice?: number | null;
  size: number;
  sizeUnit: SizeUnit;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floors?: number | null;
  facing?: string | null;
  city: string;
  society?: string | null;
  area?: string | null;
  address?: string | null;
  mapLat?: number | null;
  mapLng?: number | null;
  photos: string[];
  isCorner: boolean;
  isParkFacing: boolean;
  isGated: boolean;
  hasSecurity: boolean;
  hasGas: boolean;
  hasElectricity: boolean;
  hasWater: boolean;
  hasGarage: boolean;
  hasGarden: boolean;
  hasServantQtr: boolean;
  possession: PossessionStatus;
  featured: boolean;
  isActive: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  propertyId?: string | null;
  property?: Pick<Property, 'id' | 'title' | 'propertyId' | 'slug'> | null;
  type: LeadType;
  name: string;
  phone: string;
  message?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  agentNameEn: string;
  agentNameUr?: string | null;
  taglineEn?: string | null;
  taglineUr?: string | null;
  phone: string;
  whatsapp: string;
  email?: string | null;
  officeAddress?: string | null;
  officeAddressUr?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  yearsExperience: number;
  dealsClosed: number;
  happyClients: number;
  agentPhoto?: string | null;
  agentBioEn?: string | null;
  agentBioUr?: string | null;
}

export interface PropertyFilters {
  purpose?: Purpose;
  category?: PropertyCategory[];
  society?: string[];
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  bedrooms?: number;
  bathrooms?: number;
  featured?: boolean;
  status?: PropertyStatus;
  search?: string;
}

export interface PaginatedProperties {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
