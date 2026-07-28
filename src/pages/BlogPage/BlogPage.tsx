import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import {
  Sparkles,
  Layout,
  Info,
  Compass,
  Megaphone,
  Phone,
  Settings,
  Save,
  Plus,
  Trash2,
  Loader2,
  Heart,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Edit2,
  X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { FileImageUpload } from '../../components/FileImageUpload/FileImageUpload';
import { useApp } from '../../context/AppContext';
import { getBlogPageData, updateBlogPageData, type UpdateBlogPagePayload } from '../../services/blogPageService';
import type { BlogPage as BlogPageType } from '../../types/BlogPage';
import { getCoreValues, updateCoreValues } from '../../services/coreValueService';
import type { CoreValue } from '../../types/CoreValue';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCategories,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory
} from '../../services/courseService';
import type { Course, CourseCategory } from '../../types/Course';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

type FormTab = 'branding' | 'hero' | 'about' | 'mission' | 'cta' | 'contact' | 'footer' | 'core_values' | 'programs';
type ProgramsSubTab = 'courses' | 'categories';

interface SocialRow {
  id: string;
  platform: string;
  url: string;
}

const PLATFORM_OPTIONS = [
  'facebook',
  'instagram',
  'twitter',
  'linkedin',
  'youtube',
  'tiktok',
  'whatsapp',
  'telegram',
  'github',
  'pinterest',
  'snapchat'
] as const;

const CORE_VALUE_ICON_OPTIONS = [
  'Heart',
  'Shield',
  'Users',
  'Handshake',
  'Lightbulb',
  'Leaf',
  'Star',
  'Award',
  'Globe2',
  'BookOpen',
  'GraduationCap',
  'Scale',
  'Sparkles',
  'Target',
  'Compass',
  'CircleCheck'
] as const;

const CORE_VALUE_COLOR_OPTIONS = [
  '#1E40AF', '#2563EB', '#0891B2', '#0F766E',
  '#059669', '#65A30D', '#CA8A04', '#EA580C',
  '#DC2626', '#DB2777', '#9333EA', '#7C3AED',
  '#475569', '#0F172A', '#78350F', '#BE123C'
] as const;

