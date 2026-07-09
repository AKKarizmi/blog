import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  extractArray,
  fetchFirstJson,
  isRecord,
  pickArray,
  pickNumber,
  pickRecord,
  pickString,
  pickStringArray,
  resolveAssetUrl,
} from '../services/api';
import type { ApiRecord } from '../services/api';

type SocialLinks = Record<string, string>;

export interface HeroData {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
}

export interface FeatureCardData {
  id: string | number;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
}

export interface AboutData {
  title: string;
  paragraphs: string[];
  buttonLabel: string;
  buttonHref: string;
  featureCards: FeatureCardData[];
}

export interface MissionVisionData {
  visionTitle: string;
  visionDescription: string;
  missionTitle: string;
  missionDescription: string;
}

export interface CoreValueData {
  id: string | number;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
}

export interface ServiceData {
  id: string | number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface EventData {
  id: string | number;
  title: string;
  short_description: string;
  description: string;
  image: string;
  date: string;
  termination_date?: string;
  registration_link?: string;
}

export interface CollaborationData {
  id: string | number;
  title: string;
  date: string;
  short_description: string;
  image: string;
  description: string;
  link?: string;
}

export interface AnnouncementData {
  id: string | number;
  title: string;
  description: string;
  short_description?: string;
  image: string;
  date: string;
  posted_by?: string;
  link?: string;
}

export interface BoardMemberData {
  id: string | number;
  title: string;
  role: string;
  short_description: string;
  image: string;
  socials: SocialLinks;
}

export interface ImpactItemData {
  id: string | number;
  end: number;
  duration: number;
  suffix: string;
  label: string;
}

export interface CtaData {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface ContactData {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  endpoint: string;
}

export interface LinkData {
  label: string;
  href: string;
}

export interface FooterData {
  description: string;
  copyright: string;
  madeWith: string;
  socialLinks: SocialLinks;
  quickLinks: LinkData[];
  resourceLinks: LinkData[];
  legalLinks: LinkData[];
}

interface ForozStaticData {
  hero: HeroData;
  about: AboutData;
  missionVision: MissionVisionData;
  coreValues: CoreValueData[];
  services: ServiceData[];
  events: EventData[];
  collaborations: CollaborationData[];
  boardMembers: BoardMemberData[];
  announcements: AnnouncementData[];
  impact: ImpactItemData[];
  cta: CtaData;
  contact: ContactData;
  footer: FooterData;
}

interface ForozDataContextValue extends ForozStaticData {
  loading: boolean;
  errors: string[];
  refreshData: () => Promise<void>;
}

const defaultData: ForozStaticData = {
  hero: {
    badge: 'Established 2025',
    title: 'Empowering Youth Through',
    highlightedTitle: 'Education, Skills & Opportunities',
    description:
      'FOROZ is a nonprofit organization dedicated to providing equitable access to education, capacity building, and opportunities for youth and students worldwide.',
    primaryActionLabel: 'Explore Programs',
    primaryActionHref: '#services',
    secondaryActionLabel: 'Join the Community',
    secondaryActionHref: '#contact',
  },
  about: {
    title: 'About FOROZ',
    paragraphs: [
      'Founded on September 6, 2025, FOROZ is a dynamic nonprofit organization focused on empowering youth through education, skills development, mentorship, and opportunity facilitation.',
      'We believe that every young person deserves the chance to reach their full potential. Our programs span critical areas including English proficiency, mathematics, digital skills, and professional development.',
      'With a strong emphasis on inclusivity and global accessibility, we are building bridges that connect ambitious students with the resources they need to succeed in an ever-evolving world.',
    ],
    buttonLabel: 'Read More About Our Story',
    buttonHref: '#about',
    featureCards: [
      {
        id: 'education',
        icon: 'book',
        title: 'Education First',
        description: 'Quality learning resources across core subjects.',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        id: 'global',
        icon: 'globe',
        title: 'Global Reach',
        description: 'Accessible programs for students worldwide.',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
      },
      {
        id: 'skills',
        icon: 'target',
        title: 'Skill Building',
        description: 'Practical digital and professional skills.',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
      },
      {
        id: 'mentorship',
        icon: 'users',
        title: 'Mentorship',
        description: 'Guidance from experienced professionals.',
        color: 'text-slate-700',
        bg: 'bg-slate-50',
      },
    ],
  },
  missionVision: {
    visionTitle: 'Our Vision',
    visionDescription:
      'Building an inclusive global community where all youth have equal access to education and opportunities to reach their potential and contribute to sustainable development.',
    missionTitle: 'Our Mission',
    missionDescription:
      'Expanding equitable access to quality education and supporting Sustainable Development Goals through capacity building, opportunity facilitation, and youth engagement.',
  },
  coreValues: [
    {
      id: 'equity',
      icon: 'heart',
      title: 'Equity & Inclusion',
      description: 'Ensuring fair access for all regardless of background.',
      color: 'text-rose-500',
      bg: 'bg-rose-50',
    },
    {
      id: 'quality',
      icon: 'star',
      title: 'Quality & Excellence',
      description: 'Delivering high-standard programs and resources.',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      id: 'integrity',
      icon: 'shield',
      title: 'Integrity & Accountability',
      description: 'Transparent and ethical in all operations.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      id: 'youth',
      icon: 'users',
      title: 'Youth Empowerment',
      description: 'Centering youth voices and leadership.',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      id: 'innovation',
      icon: 'lightbulb',
      title: 'Learning & Innovation',
      description: 'Embracing new methods and technologies.',
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      id: 'collaboration',
      icon: 'handshake',
      title: 'Collaboration & Partnership',
      description: 'Working together for greater impact.',
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
    },
    {
      id: 'sustainability',
      icon: 'leaf',
      title: 'Sustainability & Impact',
      description: 'Creating lasting, measurable change.',
      color: 'text-teal-500',
      bg: 'bg-teal-50',
    },
  ],
  services: [
    {
      id: 'online-education',
      icon: 'laptop',
      title: 'Online Education Programs',
      description:
        'Accessible digital courses covering core subjects like English and Mathematics.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'mentorship',
      icon: 'graduation',
      title: 'Mentorship Programs',
      description:
        'One-on-one guidance from experienced professionals to help navigate career paths.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'internship',
      icon: 'briefcase',
      title: 'Internship Opportunities',
      description:
        'Connecting students with real-world work experience to build their resumes.',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'leadership',
      icon: 'compass',
      title: 'Leadership Development',
      description:
        'Training programs designed to cultivate the next generation of global leaders.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'workshops',
      icon: 'wrench',
      title: 'Skill-Building Workshops',
      description:
        'Intensive sessions focused on practical digital and professional skills.',
      gradient: 'from-orange-500 to-amber-500',
    },
  ],
  events: [],
  collaborations: [],
  boardMembers: [],
  announcements: [],
  impact: [
    {
      id: 'students',
      end: 5000,
      duration: 2000,
      suffix: '+',
      label: 'Students Supported',
    },
    {
      id: 'programs',
      end: 120,
      duration: 2000,
      suffix: '+',
      label: 'Programs Delivered',
    },
    {
      id: 'volunteers',
      end: 300,
      duration: 2000,
      suffix: '+',
      label: 'Active Volunteers',
    },
    {
      id: 'opportunities',
      end: 1000,
      duration: 2000,
      suffix: '+',
      label: 'Opportunities Shared',
    },
  ],
  cta: {
    title: 'Be Part of the Change',
    description:
      "Join the FOROZ community today. Whether you're a student seeking opportunities, a professional wanting to mentor, or a partner looking to collaborate, your impact starts here.",
    primaryLabel: 'Join FOROZ Today',
    primaryHref: '/volunteer_form/',
    secondaryLabel: 'Learn More',
    secondaryHref: '#about',
  },
  contact: {
    title: 'Get in Touch',
    description:
      "Have questions about our programs or want to partner with us? We'd love to hear from you.",
    email: 'forozorg@gmail.com',
    phone: '',
    address: '',
    endpoint: '/contact/',
  },
  footer: {
    description:
      'Empowering youth globally through education, skills development, and equitable opportunities.',
    copyright: '2025 FOROZ Nonprofit Organization. All rights reserved.',
    madeWith: 'Made with heart for global youth',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/company/foroz',
      twitter: 'https://x.com/forozorg',
      instagram: 'https://www.instagram.com/forozorg',
      facebook: 'https://www.facebook.com/FOROZorg/',
      whatsapp: 'https://www.whatsapp.com/channel/0029Vb2IrqIBvvscn4Qp9p2b',
      youtube: 'https://www.youtube.com/@FOROZORG',
    },
    quickLinks: [
      { label: 'Home', href: '#home' },
      { label: 'About Us', href: '#about' },
      { label: 'Programs', href: '#services' },
      { label: 'Events', href: '#events' },
    ],
    resourceLinks: [
      { label: 'Blog', href: '#' },
      { label: 'Annual Reports', href: '#' },
      { label: 'Volunteer Guide', href: '#' },
      { label: 'Partner with Us', href: '#' },
    ],
    legalLinks: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
  },
};

const dataEndpoints = {
  content: ['/content/', '/site-content/', '/home/', '/homepage/', '/content', '/site-content', '/home', '/homepage'],
  coreValues: ['/core-values/', '/values/', '/core-values', '/values'],
  services: ['/services/', '/programs/', '/services', '/programs'],
  events: ['/events/', '/events', '/event/'],
  collaborations: ['/collaborations/', '/collaboration/', '/collaborations', '/collaboration'],
  boardMembers: ['/experts/', '/board-members/', '/team/', '/experts', '/board-members', '/team'],
  impact: ['/impact/', '/stats/', '/impact', '/stats'],
  announcements: ['/announcements/', '/announcements', '/announcement/'],
};

const ForozDataContext = createContext<ForozDataContextValue | undefined>(
  undefined
);

const cloneDefaults = (): ForozStaticData => ({
  hero: { ...defaultData.hero },
  about: {
    ...defaultData.about,
    paragraphs: [...defaultData.about.paragraphs],
    featureCards: defaultData.about.featureCards.map((card) => ({ ...card })),
  },
  missionVision: { ...defaultData.missionVision },
  coreValues: defaultData.coreValues.map((value) => ({ ...value })),
  services: defaultData.services.map((service) => ({ ...service })),
  events: [],
  collaborations: [],
  boardMembers: [],
  announcements: [],
  impact: defaultData.impact.map((item) => ({ ...item })),
  cta: { ...defaultData.cta },
  contact: { ...defaultData.contact },
  footer: {
    ...defaultData.footer,
    socialLinks: { ...defaultData.footer.socialLinks },
    quickLinks: defaultData.footer.quickLinks.map((link) => ({ ...link })),
    resourceLinks: defaultData.footer.resourceLinks.map((link) => ({ ...link })),
    legalLinks: defaultData.footer.legalLinks.map((link) => ({ ...link })),
  },
});

const firstString = (
  sources: Array<ApiRecord | undefined>,
  keys: string[]
) => {
  for (const source of sources) {
    const value = pickString(source, keys);
    if (value) {
      return value;
    }
  }

  return undefined;
};

const firstArray = <T,>(
  sources: Array<ApiRecord | undefined>,
  keys: string[]
) => {
  for (const source of sources) {
    const values = pickArray<T>(source, keys);
    if (values && values.length > 0) {
      return values;
    }
  }

  return undefined;
};

const firstStringArray = (
  sources: Array<ApiRecord | undefined>,
  keys: string[]
) => {
  for (const source of sources) {
    const values = pickStringArray(source, keys);
    if (values && values.length > 0) {
      return values;
    }
  }

  return undefined;
};

const splitTextBlock = (value: string | undefined) =>
  value
    ?.split(/\n{2,}|\r\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

const itemId = (
  source: ApiRecord | undefined,
  fallback: string | number,
  index: number
) => pickString(source, ['id', 'slug', 'key']) || fallback || index;

const extractSocialLinks = (source: ApiRecord | undefined): SocialLinks => {
  const socialSource =
    pickRecord(source, ['socialLinks', 'social_links', 'socials']) || source;
  const links: SocialLinks = {};

  const platforms = [
    'linkedin',
    'twitter',
    'instagram',
    'facebook',
    'whatsapp',
    'youtube',
    'telegram',
    'website',
  ];

  for (const platform of platforms) {
    const value = pickString(socialSource, [
      platform,
      `${platform}_link`,
      `${platform}_url`,
    ]);

    if (value) {
      links[platform] = value;
    }
  }

  return links;
};

const mapFeatureCards = (items: unknown[]) =>
  items.map((item, index) => {
    const source = isRecord(item) ? item : undefined;
    const fallback =
      defaultData.about.featureCards[index % defaultData.about.featureCards.length];

    return {
      id: itemId(source, fallback.id, index),
      title: pickString(source, ['title', 'name']) || fallback.title,
      description:
        pickString(source, ['description', 'short_description', 'text']) ||
        fallback.description,
      icon: pickString(source, ['icon', 'icon_name']) || fallback.icon,
      color: pickString(source, ['color', 'text_color']) || fallback.color,
      bg: pickString(source, ['bg', 'background', 'background_color']) || fallback.bg,
    };
  });

export const mapCoreValues = (items: unknown[]) =>
  items.map((item, index) => {
    const source = isRecord(item) ? item : undefined;
    const fallback = defaultData.coreValues[index % defaultData.coreValues.length];

    return {
      id: itemId(source, fallback.id, index),
      title: pickString(source, ['title', 'name']) || fallback.title,
      description:
        pickString(source, ['description', 'short_description', 'text']) ||
        fallback.description,
      icon: pickString(source, ['icon', 'icon_name']) || fallback.icon,
      color: pickString(source, ['color', 'text_color']) || fallback.color,
      bg: pickString(source, ['bg', 'background', 'background_color']) || fallback.bg,
    };
  });

const mapServices = (items: unknown[]) =>
  items.map((item, index) => {
    const source = isRecord(item) ? item : undefined;
    const fallback = defaultData.services[index % defaultData.services.length];

    return {
      id: itemId(source, fallback.id, index),
      title: pickString(source, ['title', 'name']) || fallback.title,
      description:
        pickString(source, ['description', 'short_description', 'summary']) ||
        fallback.description,
      icon: pickString(source, ['icon', 'icon_name']) || fallback.icon,
      gradient:
        pickString(source, ['gradient', 'color', 'accent']) || fallback.gradient,
    };
  });

export const mapEvents = (items: unknown[]) =>
  items.map((item, index) => {
    const source = isRecord(item) ? item : undefined;
    const image = pickString(source, ['image', 'image_url', 'photo']);

    return {
      id: itemId(source, index, index),
      title: pickString(source, ['title', 'name']) || 'Upcoming Event',
      short_description:
        pickString(source, ['short_description', 'summary', 'location']) || '',
      description: pickString(source, ['description', 'details']) || '',
      image: resolveAssetUrl(image),
      date: pickString(source, ['date', 'start_date', 'createdAt']) || '',
      termination_date:
        pickString(source, ['termination_date', 'end_date']) || undefined,
      registration_link:
        pickString(source, ['registration_link', 'register_link', 'link', 'url']) ||
        undefined,
    };
  });

export const mapCollaborations = (items: unknown[]) =>
  items.map((item, index) => {
    const source = isRecord(item) ? item : undefined;
    const image = pickString(source, ['image', 'image_url', 'photo']);

    return {
      id: itemId(source, index, index),
      title: pickString(source, ['title', 'name']) || 'Collaboration',
      short_description:
        pickString(source, ['short_description', 'summary', 'subtitle']) || '',
      description: pickString(source, ['description', 'details']) || '',
      image: resolveAssetUrl(image),
      date: pickString(source, ['date', 'created_at', 'createdAt']) || '',
      link: pickString(source, ['link', 'url', 'website']) || undefined,
    };
  });

export const mapAnnouncements = (items: unknown[]) =>
  items.map((item, index) => {
    const source = isRecord(item) ? item : undefined;
    const image = pickString(source, ['image', 'image_url', 'photo']);

    return {
      id: itemId(source, index, index),
      title: pickString(source, ['title', 'name']) || 'Announcement',
      description: pickString(source, ['description', 'details']) || '',
      short_description: pickString(source, ['posted_by', 'short_description', 'summary']) || '',
      image: resolveAssetUrl(image),
      date: pickString(source, ['publish_date', 'date', 'createdAt']) || '',
      posted_by: pickString(source, ['posted_by']),
      link: pickString(source, ['link', 'url']) || undefined,
    };
  });

export const mapBoardMembers = (items: unknown[]) =>
  items.map((item, index) => {
    const source = isRecord(item) ? item : undefined;
    const image = pickString(source, ['image', 'image_url', 'photo', 'avatar']);

    return {
      id: itemId(source, index, index),
      title:
        pickString(source, ['title', 'name', 'full_name', 'fullName']) ||
        'Team Member',
      role: pickString(source, ['role', 'position', 'job_title']) || '',
      short_description:
        pickString(source, ['short_description', 'bio', 'description']) || '',
      image: resolveAssetUrl(image),
      socials: extractSocialLinks(source),
    };
  });

export const mapImpact = (items: unknown[]) =>
  items.map((item, index) => {
    const source = isRecord(item) ? item : undefined;
    const fallback = defaultData.impact[index % defaultData.impact.length];

    return {
      id: itemId(source, fallback.id, index),
      end: pickNumber(source, ['end', 'value', 'count', 'number']) || fallback.end,
      duration: pickNumber(source, ['duration']) || fallback.duration,
      suffix: pickString(source, ['suffix']) || fallback.suffix,
      label: pickString(source, ['label', 'title', 'name']) || fallback.label,
    };
  });

const mapLinks = (items: unknown[], fallback: LinkData[]) =>
  items
    .map((item, index) => {
      const source = isRecord(item) ? item : undefined;
      const fallbackLink = fallback[index % fallback.length];
      const label = pickString(source, ['label', 'title', 'name']) || fallbackLink.label;
      const href = pickString(source, ['href', 'url', 'link']) || fallbackLink.href;

      return { label, href };
    })
    .filter((link) => link.label && link.href);

export const mergeContent = (
  current: ForozStaticData,
  content: ApiRecord
): ForozStaticData => {
  const hero = pickRecord(content, ['hero', 'heroSection', 'hero_section']);
  const about = pickRecord(content, ['about', 'aboutSection', 'about_section']);
  const mission = pickRecord(content, [
    'missionVision',
    'mission_vision',
    'mission',
    'vision',
  ]);
  const cta = pickRecord(content, ['cta', 'callToAction', 'call_to_action']);
  const contact = pickRecord(content, ['contact', 'contactSection', 'contact_section']);
  const footer = pickRecord(content, ['footer']);

  const paragraphs =
    firstStringArray([about, content], ['paragraphs', 'aboutParagraphs', 'about_paragraphs']) ||
    splitTextBlock(
      firstString([about, content], ['aboutText', 'about_text', 'description'])
    );

  const featureCards = firstArray<unknown>([about, content], [
    'featureCards',
    'feature_cards',
    'aboutCards',
    'about_cards',
  ]);

  const quickLinks = firstArray<unknown>([footer, content], [
    'quickLinks',
    'quick_links',
  ]);
  const resourceLinks = firstArray<unknown>([footer, content], [
    'resourceLinks',
    'resource_links',
  ]);
  const legalLinks = firstArray<unknown>([footer, content], [
    'legalLinks',
    'legal_links',
  ]);

  const socialLinks = extractSocialLinks(content);
  const footerSocialLinks = extractSocialLinks(footer);

  return {
    ...current,
    hero: {
      ...current.hero,
      badge:
        firstString([hero, content], ['badge', 'heroBadge', 'hero_badge']) ||
        current.hero.badge,
      title:
        firstString([hero, content], ['title', 'heroTitle', 'hero_title']) ||
        current.hero.title,
      highlightedTitle:
        firstString([hero, content], [
          'highlightedTitle',
          'highlighted_title',
          'heroHighlight',
          'hero_highlight',
        ]) || current.hero.highlightedTitle,
      description:
        firstString([hero, content], [
          'description',
          'heroTagline',
          'hero_tagline',
          'tagline',
        ]) || current.hero.description,
      primaryActionLabel:
        firstString([hero, content], [
          'primaryActionLabel',
          'primary_action_label',
          'primaryCtaLabel',
          'primary_cta_label',
        ]) || current.hero.primaryActionLabel,
      primaryActionHref:
        firstString([hero, content], [
          'primaryActionHref',
          'primary_action_href',
          'primaryCtaHref',
          'primary_cta_href',
        ]) || current.hero.primaryActionHref,
      secondaryActionLabel:
        firstString([hero, content], [
          'secondaryActionLabel',
          'secondary_action_label',
          'secondaryCtaLabel',
          'secondary_cta_label',
        ]) || current.hero.secondaryActionLabel,
      secondaryActionHref:
        firstString([hero, content], [
          'secondaryActionHref',
          'secondary_action_href',
          'secondaryCtaHref',
          'secondary_cta_href',
        ]) || current.hero.secondaryActionHref,
    },
    about: {
      ...current.about,
      title:
        firstString([about, content], ['title', 'aboutTitle', 'about_title']) ||
        current.about.title,
      paragraphs: paragraphs && paragraphs.length > 0 ? paragraphs : current.about.paragraphs,
      buttonLabel:
        firstString([about, content], ['buttonLabel', 'button_label']) ||
        current.about.buttonLabel,
      buttonHref:
        firstString([about, content], ['buttonHref', 'button_href']) ||
        current.about.buttonHref,
      featureCards:
        featureCards && featureCards.length > 0
          ? mapFeatureCards(featureCards)
          : current.about.featureCards,
    },
    missionVision: {
      ...current.missionVision,
      visionTitle:
        firstString([mission, content], ['visionTitle', 'vision_title']) ||
        current.missionVision.visionTitle,
      visionDescription:
        firstString([mission, content], [
          'visionDescription',
          'vision_description',
        ]) || current.missionVision.visionDescription,
      missionTitle:
        firstString([mission, content], ['missionTitle', 'mission_title']) ||
        current.missionVision.missionTitle,
      missionDescription:
        firstString([mission, content], [
          'missionDescription',
          'mission_description',
        ]) || current.missionVision.missionDescription,
    },
    cta: {
      ...current.cta,
      title: firstString([cta, content], ['title', 'ctaTitle', 'cta_title']) || current.cta.title,
      description:
        firstString([cta, content], ['description', 'ctaDescription', 'cta_description']) ||
        current.cta.description,
      primaryLabel:
        firstString([cta, content], ['primaryLabel', 'primary_label']) ||
        current.cta.primaryLabel,
      primaryHref:
        firstString([cta, content], ['primaryHref', 'primary_href']) ||
        current.cta.primaryHref,
      secondaryLabel:
        firstString([cta, content], ['secondaryLabel', 'secondary_label']) ||
        current.cta.secondaryLabel,
      secondaryHref:
        firstString([cta, content], ['secondaryHref', 'secondary_href']) ||
        current.cta.secondaryHref,
    },
    contact: {
      ...current.contact,
      title:
        firstString([contact, content], ['title', 'contactTitle', 'contact_title']) ||
        current.contact.title,
      description:
        firstString([contact, content], [
          'description',
          'contactDescription',
          'contact_description',
        ]) || current.contact.description,
      email:
        firstString([contact, content], ['email', 'contactEmail', 'contact_email']) ||
        current.contact.email,
      phone:
        firstString([contact, content], ['phone', 'contactPhone', 'contact_phone']) ||
        current.contact.phone,
      address:
        firstString([contact, content], ['address', 'location']) || current.contact.address,
      endpoint:
        firstString([contact, content], ['endpoint', 'contactEndpoint', 'contact_endpoint']) ||
        current.contact.endpoint,
    },
    footer: {
      ...current.footer,
      description:
        firstString([footer, content], ['description', 'footerDescription']) ||
        current.footer.description,
      copyright:
        firstString([footer, content], ['copyright']) || current.footer.copyright,
      madeWith:
        firstString([footer, content], ['madeWith', 'made_with']) ||
        current.footer.madeWith,
      socialLinks: {
        ...current.footer.socialLinks,
        ...socialLinks,
        ...footerSocialLinks,
      },
      quickLinks:
        quickLinks && quickLinks.length > 0
          ? mapLinks(quickLinks, current.footer.quickLinks)
          : current.footer.quickLinks,
      resourceLinks:
        resourceLinks && resourceLinks.length > 0
          ? mapLinks(resourceLinks, current.footer.resourceLinks)
          : current.footer.resourceLinks,
      legalLinks:
        legalLinks && legalLinks.length > 0
          ? mapLinks(legalLinks, current.footer.legalLinks)
          : current.footer.legalLinks,
    },
  };
};

export function ForozDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ForozStaticData>(() => cloneDefaults());
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const refreshData = useCallback(async () => {
    setLoading(true);

    try {
      const [
        servicesPayload,
        eventsPayload,
        collaborationsPayload,
        boardMembersPayload,
        announcementsPayload,
        contentPayload,
        coreValuesPayload,
        impactPayload,
      ] = await Promise.all([
        fetchFirstJson(dataEndpoints.services),
        fetchFirstJson(dataEndpoints.events),
        fetchFirstJson(dataEndpoints.collaborations),
        fetchFirstJson(dataEndpoints.boardMembers),
        fetchFirstJson(dataEndpoints.announcements),
        fetchFirstJson(dataEndpoints.content),
        fetchFirstJson(dataEndpoints.coreValues),
        fetchFirstJson(dataEndpoints.impact),
      ]);

      let next = cloneDefaults();

      const endpointServices = extractArray<unknown>(servicesPayload);
      if (endpointServices && endpointServices.length > 0) {
        next.services = mapServices(endpointServices);
      }

      const endpointEvents = extractArray<unknown>(eventsPayload);
      if (endpointEvents && endpointEvents.length > 0) {
        next.events = mapEvents(endpointEvents);
      }

      const endpointCollaborations = extractArray<unknown>(collaborationsPayload);
      if (endpointCollaborations && endpointCollaborations.length > 0) {
        next.collaborations = mapCollaborations(endpointCollaborations);
      }

      const endpointBoardMembers = extractArray<unknown>(boardMembersPayload);
      if (endpointBoardMembers && endpointBoardMembers.length > 0) {
        next.boardMembers = mapBoardMembers(endpointBoardMembers);
      }

      const endpointAnnouncements = extractArray<unknown>(announcementsPayload);
      if (endpointAnnouncements && endpointAnnouncements.length > 0) {
        next.announcements = mapAnnouncements(endpointAnnouncements);
      }

      if (contentPayload && isRecord(contentPayload)) {
        next = mergeContent(next, contentPayload);
      }

      const endpointCoreValues = extractArray<unknown>(coreValuesPayload);
      if (endpointCoreValues && endpointCoreValues.length > 0) {
        next.coreValues = mapCoreValues(endpointCoreValues);
      }

      const endpointImpact = extractArray<unknown>(impactPayload);
      if (endpointImpact && endpointImpact.length > 0) {
        next.impact = mapImpact(endpointImpact);
      }

      setData(next);
      setErrors([]);
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : 'Unable to load site data.',
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  const value = useMemo(
    () => ({
      ...data,
      loading,
      errors,
      refreshData,
    }),
    [data, errors, loading, refreshData]
  );

  return (
    <ForozDataContext.Provider value={value}>
      {children}
    </ForozDataContext.Provider>
  );
}

// This hook intentionally lives beside the provider so consumers share one context.
// eslint-disable-next-line react-refresh/only-export-components
export const useForozData = () => {
  const context = useContext(ForozDataContext);

  if (!context) {
    throw new Error('useForozData must be used within ForozDataProvider');
  }

  return context;
};
