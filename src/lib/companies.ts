import { CompanyConfig } from '@/types';

export const companies: CompanyConfig[] = [
  {
    slug: 'flynn-development',
    name: 'Flynn Development',
    tagline: 'Custom Homes & Construction',
    colors: {
      primary: '#1a1a1a',
      accent: '#C5A55A',
      glow: 'rgba(197, 165, 90, 0.4)',
    },
  },
  {
    slug: 'middle-tn-metals',
    name: 'Middle TN Metals',
    tagline: 'Barndominium Builds',
    colors: {
      primary: '#1a3a2a',
      accent: '#4ead6a',
      glow: 'rgba(78, 173, 106, 0.35)',
    },
  },
  {
    slug: 'modern-roofing-group',
    name: 'Modern Roofing Group',
    tagline: 'Residential & Commercial Roofing',
    colors: {
      primary: '#3a3a3a',
      accent: '#c43a3a',
      glow: 'rgba(196, 58, 58, 0.4)',
    },
  },
  {
    slug: 'complete-crete-coatings',
    name: 'Complete Crete Coatings',
    tagline: 'Floor Coating Systems',
    colors: {
      primary: '#2a2a2a',
      accent: '#d4b830',
      glow: 'rgba(212, 184, 48, 0.35)',
    },
  },
  {
    slug: 'blue-collar-hustle',
    name: 'Blue Collar Hustle',
    tagline: 'Trades Media & Culture',
    colors: {
      primary: '#0a0a0a',
      accent: '#5b8bd4',
      glow: 'rgba(91, 139, 212, 0.4)',
    },
  },
];

export function getCompany(slug: string): CompanyConfig | undefined {
  return companies.find((c) => c.slug === slug);
}