export function BlogPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<FormTab>('branding');
  const [programsSubTab, setProgramsSubTab] = useState<ProgramsSubTab>('courses');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPageType>>({});
  const [socialRows, setSocialRows] = useState<SocialRow[]>([]);

  // Selected Image Files for Upload
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);

  // Core Values State
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [coreValuesLoading, setCoreValuesLoading] = useState(false);
  const [editingCoreValue, setEditingCoreValue] = useState<CoreValue | null>(null);
  const [showCoreValueForm, setShowCoreValueForm] = useState(false);

  // Programs State
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [toDeleteCourse, setToDeleteCourse] = useState<Course | null>(null);

  // Categories State
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [toDeleteCategory, setToDeleteCategory] = useState<CourseCategory | null>(null);

  // Load Data
  useEffect(() => {
    let mounted = true;
    getBlogPageData()
      .then((data) => {
        if (!mounted) return;
        setFormData(data);
        if (data.socialLinks) {
          const rows = Object.entries(data.socialLinks).map(([platform, url], index) => ({
            id: `social_${index}_${Date.now()}`,
            platform,
            url
          }));
          setSocialRows(rows);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        addToast(err instanceof Error ? err.message : 'Failed to fetch homepage settings', 'error');
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [addToast]);

  // Load Core Values
  useEffect(() => {
    if (activeTab === 'core_values') {
      loadCoreValues();
    }
  }, [activeTab]);

  const loadCoreValues = () => {
    setCoreValuesLoading(true);
    getCoreValues()
      .then(setCoreValues)
      .catch((e) => addToast(e.message, 'error'))
      .finally(() => setCoreValuesLoading(false));
  };

  // Load Courses
  useEffect(() => {
    if (activeTab === 'programs' && programsSubTab === 'courses') {
      loadCourses();
    }
  }, [activeTab, programsSubTab]);

  const loadCourses = () => {
    setCoursesLoading(true);
    getCourses()
      .then(setCourses)
      .catch((e) => addToast(e.message, 'error'))
      .finally(() => setCoursesLoading(false));
  };

  // Load Categories
  useEffect(() => {
    if (activeTab === 'programs' && programsSubTab === 'categories') {
      loadCategories();
    }
  }, [activeTab, programsSubTab]);

  const loadCategories = () => {
    setCategoriesLoading(true);
    getCourseCategories()
      .then(setCategories)
      .catch((e) => addToast(e.message, 'error'))
      .finally(() => setCategoriesLoading(false));
  };

  const updateField = (key: keyof BlogPageType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddSocialRow = () => {
    setSocialRows((prev) => [
      ...prev,
      { id: `social_${Date.now()}`, platform: '', url: '' }
    ]);
  };

  const handleRemoveSocialRow = (id: string) => {
    setSocialRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleUpdateSocialRow = (id: string, field: 'platform' | 'url', value: string) => {
    setSocialRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Core Values handlers
  const handleSaveCoreValue = async (data: CoreValue) => {
    try {
      let updatedList: CoreValue[];
      if (editingCoreValue) {
        updatedList = coreValues.map((cv) => (cv.id === editingCoreValue.id ? { ...data, id: editingCoreValue.id } : cv));
      } else {
        updatedList = [...coreValues, { ...data, id: Date.now() }];
      }
      await updateCoreValues(updatedList);
      setCoreValues(updatedList);
      addToast(editingCoreValue ? 'Core value updated' : 'Core value added', 'success');
      setShowCoreValueForm(false);
      setEditingCoreValue(null);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to save core value', 'error');
    }
  };

  const handleDeleteCoreValue = (id: number) => {
    const updated = coreValues.filter((cv) => cv.id !== id);
    updateCoreValues(updated).then(() => {
      setCoreValues(updated);
      addToast('Core value deleted', 'success');
    }).catch((e) => addToast(e.message, 'error'));
  };

  const moveCoreValue = (index: number, direction: 'up' | 'down') => {
    const newList = [...coreValues];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    const reordered = newList.map((cv, i) => ({ ...cv, order: i }));
    setCoreValues(reordered);
    updateCoreValues(reordered).catch((e) => addToast(e.message, 'error'));
  };

  // Course handlers
  const handleSaveCourse = async (data: any) => {
    try {
      if (editingCourse) {
        const updated = await updateCourse(editingCourse.id, data);
        setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? updated : c)));
        addToast('Course updated', 'success');
      } else {
        const created = await createCourse(data);
        setCourses((prev) => [created, ...prev]);
        addToast('Course created', 'success');
      }
      setShowCourseForm(false);
      setEditingCourse(null);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to save course', 'error');
    }
  };

  const handleDeleteCourse = async () => {
    if (!toDeleteCourse) return;
    try {
      await deleteCourse(toDeleteCourse.id);
      setCourses((prev) => prev.filter((c) => c.id !== toDeleteCourse.id));
      addToast('Course deleted', 'success');
      setToDeleteCourse(null);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to delete course', 'error');
    }
  };

  // Category handlers
  const handleSaveCategory = async (data: Omit<CourseCategory, 'id'>) => {
    try {
      if (editingCategory) {
        const updated = await updateCourseCategory(editingCategory.id!, data);
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? updated : c)));
        addToast('Category updated', 'success');
      } else {
        const created = await createCourseCategory(data);
        setCategories((prev) => [created, ...prev]);
        addToast('Category created', 'success');
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to save category', 'error');
    }
  };

  const handleDeleteCategory = async () => {
    if (!toDeleteCategory) return;
    try {
      await deleteCourseCategory(toDeleteCategory.id!);
      setCategories((prev) => prev.filter((c) => c.id !== toDeleteCategory.id));
      addToast('Category deleted', 'success');
      setToDeleteCategory(null);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Unable to delete category', 'error');
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!formData.siteName?.trim()) {
      e.siteName = 'Site name is required';
    }

    if (formData.aboutSectionSummarize && formData.aboutSectionSummarize.length > 2000) {
      e.aboutSectionSummarize = `Short summary must be less than 2000 characters (currently ${formData.aboutSectionSummarize.length})`;
    }

    if (formData.contactEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        e.contactEmail = 'Invalid contact email format';
      }
    }

    // URL validations
    const urlFields: Array<keyof BlogPageType> = ['heroCtaLink', 'ctaButtonLink', 'mapEmbedUrl'];
    urlFields.forEach((field) => {
      const val = formData[field] as string | undefined;
      if (val && !/^https?:\/\//i.test(val) && !val.startsWith('/')) {
        e[field] = 'Link must start with http://, https://, or /';
      }
    });

    // Social Links validations
    socialRows.forEach((row, i) => {
      if (row.platform.trim() && !row.url.trim()) {
        e[`social_url_${row.id}`] = 'URL is required if platform name is entered';
      } else if (row.url.trim() && !/^https?:\/\//i.test(row.url.trim())) {
        e[`social_url_${row.id}`] = 'URL must start with http:// or https://';
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please correct the validation errors first', 'error');
      return;
    }

    try {
      setIsSaving(true);

      // Serialize social links back to JSON key/value record
      const socialLinksRecord = socialRows.reduce((acc, row) => {
        const plat = row.platform.trim();
        const linkVal = row.url.trim();
        if (plat && linkVal) {
          acc[plat] = linkVal;
        }
        return acc;
      }, {} as Record<string, string>);

      const payload: UpdateBlogPagePayload = {
        ...formData,
        socialLinks: socialLinksRecord,
        logoFile,
        heroImageFile,
        aboutImageFile
      };

      const updatedData = await updateBlogPageData(payload);

      // Refresh form states
      setFormData(updatedData);
      setLogoFile(null);
      setHeroImageFile(null);
      setAboutImageFile(null);

      if (updatedData.socialLinks) {
        const rows = Object.entries(updatedData.socialLinks).map(([platform, url], index) => ({
          id: `social_${index}_${Date.now()}`,
          platform,
          url
        }));
        setSocialRows(rows);
      }

      addToast('Homepage content updated successfully', 'success');
      setErrors({});
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to update homepage content', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: FormTab; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'branding', label: 'Branding', icon: Sparkles },
    { id: 'hero', label: 'Hero Section', icon: Layout },
    { id: 'about', label: 'About Section', icon: Info },
    { id: 'mission', label: 'Mission & Vision', icon: Compass },
    { id: 'cta', label: 'Call to Action', icon: Megaphone },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'core_values', label: 'Core Values', icon: Heart },
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'footer', label: 'Footer Settings', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-white rounded-lg animate-pulse w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-2 lg:col-span-1">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div key={n} className="h-10 bg-white rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="lg:col-span-3 h-96 bg-white rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Content Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the content, sections, contact information, and assets of your public nonprofit homepage.
          </p>
        </div>
        <div className="hidden sm:block">
          <Button onClick={handleSave} disabled={isSaving} className="shadow-md">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <aside className="lg:col-span-1">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 p-1 bg-white rounded-xl shadow-sm border border-gray-100 scrollbar-none">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap lg:w-full ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <TabIcon className="w-5 h-5 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Form Inputs Container */}
        <main className="lg:col-span-3">
          <Card className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Branding Section */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Site Branding</h3>
                    <p className="text-xs text-gray-500">Configure site name and logo details displayed across header.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                    <Input
                      value={formData.siteName || ''}
                      onChange={(e) => updateField('siteName', e.target.value)}
                      placeholder="e.g. FOROZ nonprofit"
                    />
                    {errors.siteName && (
                      <p className="mt-1 text-xs text-rose-600">{errors.siteName}</p>
                    )}
                  </div>
                  <div>
                    <FileImageUpload
                      label="Logo Asset"
                      value={formData.logo}
                      onChange={(file) => {
                        setLogoFile(file);
                        if (!file) updateField('logo', '');
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Hero Section */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Hero Header</h3>
                    <p className="text-xs text-gray-500">Edit the large banner overlay title, message, CTA button, and background banner image.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                    <Input
                      value={formData.heroTitle || ''}
                      onChange={(e) => updateField('heroTitle', e.target.value)}
                      placeholder="e.g. Empowering Communities, Changing Lives"
                    />
                  </div>
                  <Textarea
                    label="Hero Subtitle"
                    rows={3}
                    value={formData.heroSubtitle || ''}
                    onChange={(e) => updateField('heroSubtitle', e.target.value)}
                    placeholder="Short description displayed below the title..."
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hero Button Label</label>
                      <Input
                        value={formData.heroCtaText || ''}
                        onChange={(e) => updateField('heroCtaText', e.target.value)}
                        placeholder="e.g. Donate Now"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hero Button Destination Link</label>
                      <Input
                        value={formData.heroCtaLink || ''}
                        onChange={(e) => updateField('heroCtaLink', e.target.value)}
                        placeholder="https://... or /volunteer"
                      />
                      {errors.heroCtaLink && (
                        <p className="mt-1 text-xs text-rose-600">{errors.heroCtaLink}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <FileImageUpload
                      label="Hero Background Banner"
                      value={formData.heroImage}
                      onChange={(file) => {
                        setHeroImageFile(file);
                        if (!file) updateField('heroImage', '');
                      }}
                    />
                  </div>
                </div>
              )}

              {/* About Section */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">About Us Content</h3>
                    <p className="text-xs text-gray-500">Provide summaries and stories highlighting the organization history or scope.</p>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">About Summary (Max 2000 chars)</label>
                      <span className={`text-xs ${errors.aboutSectionSummarize ? 'text-rose-600 font-bold' : 'text-gray-400'}`}>
                        {(formData.aboutSectionSummarize || '').length} / 2000
                      </span>
                    </div>
                    <Textarea
                      rows={4}
                      value={formData.aboutSectionSummarize || ''}
                      onChange={(e) => updateField('aboutSectionSummarize', e.target.value)}
                      placeholder="Provide a quick summary introduction..."
                    />
                    {errors.aboutSectionSummarize && (
                      <p className="mt-1 text-xs text-rose-600">{errors.aboutSectionSummarize}</p>
                    )}
                  </div>
                  <Textarea
                    label="About Long Description Content"
                    rows={8}
                    value={formData.aboutSection || ''}
                    onChange={(e) => updateField('aboutSection', e.target.value)}
                    placeholder="Provide detailed description paragraphs..."
                  />
                  <div>
                    <FileImageUpload
                      label="About Section Side Image"
                      value={formData.aboutImage}
                      onChange={(file) => {
                        setAboutImageFile(file);
                        if (!file) updateField('aboutImage', '');
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Mission & Vision */}
              {activeTab === 'mission' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Mission & Vision Statement</h3>
                    <p className="text-xs text-gray-500">Define the core motivation driving this organization's projects.</p>
                  </div>
                  <Textarea
                    label="Mission Statement"
                    rows={4}
                    value={formData.missionText || ''}
                    onChange={(e) => updateField('missionText', e.target.value)}
                    placeholder="Describe your organization's mission..."
                  />
                  <Textarea
                    label="Vision Statement"
                    rows={4}
                    value={formData.visionText || ''}
                    onChange={(e) => updateField('visionText', e.target.value)}
                    placeholder="Describe your organization's vision..."
                  />
                </div>
              )}

              {/* Call to Action */}
              {activeTab === 'cta' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Call to Action Banner</h3>
                    <p className="text-xs text-gray-500">Customize the mid-page banner that encourages volunteer applications.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Banner Title</label>
                    <Input
                      value={formData.ctaTitle || ''}
                      onChange={(e) => updateField('ctaTitle', e.target.value)}
                      placeholder="e.g. Ready to Make a Difference?"
                    />
                  </div>
                  <Textarea
                    label="CTA Banner Subtitle"
                    rows={3}
                    value={formData.ctaSubtitle || ''}
                    onChange={(e) => updateField('ctaSubtitle', e.target.value)}
                    placeholder="Encouraging subtext paragraph..."
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
                      <Input
                        value={formData.ctaButtonText || ''}
                        onChange={(e) => updateField('ctaButtonText', e.target.value)}
                        placeholder="e.g. Apply Now"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Target URL</label>
                      <Input
                        value={formData.ctaButtonLink || ''}
                        onChange={(e) => updateField('ctaButtonLink', e.target.value)}
                        placeholder="https://... or /apply"
                      />
                      {errors.ctaButtonLink && (
                        <p className="mt-1 text-xs text-rose-600">{errors.ctaButtonLink}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                    <p className="text-xs text-gray-500">Manage address, email, phone lines, and map embed indicators.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                      <Input
                        type="email"
                        value={formData.contactEmail || ''}
                        onChange={(e) => updateField('contactEmail', e.target.value)}
                        placeholder="info@yourorg.com"
                      />
                      {errors.contactEmail && (
                        <p className="mt-1 text-xs text-rose-600">{errors.contactEmail}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                      <Input
                        value={formData.contactPhone || ''}
                        onChange={(e) => updateField('contactPhone', e.target.value)}
                        placeholder="e.g. +93 79 123 4567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
                    <Input
                      value={formData.contactAddress || ''}
                      onChange={(e) => updateField('contactAddress', e.target.value)}
                      placeholder="e.g. 123 Community Lane, Kabul, Afghanistan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                    <Input
                      value={formData.mapEmbedUrl || ''}
                      onChange={(e) => updateField('mapEmbedUrl', e.target.value)}
                      placeholder="e.g. https://www.google.com/maps/embed?pb=..."
                    />
                    {errors.mapEmbedUrl && (
                      <p className="mt-1 text-xs text-rose-600">{errors.mapEmbedUrl}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Core Values Tab */}
              {activeTab === 'core_values' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Core Values</h3>
                      <p className="text-xs text-gray-500">Manage your organization's core values displayed on the homepage.</p>
                    </div>
                    {!showCoreValueForm && (
                      <Button
                        type="button"
                        onClick={() => { setEditingCoreValue(null); setShowCoreValueForm(true); }}
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Value
                      </Button>
                    )}
                  </div>

                  {showCoreValueForm && (
                    <CoreValueForm
                      initial={editingCoreValue}
                      onSave={handleSaveCoreValue}
                      onCancel={() => { setShowCoreValueForm(false); setEditingCoreValue(null); }}
                    />
                  )}

                  {!showCoreValueForm && (
                    <div className="space-y-3">
                      {coreValuesLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((n) => (
                            <div key={n} className="h-20 bg-gray-50 rounded-lg animate-pulse" />
                          ))}
                        </div>
                      ) : coreValues.length > 0 ? (
                        coreValues.sort((a, b) => a.order - b.order).map((cv, index) => (
                          <div key={cv.id || index} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() => moveCoreValue(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveCoreValue(index, 'down')}
                                disabled={index === coreValues.length - 1}
                                className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: cv.color || '#e0e7ff' }}
                            >
                              <IconPreview name={cv.icon} className="w-5 h-5" style={{ color: '#fff' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900">{cv.title}</div>
                              <div className="text-xs text-gray-500 line-clamp-1">{cv.description}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => { setEditingCoreValue(cv); setShowCoreValueForm(true); }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCoreValue(cv.id!)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-md"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center">
                          <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No core values configured yet.</p>
                          <p className="text-xs text-gray-400 mt-1">Add your first core value to get started.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Programs Tab */}
              {activeTab === 'programs' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Programs & Courses</h3>
                    <p className="text-xs text-gray-500">Manage courses and categories offered by your organization.</p>
                  </div>

                  {/* Sub-tabs */}
                  <div className="flex gap-1 bg-gray-50 p-1 rounded-lg w-fit">
                    <button
                      type="button"
                      onClick={() => setProgramsSubTab('courses')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        programsSubTab === 'courses' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Courses
                    </button>
                    <button
                      type="button"
                      onClick={() => setProgramsSubTab('categories')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        programsSubTab === 'categories' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Categories
                    </button>
                  </div>

                  {programsSubTab === 'courses' && (
                    showCourseForm ? (
                      <CourseForm
                        initial={editingCourse}
                        onSave={handleSaveCourse}
                        onCancel={() => { setShowCourseForm(false); setEditingCourse(null); }}
                      />
                    ) : (
                      <CoursesList
                        courses={courses}
                        loading={coursesLoading}
                        onEdit={(c) => { setEditingCourse(c); setShowCourseForm(true); }}
                        onDelete={(c) => setToDeleteCourse(c)}
                        onAdd={() => { setEditingCourse(null); setShowCourseForm(true); }}
                      />
                    )
                  )}

                  {programsSubTab === 'categories' && (
                    showCategoryForm ? (
                      <CategoryForm
                        initial={editingCategory}
                        onSave={handleSaveCategory}
                        onCancel={() => { setShowCategoryForm(false); setEditingCategory(null); }}
                      />
                    ) : (
                      <CategoriesList
                        categories={categories}
                        loading={categoriesLoading}
                        onEdit={(c) => { setEditingCategory(c); setShowCategoryForm(true); }}
                        onDelete={(c) => setToDeleteCategory(c)}
                        onAdd={() => { setEditingCategory(null); setShowCategoryForm(true); }}
                      />
                    )
                  )}
                </div>
              )}

              {/* Footer Section */}
              {activeTab === 'footer' && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Footer Details</h3>
                    <p className="text-xs text-gray-500">Configure copyright text, short description, and social media references.</p>
                  </div>
                  <Textarea
                    label="Footer Brand Statement"
                    rows={3}
                    value={formData.footerDescription || ''}
                    onChange={(e) => updateField('footerDescription', e.target.value)}
                    placeholder="Short summary displayed at the bottom of pages..."
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Footer Label</label>
                    <Input
                      value={formData.copyrightText || ''}
                      onChange={(e) => updateField('copyrightText', e.target.value)}
                      placeholder="e.g. © 2026 FOROZ Organization. All rights reserved."
                    />
                  </div>

                  {/* Social links row list */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">Social Media Links</label>
                      <button
                        type="button"
                        onClick={handleAddSocialRow}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 py-1 px-2 rounded-md hover:bg-indigo-50 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Network
                      </button>
                    </div>

                    {socialRows.length > 0 ? (
                      <div className="space-y-2.5">
                        {socialRows.map((row) => (
                          <div key={row.id} className="flex gap-2 items-start bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <div className="w-1/3">
                              <select
                                value={row.platform}
                                onChange={(e) => handleUpdateSocialRow(row.id, 'platform', e.target.value)}
                                className="block w-full rounded-lg border-gray-300 border bg-white py-2 px-3 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                              >
                                <option value="">Select platform</option>
                                {PLATFORM_OPTIONS.map((p) => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex-1">
                              <Input
                                value={row.url}
                                onChange={(e) => handleUpdateSocialRow(row.id, 'url', e.target.value)}
                                placeholder="Link url (e.g. https://...)"
                                className="bg-white border-slate-200"
                              />
                              {errors[`social_url_${row.id}`] && (
                                <p className="mt-1 text-[11px] text-rose-600 font-medium">
                                  {errors[`social_url_${row.id}`]}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSocialRow(row.id)}
                              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-0.5"
                              aria-label="Delete link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-200 rounded-lg p-5 text-center bg-slate-50/50">
                        <p className="text-xs text-gray-400">No social media links configured yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons for Mobile / Tab layout */}
              <div className="pt-4 flex justify-end border-t border-gray-100 gap-3">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto shadow-md"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>

      <ConfirmDialog
        isOpen={toDeleteCourse !== null}
        onClose={() => setToDeleteCourse(null)}
        onConfirm={handleDeleteCourse}
        title="Delete Course"
        message={toDeleteCourse ? `Are you sure you want to delete the course "${toDeleteCourse.name}"?` : ''}
      />

      <ConfirmDialog
        isOpen={toDeleteCategory !== null}
        onClose={() => setToDeleteCategory(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={toDeleteCategory ? `Are you sure you want to delete the category "${toDeleteCategory.title}"?` : ''}
      />
    </div>
  );
}

// Subcomponents helper functions

interface IconPreviewProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

function IconPreview({ name, className, style }: IconPreviewProps) {
  const IconComponent = (LucideIcons as any)[name] || (LucideIcons as any)[name.charAt(0).toUpperCase() + name.slice(1)];
  if (!IconComponent) {
    return <Sparkles className={className} style={style} />;
  }
  return <IconComponent className={className} style={style} />;
}

interface CoreValueFormProps {
  initial: CoreValue | null;
  onSave: (data: CoreValue) => void;
  onCancel: () => void;
}

function CoreValueForm({ initial, onSave, onCancel }: CoreValueFormProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [icon, setIcon] = useState(initial?.icon || 'Heart');
  const [color, setColor] = useState(initial?.color || '#1E40AF');
  const [order, setOrder] = useState(initial?.order || 0);
  const [error, setError] = useState('');
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSave({
      id: initial?.id,
      title,
      description,
      icon,
      color,
      order: Number(order)
    });
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
        <h4 className="font-semibold text-slate-800">
          {initial ? 'Edit Core Value' : 'Add Core Value'}
        </h4>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Integrity" />
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain the value..." rows={3} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Icon</label>
            <button
              type="button"
              onClick={() => setIsIconPickerOpen(true)}
              className="flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-100">
                <IconPreview name={icon} className="h-4 w-4 text-slate-700" />
              </span>
              <span>{icon}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Color</label>
            <button
              type="button"
              onClick={() => setIsColorPickerOpen(true)}
              className="flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span
                className="h-7 w-7 rounded border border-slate-200"
                style={{ backgroundColor: color }}
              />
              <span>{color}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Order</label>
          <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} placeholder="0" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={handleSubmit}>
          Save
        </Button>
      </div>

      <Modal isOpen={isIconPickerOpen} onClose={() => setIsIconPickerOpen(false)} title="Choose an icon" size="md">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {CORE_VALUE_ICON_OPTIONS.map((iconName) => (
            <button
              key={iconName}
              type="button"
              onClick={() => {
                setIcon(iconName);
                setIsIconPickerOpen(false);
              }}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors ${
                icon === iconName
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <IconPreview name={iconName} className="h-5 w-5" />
              <span className="truncate w-full text-center">{iconName}</span>
            </button>
          ))}
        </div>
      </Modal>

      <Modal isOpen={isColorPickerOpen} onClose={() => setIsColorPickerOpen(false)} title="Choose a color" size="sm">
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-3">
            {CORE_VALUE_COLOR_OPTIONS.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                aria-label={`Use ${colorOption}`}
                onClick={() => {
                  setColor(colorOption);
                  setIsColorPickerOpen(false);
                }}
                className={`h-10 rounded-lg border-2 ${
                  color === colorOption ? 'border-slate-900 ring-2 ring-slate-300' : 'border-transparent'
                }`}
                style={{ backgroundColor: colorOption }}
              />
            ))}
          </div>
          <label className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
            Custom color
            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-slate-300 bg-white p-1"
            />
          </label>
          <div className="flex justify-end">
            <Button type="button" size="sm" onClick={() => setIsColorPickerOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface CoursesListProps {
  courses: Course[];
  loading: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onAdd: () => void;
}

function CoursesList({ courses, loading, onEdit, onDelete, onAdd }: CoursesListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-20 bg-gray-50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onAdd} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm items-start">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="w-24 h-16 rounded object-cover border border-gray-100 flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-16 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <BookOpen className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900 truncate">{course.name}</h4>
                  <Badge variant={course.published ? 'success' : 'neutral'}>
                    {course.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                <div className="flex gap-3 text-xs text-slate-400 mt-2">
                  <span>Subject: {course.subject}</span>
                  <span>Code: {course.code}</span>
                  <span>Level: {course.level}</span>
                  <span>Delivery: {course.delivery}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(course)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(course)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50/50">
          <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No courses configured yet.</p>
        </div>
      )}
    </div>
  );
}

interface CourseFormProps {
  initial: Course | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

function CourseForm({ initial, onSave, onCancel }: CourseFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [subject, setSubject] = useState(initial?.subject || '');
  const [code, setCode] = useState(initial?.code || '');
  const [courseCode, setCourseCode] = useState(initial?.courseCode || '');
  const [level, setLevel] = useState(initial?.level || '1');
  const [section, setSection] = useState(initial?.section || '');
  const [published, setPublished] = useState(initial?.published ?? true);
  const [delivery, setDelivery] = useState(initial?.delivery || 'self_paced');
  const [modules, setModules] = useState<string[]>(initial?.modules || []);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnail || '');
  const [newModuleText, setNewModuleText] = useState('');
  const [error, setError] = useState('');

  const handleAddModule = () => {
    if (newModuleText.trim()) {
      setModules([...modules, newModuleText.trim()]);
      setNewModuleText('');
    }
  };

  const handleRemoveModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Course name is required');
      return;
    }
    onSave({
      name,
      description,
      subject,
      code,
      courseCode: courseCode || code,
      level,
      section,
      published,
      delivery,
      modules,
      thumbnailFile
    });
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
        <h4 className="font-semibold text-slate-800">
          {initial ? 'Edit Course' : 'Create Course'}
        </h4>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Course Name *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Introduction to Programming" />
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course description..." rows={3} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Computer Science" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Code</label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. CS101" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Course Code</label>
              <Input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="e.g. CS101-A" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Level</label>
            <Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="e.g. 1" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Section</label>
            <Input value={section} onChange={(e) => setSection(e.target.value)} placeholder="e.g. A" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Delivery</label>
            <select
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              className="block w-full rounded-lg border-gray-300 border bg-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="self_paced">Self-paced</option>
              <option value="instructor_led">Instructor Led</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="published" className="text-xs font-medium text-slate-700">Published</label>
        </div>

        <div>
          <FileImageUpload
            label="Thumbnail Asset"
            value={thumbnailUrl}
            onChange={(file) => {
              setThumbnailFile(file);
              if (!file) setThumbnailUrl('');
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">Course Modules</label>
          <div className="flex gap-2">
            <Input
              value={newModuleText}
              onChange={(e) => setNewModuleText(e.target.value)}
              placeholder="e.g. Module 1: Basics"
            />
            <Button type="button" onClick={handleAddModule} size="sm" variant="outline">
              Add
            </Button>
          </div>
          {modules.length > 0 ? (
            <ul className="divide-y divide-slate-100 border border-slate-200 bg-white rounded-lg max-h-40 overflow-y-auto">
              {modules.map((mod, index) => (
                <li key={index} className="flex justify-between items-center py-2 px-3 text-sm text-slate-700 font-medium">
                  <span className="truncate">{mod}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveModule(index)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No modules added yet.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={handleSubmit}>
          Save Course
        </Button>
      </div>
    </div>
  );
}

interface CategoriesListProps {
  categories: CourseCategory[];
  loading: boolean;
  onEdit: (cat: CourseCategory) => void;
  onDelete: (cat: CourseCategory) => void;
  onAdd: () => void;
}

function CategoriesList({ categories, loading, onEdit, onDelete, onAdd }: CategoriesListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-20 bg-gray-50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onAdd} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm items-center">
              <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold uppercase">
                {cat.icon_text?.substring(0, 2) || 'CA'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900">{cat.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.description}</p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(cat)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(cat)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50/50">
          <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No categories configured yet.</p>
        </div>
      )}
    </div>
  );
}

interface CategoryFormProps {
  initial: CourseCategory | null;
  onSave: (data: Omit<CourseCategory, 'id'>) => void;
  onCancel: () => void;
}

function CategoryForm({ initial, onSave, onCancel }: CategoryFormProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [iconText, setIconText] = useState(initial?.icon_text || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSave({
      title,
      description,
      icon_text: iconText
    });
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
        <h4 className="font-semibold text-slate-800">
          {initial ? 'Edit Category' : 'Add Category'}
        </h4>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Technology" />
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Category description..." rows={3} />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Icon Label</label>
          <Input value={iconText} onChange={(e) => setIconText(e.target.value)} placeholder="e.g. cpu" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={handleSubmit}>
          Save Category
        </Button>
      </div>
    </div>
  );
}
