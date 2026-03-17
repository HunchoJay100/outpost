import { CompanySlug } from '@/types';
import { getCompany } from './companies';

export function getThemeVars(slug: CompanySlug): Record<string, string> {
  const company = getCompany(slug);
  if (!company) {
    return {
      '--brand-primary': '#1a1a1a',
      '--brand-accent': '#666666',
      '--brand-glow': 'rgba(102, 102, 102, 0.3)',
    };
  }

  return {
    '--brand-primary': company.colors.primary,
    '--brand-accent': company.colors.accent,
    '--brand-glow': company.colors.glow,
  };
}
