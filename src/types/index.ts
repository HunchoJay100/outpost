export type CompanySlug =
  | 'flynn-development'
  | 'middle-tn-metals'
  | 'modern-roofing-group'
  | 'complete-crete-coatings'
  | 'blue-collar-hustle';

export type PostType =
  | 'Lead Gen'
  | 'Brand Awareness'
  | 'Recruitment'
  | 'Project Spotlight'
  | 'Before & After'
  | 'Educational'
  | 'Team/BTS'
  | 'Client Story';

export type PostStatus = 'Draft' | 'Ready' | 'Scheduled';

export interface CompanyConfig {
  slug: CompanySlug;
  name: string;
  tagline: string;
  colors: {
    primary: string;
    accent: string;
    glow: string;
  };
}

export interface BrandSettings {
  companySlug: CompanySlug;
  name: string;
  phone: string;
  website: string;
  services: string;
  targetAudience: string;
  geoFocus: string;
  tone: string;
  hardRules: string[];
  bannedPhrases: string[];
  ctaStyle: string;
  exampleCaptions: string[];
  updatedAt: string;
}

export interface Caption {
  id: string;
  companySlug: CompanySlug;
  text: string;
  postType: PostType;
  tags: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  companySlug: CompanySlug;
  fileName: string;
  fileType: 'image' | 'video';
  mimeType: string;
  projectName: string;
  tags: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  companySlug: CompanySlug;
  captionId: string | null;
  captionText: string;
  mediaIds: string[];
  postType: PostType;
  notes: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OutpostData {
  version: number;
  brandSettings: Record<CompanySlug, BrandSettings>;
  captions: Caption[];
  posts: Post[];
}
