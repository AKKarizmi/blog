import React, { useEffect, useState } from 'react';
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
                      <Button onClick={() => { setEditingCoreValue(null); setShowCoreValueForm(true); }} size="sm">
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
                    <CoursesList
                      courses={courses}
                      loading={coursesLoading}
                      onEdit={(c) => { setEditingCourse(c); setShowCourseForm(true); }}
                      onDelete={(c) => setToDeleteCourse(c)}
                      onAdd={() => { setEditingCourse(null); setShowCourseForm(true); }}
                    />
                  )}

                  {programsSubTab === 'categories' && (
                    <CategoriesList
                      categories={categories}
                      loading={categoriesLoading}
                      onEdit={(c) => { setEditingCategory(c); setShowCategoryForm(true); }}
                      onDelete={(c) => setToDeleteCategory(c)}
                      onAdd={() => { setEditingCategory(null); setShowCategoryForm(true); }}
                    />
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
    </div>
  );
}
