import { USE_MOCK, API_BASE } from '../config';
import { getAuthHeaders } from '../utils/csrf';
import type { BlogPage } from '../types/BlogPage';
import { mockBlogPageData } from '../data/blogPage.mock';
import { readJsonResponse } from '../utils/api';

// Session-level memory for mock persistence
let currentMockData: BlogPage = { ...mockBlogPageData };

function resolveAssetUrl(value: string | undefined): string {
  if (!value) return '';

  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  try {
    return new URL(value, API_BASE).toString();
  } catch {
    return value.startsWith('/') ? `${API_BASE}${value}` : value;
  }
}

function toArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object');
  }
  if (value && typeof value === 'object') {
    return [value as Record<string, unknown>];
  }
  return [];
}

function normalizeBlogPage(raw: Record<string, unknown>): BlogPage {
  // Try unwrapping if nested inside content_data or data
  const rawItem = (raw.content_data && typeof raw.content_data === 'object')
    ? (raw.content_data as Record<string, unknown>)
    : (raw.data && typeof raw.data === 'object')
      ? (raw.data as Record<string, unknown>)
      : raw;

  let parsedSocial: Record<string, string> = {};
  const sl = rawItem.socialLinks ?? rawItem.social_links;
  if (sl) {
    if (typeof sl === 'string') {
      try {
        parsedSocial = JSON.parse(sl);
      } catch {
        parsedSocial = {};
      }
    } else if (typeof sl === 'object' && sl !== null) {
      parsedSocial = sl as Record<string, string>;
    }
  }

  return {
    logo: rawItem.logo ? resolveAssetUrl(String(rawItem.logo)) : '',
    siteName: typeof rawItem.siteName === 'string' ? rawItem.siteName : typeof rawItem.site_name === 'string' ? rawItem.site_name : '',
    heroTitle: typeof rawItem.heroTitle === 'string' ? rawItem.heroTitle : typeof rawItem.hero_title === 'string' ? rawItem.hero_title : '',
    heroSubtitle: typeof rawItem.heroSubtitle === 'string' ? rawItem.heroSubtitle : typeof rawItem.hero_subtitle === 'string' ? rawItem.hero_subtitle : '',
    heroCtaText: typeof rawItem.heroCtaText === 'string' ? rawItem.heroCtaText : typeof rawItem.hero_cta_text === 'string' ? rawItem.hero_cta_text : '',
    heroCtaLink: typeof rawItem.heroCtaLink === 'string' ? rawItem.heroCtaLink : typeof rawItem.hero_cta_link === 'string' ? rawItem.hero_cta_link : '',
    heroImage: rawItem.heroImage ? resolveAssetUrl(String(rawItem.heroImage)) : rawItem.hero_image ? resolveAssetUrl(String(rawItem.hero_image)) : '',
    aboutSectionSummarize: typeof rawItem.aboutSectionSummarize === 'string' ? rawItem.aboutSectionSummarize : typeof rawItem.about_section_summarize === 'string' ? rawItem.about_section_summarize : '',
    aboutSection: typeof rawItem.aboutSection === 'string' ? rawItem.aboutSection : typeof rawItem.about_section === 'string' ? rawItem.about_section : '',
    aboutImage: rawItem.aboutImage ? resolveAssetUrl(String(rawItem.aboutImage)) : rawItem.about_image ? resolveAssetUrl(String(rawItem.about_image)) : '',
    missionText: typeof rawItem.missionText === 'string' ? rawItem.missionText : typeof rawItem.mission_text === 'string' ? rawItem.mission_text : '',
    visionText: typeof rawItem.visionText === 'string' ? rawItem.visionText : typeof rawItem.vision_text === 'string' ? rawItem.vision_text : '',
    ctaTitle: typeof rawItem.ctaTitle === 'string' ? rawItem.ctaTitle : typeof rawItem.cta_title === 'string' ? rawItem.cta_title : '',
    ctaSubtitle: typeof rawItem.ctaSubtitle === 'string' ? rawItem.ctaSubtitle : typeof rawItem.cta_subtitle === 'string' ? rawItem.cta_subtitle : '',
    ctaButtonText: typeof rawItem.ctaButtonText === 'string' ? rawItem.ctaButtonText : typeof rawItem.cta_button_text === 'string' ? rawItem.cta_button_text : '',
    ctaButtonLink: typeof rawItem.ctaButtonLink === 'string' ? rawItem.ctaButtonLink : typeof rawItem.cta_button_link === 'string' ? rawItem.cta_button_link : '',
    contactEmail: typeof rawItem.contactEmail === 'string' ? rawItem.contactEmail : typeof rawItem.contact_email === 'string' ? rawItem.contact_email : '',
    contactPhone: typeof rawItem.contactPhone === 'string' ? rawItem.contactPhone : typeof rawItem.contact_phone === 'string' ? rawItem.contact_phone : '',
    contactAddress: typeof rawItem.contactAddress === 'string' ? rawItem.contactAddress : typeof rawItem.contact_address === 'string' ? rawItem.contact_address : '',
    mapEmbedUrl: typeof rawItem.mapEmbedUrl === 'string' ? rawItem.mapEmbedUrl : typeof rawItem.map_embed_url === 'string' ? rawItem.map_embed_url : '',
    footerDescription: typeof rawItem.footerDescription === 'string' ? rawItem.footerDescription : typeof rawItem.footer_description === 'string' ? rawItem.footer_description : '',
    copyrightText: typeof rawItem.copyrightText === 'string' ? rawItem.copyrightText : typeof rawItem.copyright_text === 'string' ? rawItem.copyright_text : '',
    socialLinks: parsedSocial
  };
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      ...getAuthHeaders(true),
      ...(options?.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return readJsonResponse<T>(response);
}

export async function getBlogPageData(): Promise<BlogPage> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...currentMockData }), 500);
    });
  }

  const data = await requestJson<unknown>('/blog_page_data/');

  const list = toArray(data);
  const record = list[0] ?? {};
  return normalizeBlogPage(record);
}

export interface UpdateBlogPagePayload extends Omit<BlogPage, 'logo' | 'heroImage' | 'aboutImage'> {
  logoFile?: File | null;
  heroImageFile?: File | null;
  aboutImageFile?: File | null;
}

export async function updateBlogPageData(
  payload: UpdateBlogPagePayload
): Promise<BlogPage> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const logoUrl = payload.logoFile ? URL.createObjectURL(payload.logoFile) : currentMockData.logo;
        const heroImageUrl = payload.heroImageFile ? URL.createObjectURL(payload.heroImageFile) : currentMockData.heroImage;
        const aboutImageUrl = payload.aboutImageFile ? URL.createObjectURL(payload.aboutImageFile) : currentMockData.aboutImage;

        currentMockData = {
          ...currentMockData,
          ...payload,
          logo: logoUrl,
          heroImage: heroImageUrl,
          aboutImage: aboutImageUrl
        };
        resolve({ ...currentMockData });
      }, 1000);
    });
  }

  const form = new FormData();

  // Convert payload properties (camelCase) to backend expected POST parameters (snake_case)
  const mapping: Record<keyof Omit<UpdateBlogPagePayload, 'logoFile' | 'heroImageFile' | 'aboutImageFile' | 'socialLinks'>, string> = {
    siteName: 'site_name',
    heroTitle: 'hero_title',
    heroSubtitle: 'hero_subtitle',
    heroCtaText: 'hero_cta_text',
    heroCtaLink: 'hero_cta_link',
    aboutSectionSummarize: 'about_section_summarize',
    aboutSection: 'about_section',
    missionText: 'mission_text',
    visionText: 'vision_text',
    ctaTitle: 'cta_title',
    ctaSubtitle: 'cta_subtitle',
    ctaButtonText: 'cta_button_text',
    ctaButtonLink: 'cta_button_link',
    contactEmail: 'contact_email',
    contactPhone: 'contact_phone',
    contactAddress: 'contact_address',
    mapEmbedUrl: 'map_embed_url',
    footerDescription: 'footer_description',
    copyrightText: 'copyright_text'
  };

  Object.entries(mapping).forEach(([camelKey, snakeKey]) => {
    const value = payload[camelKey as keyof UpdateBlogPagePayload];
    if (value !== undefined) {
      form.append(snakeKey, value as string);
    }
  });

  // Append social links as JSON string (snake_case POST key: social_links)
  if (payload.socialLinks !== undefined) {
    form.append('social_links', JSON.stringify(payload.socialLinks));
  }

  // Only include image files in the FormData if the admin actually selected a new file (snake_case POST keys)
  if (payload.logoFile) {
    form.append('logo', payload.logoFile);
  }
  if (payload.heroImageFile) {
    form.append('hero_image', payload.heroImageFile);
  }
  if (payload.aboutImageFile) {
    form.append('about_image', payload.aboutImageFile);
  }

  // Call the update endpoint
  const data = await requestJson<unknown>('/update_blog_page_data/', {
    method: 'POST',
    body: form
  });

  const record = (data && typeof data === 'object') ? data as Record<string, unknown> : {};
  return normalizeBlogPage(record);
}
