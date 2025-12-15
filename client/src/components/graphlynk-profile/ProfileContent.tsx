import { useState, useCallback, memo, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Country, State, City }  from 'country-state-city';
import { Camera, Plus, X, Globe, Linkedin, Twitter, Github, Youtube, ExternalLink, Link as LinkIcon, CheckCircle, TrendingUp, Eye, Instagram, Facebook, Mic, Music, Radio, BookOpen, Briefcase, FileText, Hash, ChevronDown, ChevronUp, Crop, RotateCw, ZoomIn, ZoomOut, GraduationCap, Building2, MoreHorizontal, Share2, Mail, Code, MessageSquare, Pin, Fingerprint, LayoutGrid, Calendar, ChevronLeft, ChevronRight, Save, Barcode } from 'lucide-react';
import { Tier } from '@/types/graphlynk';
import { BlogSlideshowModal, BlogPost } from './BlogSlideshowModal';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { CredentialIcon, degreeMapping } from './EducationIcons';
import { getCompanyLogo, getFallbackLogoSVG, resolveCompanyDomain } from './CompanyLogoHelper';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileContentProps {
  tier: Tier;
}

interface SocialLink {
  id: string;
  type: string;
  label: string;
  url: string;
}

interface Identifiers {
  isni: string;
  orcid: string;
  musicbrainzArtist: string;
  musicbrainzLabel: string;
  wikidataQID: string;
}

interface AuthorityLinks {
  wikipedia: string;
  imdb: string;
  googleScholar: string;
  discogs: string;
  allmusic: string;
  crunchbase: string;
}

interface SocialNetworks {
  linkedin: string;
  github: string;
  twitter: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  threads: string;
  bluesky: string;
  pinterest: string;
}

interface PodcastPlatforms {
  applePodcasts: string;
  spotifyPodcasts: string;
  youtubePodcasts: string;
  rssFeed: string;
}

interface OtherLinks {
  personalSite: string;
  linktree: string;
  pressKit: string;
  pressArticles: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  current: boolean;
  honors: boolean;
}

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: any;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: (e: React.MouseEvent, id: string) => void;
}

const CollapsibleSection = memo(({ id, title, icon: Icon, children, isExpanded, onToggle }: CollapsibleSectionProps) => {
  return (
    <div className="glass-card-light dark:glass-card rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={(e) => onToggle(e, id)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
          <h3 className="text-gray-900 dark:text-white">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="p-6 pt-0">
          {children}
        </div>
      )}
    </div>
  );
});

CollapsibleSection.displayName = 'CollapsibleSection';

// Remove hardcoded arrays as we use country-state-city now for validation
// const US_STATES = ...
// const COUNTRIES = ...

export function ProfileContent({ tier }: ProfileContentProps) {
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'links']);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Profile data
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [name, setName] = useState('John Doe');
  const [title, setTitle] = useState('SEO Strategist');
  const [username, setUsername] = useState('demo');
  const [bio, setBio] = useState('Helping businesses dominate search rankings through knowledge graph optimization and strategic content. Featured in Search Engine Journal, Moz, and SEMrush.');
  const [isVerified, setIsVerified] = useState(true);
  
  // Location fields - Storing ISO codes for Country/State to handle logic, Names for City
  const [countryIso, setCountryIso] = useState('');
  const [stateIso, setStateIso] = useState('');
  const [city, setCity] = useState(''); // City Name
  
  const [postalCode, setPostalCode] = useState('');
  const [locationVisibility, setLocationVisibility] = useState<'full' | 'region' | 'country'>('full');

  // Derived lists
  // Ensure country-state-city data is loaded
  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(() => countryIso ? State.getStatesOfCountry(countryIso) : [], [countryIso]);
  const cities = useMemo(() => (countryIso && stateIso) ? City.getCitiesOfState(countryIso, stateIso) : [], [countryIso, stateIso]);

  // Helper to get Names from ISOs
  const getCountryName = (iso: string) => countries.find(c => c.isoCode === iso)?.name || iso;
  const getStateName = (iso: string) => states.find(s => s.isoCode === iso)?.name || iso;

  // Image crop states
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  
  // Identifiers
  const [identifiers, setIdentifiers] = useState<Identifiers>({
    isni: '',
    orcid: '',
    musicbrainzArtist: '',
    musicbrainzLabel: '',
    wikidataQID: ''
  });

  // Authority Links
  const [authorityLinks, setAuthorityLinks] = useState<AuthorityLinks>({
    wikipedia: '',
    imdb: '',
    googleScholar: '',
    discogs: '',
    allmusic: '',
    crunchbase: ''
  });

  // Social Networks
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworks>({
    linkedin: 'linkedin.com/in/johndoe',
    github: '',
    twitter: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    threads: '',
    bluesky: '',
    pinterest: ''
  });

  // Podcast Platforms
  const [podcastPlatforms, setPodcastPlatforms] = useState<PodcastPlatforms>({
    applePodcasts: '',
    spotifyPodcasts: '',
    youtubePodcasts: '',
    rssFeed: ''
  });

  // Other Links
  const [otherLinks, setOtherLinks] = useState<OtherLinks>({
    personalSite: '',
    linktree: '',
    pressKit: '',
    pressArticles: []
  });

  // Blog Posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
        id: '1',
        title: 'The Future of SEO is Entities',
        excerpt: 'Why keywords are dying and what you need to do about it. Understanding the shift from strings to things is crucial for modern SEO strategy.',
        coverImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1000',
        date: 'Oct 28, 2024',
        url: '#',
        isPinned: true
    },
    {
        id: '2',
        title: 'Mastering Knowledge Graphs',
        excerpt: 'A comprehensive guide to building your first knowledge graph. Learn the basics of nodes, edges, and properties.',
        coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
        date: 'Oct 25, 2024',
        url: '#',
        isPinned: false
    },
    {
        id: '3',
        title: 'Schema Markup 101',
        excerpt: 'How to implement structured data for better search visibility. Boost your click-through rates with rich snippets.',
        coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1000',
        date: 'Oct 20, 2024',
        url: '#',
        isPinned: false
    },
    {
        id: '4',
        title: 'Voice Search Optimization',
        excerpt: 'Preparing your content for the voice search revolution. Optimizing for natural language queries.',
        coverImage: 'https://images.unsplash.com/photo-1589254065878-42c9da9e2fa6?auto=format&fit=crop&q=80&w=1000',
        date: 'Oct 15, 2024',
        url: '#',
        isPinned: false
    }
  ]);

  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Reset preview to pinned post when entering preview mode
  useEffect(() => {
    if (activeView === 'preview') {
      const pinnedIndex = blogPosts.findIndex(p => p.isPinned);
      setPreviewIndex(pinnedIndex >= 0 ? pinnedIndex : 0);
    }
  }, [activeView, blogPosts]);

  // Social links (for public display links)
  const [links, setLinks] = useState<SocialLink[]>([
    { id: '1', type: 'website', label: 'Website', url: 'johndoe.com' },
    { id: '2', type: 'linkedin', label: 'LinkedIn', url: 'linkedin.com/in/johndoe' },
    { id: '3', type: 'custom', label: 'SEO Blog & Resources', url: 'blog.johndoe.com' },
    { id: '4', type: 'custom', label: 'Book a Consultation', url: 'calendly.com/johndoe' },
  ]);

  // Knowledge Graph Metrics
  const [metrics] = useState({
    claimed: true,
    mentions: 12,
    accuracy: 98,
    lastCrawl: '5d'
  });

  // Education
  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      institution: 'Stanford University',
      degree: "Master's Degree",
      field: 'Computer Science',
      startYear: '2018',
      endYear: '2020',
      current: false,
      honors: true
    }
  ]);

  const toggleSection = useCallback((e: React.MouseEvent, section: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }, []);

  // Get location display based on visibility setting
  const getLocationDisplay = () => {
    const countryName = getCountryName(countryIso);
    const stateName = getStateName(stateIso);

    if (locationVisibility === 'full' && city && stateName && countryName) {
      return `${city}, ${stateName}, ${countryName}`;
    } else if (locationVisibility === 'full' && (city || stateName || countryName)) {
      return [city, stateName, countryName].filter(Boolean).join(', ');
    } else if (locationVisibility === 'region' && stateName && countryName) {
      return `${stateName}, ${countryName}`;
    } else if (locationVisibility === 'region' && (stateName || countryName)) {
      return [stateName, countryName].filter(Boolean).join(', ');
    } else if (locationVisibility === 'country' && countryName) {
      return countryName;
    }
    return '';
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setShowCropModal(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    return canvas.toDataURL('image/jpeg');
  };

  const handleCropSave = async () => {
    if (croppedAreaPixels && imageToCrop) {
      try {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels, rotation);
        setProfilePhoto(croppedImage);
        setShowCropModal(false);
        setImageToCrop('');
      } catch (e) {
        console.error('Error cropping image:', e);
      }
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop('');
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  // Education functions
  const addEducation = () => {
    if (education.length >= 2) {
      return; // Limit to 2 education entries
    }
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      current: false,
      honors: false
    };
    setEducation([...education, newEducation]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      type: 'custom',
      label: 'New Link',
      url: ''
    };
    setLinks([...links, newLink]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const updateLink = (id: string, field: keyof SocialLink, value: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const addPressArticle = () => {
    setOtherLinks({
      ...otherLinks,
      pressArticles: [...otherLinks.pressArticles, '']
    });
  };

  const updatePressArticle = (index: number, value: string) => {
    const updated = [...otherLinks.pressArticles];
    updated[index] = value;
    setOtherLinks({ ...otherLinks, pressArticles: updated });
  };

  const removePressArticle = (index: number) => {
    setOtherLinks({
      ...otherLinks,
      pressArticles: otherLinks.pressArticles.filter((_, i) => i !== index)
    });
  };

  const getIconComponent = (type: string) => {
    switch (type) {
      case 'website':
      case 'globe':
        return Globe;
      case 'linkedin':
        return Linkedin;
      case 'twitter':
        return Twitter;
      case 'github':
        return Github;
      case 'youtube':
        return Youtube;
      case 'instagram':
        return Instagram;
      case 'facebook':
        return Facebook;
      default:
        return LinkIcon;
    }
  };

  // Extract domain name from URL
  const extractDomain = (url: string): string => {
    if (!url) return '';
    
    // Remove protocol if present
    let domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    // Remove path and query string
    domain = domain.split('/')[0];
    
    // Capitalize first letter for display
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  };

  // Collect all sameAs links for schema
  const collectSameAsLinks = () => {
    const allLinks: string[] = [];
    
    // Social Networks
    Object.entries(socialNetworks).forEach(([key, value]) => {
      if (value) allLinks.push(value);
    });
    
    // Authority Links
    Object.entries(authorityLinks).forEach(([key, value]) => {
      if (value) allLinks.push(value);
    });
    
    // Podcast Platforms
    Object.entries(podcastPlatforms).forEach(([key, value]) => {
      if (value && key !== 'rssFeed') allLinks.push(value);
    });
    
    // Other Links
    if (otherLinks.personalSite) allLinks.push(otherLinks.personalSite);
    if (otherLinks.linktree) allLinks.push(otherLinks.linktree);
    otherLinks.pressArticles.forEach(article => {
      if (article) allLinks.push(article);
    });
    
    return allLinks;
  };

  const containsSpam = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    
    // 1. Check for common spam keywords
    const spamKeywords = [
      'buy now', 'click here', 'free money', 'make money fast', 
      'lose weight fast', 'viagra', 'cialis', 'casino', 'lottery', 
      'winner', 'crypto hack', 'bitcoin miner'
    ];
    
    for (const keyword of spamKeywords) {
      if (lowerText.includes(keyword)) {
        return true;
      }
    }

    // 2. Check for excessive URLs (simple heuristic: counting http/https occurrences)
    const urlCount = (lowerText.match(/http/g) || []).length;
    if (urlCount > 3) {
      return true;
    }

    // 3. Check for extremely long words (potential gibberish or hash spam)
    const words = text.split(/\s+/);
    if (words.some(word => word.length > 40 && !word.includes('http'))) {
      return true; 
    }

    return false;
  };

  const validateProfile = () => {
    let isValid = true;
    let firstErrorSection = '';

    // Location Validation
    if (!city.trim() || !stateIso || !countryIso) {
      toast.error("Location fields are incomplete.", {
        description: "Country, State/Region, and City are required."
      });
      isValid = false;
      firstErrorSection = 'basic';
    }

    // Bio Validation
    if (isValid) {
      if (!bio.trim()) {
        toast.error("Bio is required.", {
          description: "Please enter a short bio about yourself."
        });
        isValid = false;
        firstErrorSection = 'basic';
      } else if (bio.length < 20) {
        toast.error("Bio is too short.", {
          description: "Your bio must be at least 20 characters long."
        });
        isValid = false;
        firstErrorSection = 'basic';
      } else if (containsSpam(bio)) {
        toast.error("Bio contains spam or invalid content.", {
          description: "Please remove promotional links, spam keywords, or excessive URLs."
        });
        isValid = false;
        firstErrorSection = 'basic';
      }
    }

    if (!isValid && firstErrorSection) {
      if (!expandedSections.includes(firstErrorSection)) {
        setExpandedSections(prev => [...prev, firstErrorSection]);
      }
      
      setTimeout(() => {
        const sectionElement = document.getElementById(firstErrorSection === 'basic' ? 'basic-info-section' : firstErrorSection);
        // Fallback to top if specific ID not found, though we should add IDs
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // For basic info specifically, since we have IDs inside it
             if (firstErrorSection === 'basic') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
             }
        }
      }, 100);
    }
    
    return isValid;
  };

  const handleSave = () => {
    if (validateProfile()) {
      toast.success("Profile changes saved successfully!");
    }
  };

  const handlePreview = () => {
    if (validateProfile()) {
      setActiveView('preview');
    }
  };

// Schema Preview Data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": title,
    "url": `https://graphlynk.com/${username}`,
    "description": `${bio.substring(0, 100)}...`,
    ...(city || stateIso || countryIso ? {
      "address": {
        "@type": "PostalAddress",
        ...(city ? { "addressLocality": city } : {}),
        ...(stateIso ? { "addressRegion": getStateName(stateIso) } : {}),
        ...(countryIso ? { "addressCountry": getCountryName(countryIso) } : {}),
        ...(postalCode ? { "postalCode": postalCode } : {})
      }
    } : {}),
    ...(identifiers.isni ? { "isni": identifiers.isni } : {}),
    ...(identifiers.orcid ? { "orcid": identifiers.orcid } : {}),
    ...(identifiers.wikidataQID ? { "identifier": identifiers.wikidataQID } : {}),
    "sameAs": collectSameAsLinks().map(link => `https://${link}`)
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Crop Modal */}
        {showCropModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="glass-card-light dark:glass-card rounded-2xl p-8 w-full max-w-3xl mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <Crop className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                  Crop & Edit Photo
                </h3>
                <button
                  onClick={handleCropCancel}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Crop Area */}
              <div className="relative w-full h-96 bg-gray-900 rounded-xl overflow-hidden mb-6">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Controls */}
              <div className="space-y-4 mb-6">
                {/* Zoom Control */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                    <ZoomIn className="w-4 h-4" />
                    Zoom
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0b3d84] dark:accent-[#6EE7F5]"
                  />
                </div>

                {/* Rotation Control */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                    <RotateCw className="w-4 h-4" />
                    Rotation
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0b3d84] dark:accent-[#6EE7F5]"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                    {rotation}°
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCropCancel}
                  className="px-6 py-2.5 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-[#E6E9EE] hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg hover:shadow-[#0b3d84]/30 dark:hover:shadow-[#6EE7F5]/30 transition-all"
                >
                  Apply & Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white mb-2">PROFILE & LINKS</h1>
            <p className="text-gray-600 dark:text-[#98A2B3]">Manage your public profile, identifiers, and all external links for schema markup</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-3">
             {activeView === 'edit' && (
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-xl transition-all duration-200 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#E6E9EE] hover:bg-gray-50 dark:hover:bg-white/10 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            )}
            <button
              onClick={() => setActiveView('edit')}
              className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                activeView === 'edit'
                  ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                  : 'glass-card-light dark:glass-card text-gray-700 dark:text-[#E6E9EE] hover:shadow-md'
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={handlePreview}
              className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                activeView === 'preview'
                  ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                  : 'glass-card-light dark:glass-card text-gray-700 dark:text-[#E6E9EE] hover:shadow-md'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Edit View */}
        {activeView === 'edit' && (
          <div className="space-y-6">
            {/* Basic Profile Section */}
            <CollapsibleSection 
              id="basic" 
              title="BASIC INFORMATION" 
              icon={Globe}
              isExpanded={expandedSections.includes('basic')}
              onToggle={toggleSection}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Photo */}
                <div>
                  <h4 className="text-sm text-gray-700 dark:text-[#E6E9EE] mb-4">PROFILE PHOTO</h4>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] flex items-center justify-center overflow-hidden">
                        {profilePhoto ? (
                          <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-4xl">{name.charAt(0)}</span>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#0b3d84] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg">
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-2">
                        Upload a professional photo. Recommended size: 500x500px
                      </p>
                      <button
                        onClick={() => setProfilePhoto('')}
                        className="text-sm text-red-500 hover:text-red-600 transition-colors"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Basic Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Title / Role
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                        className="w-full pl-8 pr-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your profile will be available at: graphlynk.com/{username}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="mt-6">
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-500/30">
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    💡 We'll store your precise city for search verification and SEO; you control what's shown publicly on your profile card.
                  </p>
                </div>

                {/* Location Fields */}
                <div id="location-fields" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={countryIso}
                      onChange={(e) => {
                        setCountryIso(e.target.value);
                        setStateIso('');
                        setCity('');
                      }}
                      className={`w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all ${
                        !countryIso && expandedSections.includes('basic') && activeView === 'edit' ? 'border-gray-200 dark:border-white/10' : 'border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      State / Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={stateIso}
                      onChange={(e) => {
                        setStateIso(e.target.value);
                        setCity('');
                      }}
                      disabled={!countryIso}
                      className={`w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        !stateIso && expandedSections.includes('basic') && activeView === 'edit' ? 'border-gray-200 dark:border-white/10' : 'border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <option value="">Select State/Region</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    {cities.length > 0 ? (
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!stateIso}
                        className={`w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          !city && expandedSections.includes('basic') && activeView === 'edit' ? 'border-gray-200 dark:border-white/10' : 'border-gray-200 dark:border-white/10'
                        }`}
                      >
                        <option value="">Select City</option>
                        {cities.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter City"
                        disabled={!stateIso}
                        className={`w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          !city && expandedSections.includes('basic') && activeView === 'edit' ? 'border-gray-200 dark:border-white/10' : 'border-gray-200 dark:border-white/10'
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* Optional: Postal Code */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                    Postal Code <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="07102"
                    className="w-full md:w-1/3 px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                  />
                </div>

                {/* Location Visibility Control */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-[#12161A] rounded-xl border border-gray-200 dark:border-white/10">
                  <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-3">
                    Public Profile Display
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="locationVisibility"
                        value="full"
                        checked={locationVisibility === 'full'}
                        onChange={(e) => setLocationVisibility(e.target.value as any)}
                        className="mt-0.5 w-4 h-4 text-[#0b3d84] focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5]"
                      />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">
                          City + State/Region, Country
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#98A2B3]">
                          Example: "Newark, New Jersey, United States"
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="locationVisibility"
                        value="region"
                        checked={locationVisibility === 'region'}
                        onChange={(e) => setLocationVisibility(e.target.value as any)}
                        className="mt-0.5 w-4 h-4 text-[#0b3d84] focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5]"
                      />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">
                          State/Region + Country
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#98A2B3]">
                          Example: "New Jersey, United States"
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="locationVisibility"
                        value="country"
                        checked={locationVisibility === 'country'}
                        onChange={(e) => setLocationVisibility(e.target.value as any)}
                        className="mt-0.5 w-4 h-4 text-[#0b3d84] focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5]"
                      />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">
                          Country only
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#98A2B3]">
                          Example: "United States"
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                  About / Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className={`w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all resize-none ${
                    (!bio || bio.length < 20) && expandedSections.includes('basic') && activeView === 'edit' && bio.length > 0 ? 'border-yellow-500' : 'border-gray-200 dark:border-white/10'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {bio.length} / 500 characters (min. 20)
                  </p>
                  {bio.length > 0 && bio.length < 20 && (
                    <span className="text-xs text-yellow-500">Too short</span>
                  )}
                </div>
              </div>

            </CollapsibleSection>

            {/* Education Section */}
            <CollapsibleSection 
              id="education" 
              title="EDUCATION" 
              icon={GraduationCap}
              isExpanded={expandedSections.includes('education')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-4">
                  Add your educational background. Credentials will be displayed with custom icons on your profile.
                </p>
                
                {education.map((edu, index) => (
                  <div key={edu.id} className="p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm text-gray-900 dark:text-white">Education {index + 1}</h4>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="University Name"
                          className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                          Degree
                        </label>
                        <select
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                        >
                          <option value="">Select Degree</option>
                          <option value="High School Diploma">High School Diploma</option>
                          <option value="Certificate">Certificate</option>
                          <option value="Bootcamp">Bootcamp</option>
                          <option value="Associate Degree">Associate Degree</option>
                          <option value="Associate of Arts (A.A.)">Associate of Arts (A.A.)</option>
                          <option value="Associate of Science (A.S.)">Associate of Science (A.S.)</option>
                          <option value="Bachelor's Degree">Bachelor's Degree</option>
                          <option value="Bachelor of Arts (B.A.)">Bachelor of Arts (B.A.)</option>
                          <option value="Bachelor of Science (B.S.)">Bachelor of Science (B.S.)</option>
                          <option value="Master's Degree">Master's Degree</option>
                          <option value="Master of Arts (M.A.)">Master of Arts (M.A.)</option>
                          <option value="Master of Science (M.S.)">Master of Science (M.S.)</option>
                          <option value="MBA">MBA</option>
                          <option value="Doctorate">Doctorate</option>
                          <option value="Ph.D.">Ph.D.</option>
                          <option value="M.D.">M.D.</option>
                          <option value="J.D.">J.D.</option>
                          <option value="Professional License">Professional License</option>
                          <option value="CPA">CPA</option>
                          <option value="PE">PE</option>
                          <option value="Bar License">Bar License</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          placeholder="e.g., Computer Science"
                          className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                            Start Year
                          </label>
                          <input
                            type="text"
                            value={edu.startYear}
                            onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                            placeholder="2018"
                            className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                            End Year
                          </label>
                          <input
                            type="text"
                            value={edu.endYear}
                            onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                            placeholder="2020"
                            disabled={edu.current}
                            className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                          className="w-4 h-4 accent-[#0b3d84] dark:accent-[#6EE7F5]"
                        />
                        <span className="text-sm text-gray-700 dark:text-[#E6E9EE]">Currently Enrolled</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={edu.honors}
                          onChange={(e) => updateEducation(edu.id, 'honors', e.target.checked)}
                          className="w-4 h-4 accent-[#0b3d84] dark:accent-[#6EE7F5]"
                        />
                        <span className="text-sm text-gray-700 dark:text-[#E6E9EE]">Honors / Distinction</span>
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addEducation}
                  disabled={education.length >= 2}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl text-gray-600 dark:text-[#98A2B3] hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] hover:text-[#0b3d84] dark:hover:text-[#6EE7F5] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:dark:border-white/20 disabled:hover:text-gray-600 disabled:hover:dark:text-[#98A2B3]"
                >
                  <Plus className="w-4 h-4" />
                  {education.length >= 2 ? 'Maximum Education Entries Reached' : 'Add Education'}
                </button>
              </div>
            </CollapsibleSection>

            {/* Profile Identifiers Section */}
            <CollapsibleSection 
              id="identifiers" 
              title="PROFILE IDENTIFIERS" 
              icon={Hash}
              isExpanded={expandedSections.includes('identifiers')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-4">
                  These identifiers map to their respective schema properties and establish authority.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      ISNI (International Standard Name Identifier)
                    </label>
                    <input
                      type="text"
                      value={identifiers.isni}
                      onChange={(e) => setIdentifiers({ ...identifiers, isni: e.target.value })}
                      placeholder="0000 0001 2345 6789"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      ORCID (Open Researcher and Contributor ID)
                    </label>
                    <input
                      type="text"
                      value={identifiers.orcid}
                      onChange={(e) => setIdentifiers({ ...identifiers, orcid: e.target.value })}
                      placeholder="0000-0001-2345-6789"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      MusicBrainz Artist ID
                    </label>
                    <input
                      type="text"
                      value={identifiers.musicbrainzArtist}
                      onChange={(e) => setIdentifiers({ ...identifiers, musicbrainzArtist: e.target.value })}
                      placeholder="12345678-1234-1234-1234-123456789012"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      MusicBrainz Label ID
                    </label>
                    <input
                      type="text"
                      value={identifiers.musicbrainzLabel}
                      onChange={(e) => setIdentifiers({ ...identifiers, musicbrainzLabel: e.target.value })}
                      placeholder="12345678-1234-1234-1234-123456789012"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Wikidata QID
                    </label>
                    <input
                      type="text"
                      value={identifiers.wikidataQID}
                      onChange={(e) => setIdentifiers({ ...identifiers, wikidataQID: e.target.value })}
                      placeholder="Q12345"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Authority & Knowledge Base Links */}
            <CollapsibleSection 
              id="authority" 
              title="AUTHORITY & KNOWLEDGE BASE LINKS" 
              icon={BookOpen}
              isExpanded={expandedSections.includes('authority')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-4">
                  Links to authoritative sources that verify your identity and expertise.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Wikipedia
                    </label>
                    <input
                      type="text"
                      value={authorityLinks.wikipedia}
                      onChange={(e) => setAuthorityLinks({ ...authorityLinks, wikipedia: e.target.value })}
                      placeholder="en.wikipedia.org/wiki/Your_Name"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      IMDb
                    </label>
                    <input
                      type="text"
                      value={authorityLinks.imdb}
                      onChange={(e) => setAuthorityLinks({ ...authorityLinks, imdb: e.target.value })}
                      placeholder="imdb.com/name/nm1234567"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Google Scholar
                    </label>
                    <input
                      type="text"
                      value={authorityLinks.googleScholar}
                      onChange={(e) => setAuthorityLinks({ ...authorityLinks, googleScholar: e.target.value })}
                      placeholder="scholar.google.com/citations?user=..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Discogs
                    </label>
                    <input
                      type="text"
                      value={authorityLinks.discogs}
                      onChange={(e) => setAuthorityLinks({ ...authorityLinks, discogs: e.target.value })}
                      placeholder="discogs.com/artist/..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      AllMusic
                    </label>
                    <input
                      type="text"
                      value={authorityLinks.allmusic}
                      onChange={(e) => setAuthorityLinks({ ...authorityLinks, allmusic: e.target.value })}
                      placeholder="allmusic.com/artist/..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Crunchbase
                    </label>
                    <input
                      type="text"
                      value={authorityLinks.crunchbase}
                      onChange={(e) => setAuthorityLinks({ ...authorityLinks, crunchbase: e.target.value })}
                      placeholder="crunchbase.com/person/..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Social & Professional Networks */}
            <CollapsibleSection 
              id="social" 
              title="SOCIAL & PROFESSIONAL NETWORKS" 
              icon={Linkedin}
              isExpanded={expandedSections.includes('social')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-4">
                  Connect all your social media and professional network profiles.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2 flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={socialNetworks.linkedin}
                      onChange={(e) => setSocialNetworks({ ...socialNetworks, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2 flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      GitHub
                    </label>
                    <input
                      type="text"
                      value={socialNetworks.github}
                      onChange={(e) => setSocialNetworks({ ...socialNetworks, github: e.target.value })}
                      placeholder="github.com/username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2 flex items-center gap-2">
                      <Twitter className="w-4 h-4" />
                      X / Twitter
                    </label>
                    <input
                      type="text"
                      value={socialNetworks.twitter}
                      onChange={(e) => setSocialNetworks({ ...socialNetworks, twitter: e.target.value })}
                      placeholder="x.com/username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2 flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={socialNetworks.instagram}
                      onChange={(e) => setSocialNetworks({ ...socialNetworks, instagram: e.target.value })}
                      placeholder="instagram.com/username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2 flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </label>
                    <input
                      type="text"
                      value={socialNetworks.facebook}
                      onChange={(e) => setSocialNetworks({ ...socialNetworks, facebook: e.target.value })}
                      placeholder="facebook.com/username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2 flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      TikTok
                    </label>
                    <input
                      type="text"
                      value={socialNetworks.tiktok}
                      onChange={(e) => setSocialNetworks({ ...socialNetworks, tiktok: e.target.value })}
                      placeholder="tiktok.com/@username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2 flex items-center gap-2">
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </label>
                    <input
                      type="text"
                      value={socialNetworks.youtube}
                      onChange={(e) => setSocialNetworks({ ...socialNetworks, youtube: e.target.value })}
                      placeholder="youtube.com/@username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Threads
                    </label>
                    <input
                      type="text"
                      value={socialNetworks.threads}
                      onChange={(e) => setSocialNetworks({ ...socialNetworks, threads: e.target.value })}
                      placeholder="threads.net/@username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Bluesky
                    </label>
                    <input
                      type="text"
                      value={socialNetworks.bluesky}
                      onChange={(e) => setSocialNetworks({ ...socialNetworks, bluesky: e.target.value })}
                      placeholder="bsky.app/profile/username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Pinterest
                    </label>
                    <input
                      type="text"
                      value={socialNetworks.pinterest}
                      onChange={(e) => setSocialNetworks({ ...socialNetworks, pinterest: e.target.value })}
                      placeholder="pinterest.com/username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Audio/Podcast Platforms */}
            <CollapsibleSection 
              id="podcast" 
              title="AUDIO & PODCAST PLATFORMS" 
              icon={Mic}
              isExpanded={expandedSections.includes('podcast')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-4">
                  Add your podcast and audio platform links.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Apple Podcasts
                    </label>
                    <input
                      type="text"
                      value={podcastPlatforms.applePodcasts}
                      onChange={(e) => setPodcastPlatforms({ ...podcastPlatforms, applePodcasts: e.target.value })}
                      placeholder="podcasts.apple.com/podcast/..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Spotify Podcasts
                    </label>
                    <input
                      type="text"
                      value={podcastPlatforms.spotifyPodcasts}
                      onChange={(e) => setPodcastPlatforms({ ...podcastPlatforms, spotifyPodcasts: e.target.value })}
                      placeholder="open.spotify.com/show/..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      YouTube Podcasts
                    </label>
                    <input
                      type="text"
                      value={podcastPlatforms.youtubePodcasts}
                      onChange={(e) => setPodcastPlatforms({ ...podcastPlatforms, youtubePodcasts: e.target.value })}
                      placeholder="youtube.com/@yourpodcast"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      RSS Feed URL
                    </label>
                    <input
                      type="text"
                      value={podcastPlatforms.rssFeed}
                      onChange={(e) => setPodcastPlatforms({ ...podcastPlatforms, rssFeed: e.target.value })}
                      placeholder="yoursite.com/podcast/feed"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Other Links */}
            <CollapsibleSection 
              id="other" 
              title="OTHER LINKS" 
              icon={FileText}
              isExpanded={expandedSections.includes('other')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-4">
                  Additional links for your personal site, link hubs, press kit, and media mentions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Personal Website
                    </label>
                    <input
                      type="text"
                      value={otherLinks.personalSite}
                      onChange={(e) => setOtherLinks({ ...otherLinks, personalSite: e.target.value })}
                      placeholder="yoursite.com"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Link Hub (Linktree, Bio.link, etc.)
                    </label>
                    <input
                      type="text"
                      value={otherLinks.linktree}
                      onChange={(e) => setOtherLinks({ ...otherLinks, linktree: e.target.value })}
                      placeholder="linktr.ee/username"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                      Press Kit URL
                    </label>
                    <input
                      type="text"
                      value={otherLinks.pressKit}
                      onChange={(e) => setOtherLinks({ ...otherLinks, pressKit: e.target.value })}
                      placeholder="yoursite.com/press"
                      className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm text-gray-700 dark:text-[#E6E9EE]">
                      Press Articles & Media Mentions
                    </label>
                    <button
                      onClick={addPressArticle}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Article
                    </button>
                  </div>
                  <div className="space-y-3">
                    {otherLinks.pressArticles.map((article, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={article}
                          onChange={(e) => updatePressArticle(index, e.target.value)}
                          placeholder="Full URL to press article or media mention"
                          className="flex-1 px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                        />
                        <button
                          onClick={() => removePressArticle(index)}
                          className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {otherLinks.pressArticles.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-[#98A2B3] text-center py-4">
                        No press articles added yet. Click "Add Article" to get started.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Blog Highlights */}
            <CollapsibleSection 
              id="blog" 
              title="BLOG HIGHLIGHTS" 
              icon={LayoutGrid}
              isExpanded={expandedSections.includes('blog')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-4">
                  Select which posts to highlight on your profile. Pin a post to feature it at the top.
                </p>
                
                <div className="space-y-3">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="p-4 bg-white dark:bg-[#1A1F26] rounded-xl border border-gray-200 dark:border-white/10 flex gap-4">
                       <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-white/5 overflow-hidden flex-shrink-0">
                         <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</h4>
                         <p className="text-xs text-gray-500 dark:text-[#98A2B3] mt-1 line-clamp-2">{post.excerpt}</p>
                         <div className="flex items-center gap-4 mt-2">
                           <button
                             onClick={() => {
                               setBlogPosts(blogPosts.map(p => ({
                                 ...p,
                                 isPinned: p.id === post.id ? !p.isPinned : false // Only one pinned post allowed for now
                               })));
                             }}
                             className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                               post.isPinned 
                                 ? 'text-[#0b3d84] dark:text-[#6EE7F5]' 
                                 : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                             }`}
                           >
                             <Pin className={`w-3 h-3 ${post.isPinned ? 'fill-current' : ''}`} />
                             {post.isPinned ? 'Pinned to Top' : 'Pin to Top'}
                           </button>
                           <span className="text-xs text-gray-400 dark:text-gray-600">{post.date}</span>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            {/* Public Display Links */}
            <CollapsibleSection 
              id="links" 
              title="PUBLIC PROFILE LINKS" 
              icon={LinkIcon}
              isExpanded={expandedSections.includes('links')}
              onToggle={toggleSection}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-[#98A2B3]">
                    These are the primary links displayed on your public profile card.
                  </p>
                  <button
                    onClick={addLink}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </button>
                </div>

                <div className="space-y-3">
                  {links.map((link) => (
                    <div key={link.id} className="p-4 bg-white dark:bg-[#1A1F26] rounded-xl border border-gray-200 dark:border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                            placeholder="Link Label"
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#12161A] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                          />
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                            placeholder="URL"
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#12161A] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                          />
                          <select
                            value={link.type}
                            onChange={(e) => updateLink(link.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#12161A] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                          >
                            <option value="custom">Custom Link</option>
                            <option value="website">Website</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter</option>
                            <option value="github">GitHub</option>
                            <option value="youtube">YouTube</option>
                          </select>
                        </div>
                        <button
                          onClick={() => removeLink(link.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {tier === 'free' && links.length >= 4 && (
                  <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30 rounded-xl">
                    <p className="text-sm text-purple-900 dark:text-purple-300">
                      Free plan: 4 links maximum. Upgrade to Premium for unlimited links.
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {/* Schema Preview */}
            <div className="glass-card-light dark:glass-card rounded-2xl p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">SCHEMA MARKUP PREVIEW</h3>
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <pre className="text-green-400 text-xs">
                  {JSON.stringify(schemaData, null, 2)}
                </pre>
              </div>
              <p className="text-xs text-gray-500 dark:text-[#98A2B3] mt-3">
                All your links and identifiers automatically flow into schema.org structured data. Your full location (including city) is included in the schema for SEO, while your public profile displays only what you've selected in visibility settings.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
              <button className="flex-1 px-6 py-4 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all duration-200">
                Save All Changes
              </button>
              <button className="px-6 py-4 glass-card-light dark:glass-card text-gray-700 dark:text-[#E6E9EE] rounded-xl hover:shadow-md transition-all duration-200">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Preview View */}
        {activeView === 'preview' && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl relative">
              {/* Horizontal Three-dot Share Menu Button - Top Right (Moved to Profile Info) */}

              {/* Public Profile Preview */}
              <div className="bg-white dark:bg-[#1A1F26] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                <div className="p-8 lg:p-12">
                  <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    {/* Profile Photo & Credentials */}
                    <div className="flex-shrink-0">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] flex items-center justify-center overflow-hidden shadow-xl mb-4">
                        {profilePhoto ? (
                          <img src={profilePhoto} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-6xl">{name.charAt(0)}</span>
                        )}
                      </div>

                      {/* Position above Education */}
                      <div className="mb-2">
                        <p className="text-gray-600 dark:text-[#98A2B3] text-sm text-center">
                          {title}
                        </p>
                      </div>

                      {/* Education Credentials */}
                      {education.length > 0 && (
                        <div className="mb-4">
                          <div className="space-y-2">
                            {education.map((edu) => {
                              const mapping = degreeMapping[edu.degree as keyof typeof degreeMapping];
                              if (!mapping) return null;
                              
                              const badge = edu.current ? 'inProgress' : edu.honors ? 'honors' : undefined;
                              
                              return (
                                <div key={edu.id} className="flex items-center gap-3 p-2 bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                                  <CredentialIcon 
                                    level={mapping.icon as any}
                                    variant="filled"
                                    badge={badge}
                                    className="text-[#0b3d84] dark:text-[#6EE7F5] flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-900 dark:text-white truncate">{edu.degree}</p>
                                    <p className="text-xs text-gray-500 dark:text-[#98A2B3] truncate">{edu.institution}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Contact Button */}
                      {/* <div className="mb-4">
                        <button
                          onClick={() => {}}
                          className="w-full px-6 py-3.5 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg hover:shadow-[#0b3d84]/30 dark:hover:shadow-[#6EE7F5]/30 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-5 h-5" />
                          Contact {name}
                        </button>
                      </div> */}

                      {/* Profile Identifiers */}
                      {(identifiers.isni || identifiers.orcid || identifiers.musicbrainzArtist || identifiers.musicbrainzLabel || identifiers.wikidataQID) && (
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
                          <h4 className="text-xs text-gray-500 dark:text-[#98A2B3] mb-3 flex items-center gap-2 uppercase tracking-wider">
                            <Fingerprint className="w-3 h-3" /> Verified Identifiers
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {identifiers.isni && (
                              <a 
                                href={`https://isni.org/isni/${identifiers.isni.replace(/\s/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-lg group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <span className="text-[10px] font-bold">IS</span>
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-blue-900 dark:text-blue-100 block">ISNI</span>
                                    <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 group-hover:underline decoration-blue-500/50">{identifiers.isni}</span>
                                  </div>
                                </div>
                              </a>
                            )}
                            {identifiers.orcid && (
                              <div className="flex items-center justify-between p-2.5 bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-lg group hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <span className="text-[10px] font-bold">ID</span>
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-green-900 dark:text-green-100 block">ORCID</span>
                                    <span className="text-[10px] font-mono text-green-700 dark:text-green-300">{identifiers.orcid}</span>
                                  </div>
                                </div>
                                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                              </div>
                            )}
                            {identifiers.musicbrainzArtist && (
                              <a 
                                href={`https://musicbrainz.org/artist/${identifiers.musicbrainzArtist}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 bg-[#EB743B]/5 dark:bg-[#EB743B]/10 border border-[#EB743B]/20 dark:border-[#EB743B]/20 rounded-lg group hover:bg-[#EB743B]/10 dark:hover:bg-[#EB743B]/20 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 flex items-center justify-center">
                                    <ImageWithFallback 
                                      src="https://upload.wikimedia.org/wikipedia/commons/2/24/MusicBrainz_Logo_Icon.svg"
                                      alt="MusicBrainz"
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-[#EB743B] dark:text-[#F59E74] block">MusicBrainz (Artist)</span>
                                    <span className="text-[10px] font-mono text-[#EB743B]/80 dark:text-[#F59E74]/80 group-hover:underline decoration-[#EB743B]/50">{identifiers.musicbrainzArtist.slice(-12)}</span>
                                  </div>
                                </div>
                              </a>
                            )}
                            {identifiers.musicbrainzLabel && (
                              <div className="flex items-center justify-between p-2.5 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-lg group hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <span className="text-[10px] font-bold">MB</span>
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-purple-900 dark:text-purple-100 block">MusicBrainz (Label)</span>
                                    <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300">{identifiers.musicbrainzLabel}</span>
                                  </div>
                                </div>
                                <CheckCircle className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                              </div>
                            )}
                            {identifiers.wikidataQID && (
                              <a 
                                href={`https://www.wikidata.org/wiki/${identifiers.wikidataQID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-lg group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 flex items-center justify-center">
                                    <Barcode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-blue-900 dark:text-blue-100 block">Wikidata</span>
                                    <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 group-hover:underline decoration-blue-500/50">{identifiers.wikidataQID}</span>
                                  </div>
                                </div>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                      {/* Share Menu (Moved from top) */}
                      <div className="mb-4 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="px-4 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl outline-none"
                              title="Share Profile"
                            >
                              <Share2 className="w-4 h-4 text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors" />
                              <MoreHorizontal className="w-5 h-5 text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            side="right" 
                            align="start" 
                            className="w-72 p-0 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
                          >
                              <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm">
                                <p className="text-xs font-medium text-gray-500 dark:text-[#98A2B3] uppercase tracking-wider">Share Profile</p>
                              </div>
                              
                              <div className="p-2 max-h-[480px] overflow-y-auto custom-scrollbar space-y-1">
                                {/* X (formerly Twitter) */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const shareUrl = `https://graphlynk.com/${username}`;
                                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${name}'s profile on GraphLynk`)}`);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black group-hover:scale-110 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">Share on X</span>
                                </DropdownMenuItem>

                                {/* Instagram */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    alert('To share to Instagram Stories:\n1. Screenshot this profile\n2. Open Instagram\n3. Create a new Story\n4. Add your screenshot');
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white group-hover:scale-110 transition-transform">
                                    <Instagram className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">Instagram Stories</span>
                                </DropdownMenuItem>

                                {/* TikTok */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    alert('To share to TikTok:\n1. Screenshot this profile\n2. Open TikTok\n3. Create a new video/story\n4. Add your screenshot');
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black group-hover:scale-110 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">TikTok Stories</span>
                                </DropdownMenuItem>

                                {/* WhatsApp */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const shareUrl = `https://graphlynk.com/${username}`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${name}'s profile on GraphLynk: ${shareUrl}`)}`);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#25D366] text-white group-hover:scale-110 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">WhatsApp</span>
                                </DropdownMenuItem>

                                {/* Facebook */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const shareUrl = `https://graphlynk.com/${username}`;
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white group-hover:scale-110 transition-transform">
                                    <Facebook className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">Facebook</span>
                                </DropdownMenuItem>

                                {/* LinkedIn */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const shareUrl = `https://graphlynk.com/${username}`;
                                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0077B5] text-white group-hover:scale-110 transition-transform">
                                    <Linkedin className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">LinkedIn</span>
                                </DropdownMenuItem>

                                {/* Reddit */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const shareUrl = `https://graphlynk.com/${username}`;
                                    window.open(`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`Check out ${name}'s GraphLynk profile`)}`);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FF4500] text-white group-hover:scale-110 transition-transform">
                                    <Radio className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">Reddit</span>
                                </DropdownMenuItem>

                                {/* Pinterest */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const shareUrl = `https://graphlynk.com/${username}`;
                                    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(`${name}'s GraphLynk profile`)}`);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E60023] text-white group-hover:scale-110 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">Pinterest</span>
                                </DropdownMenuItem>

                                <div className="my-1 border-t border-gray-200 dark:border-white/10"></div>

                                {/* Copy Link */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const shareUrl = `https://graphlynk.com/${username}`;
                                    navigator.clipboard.writeText(shareUrl);
                                    alert('Profile link copied to clipboard!');
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white group-hover:scale-110 transition-transform">
                                    <LinkIcon className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">Copy Link</span>
                                </DropdownMenuItem>

                                {/* Email */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const shareUrl = `https://graphlynk.com/${username}`;
                                    window.location.href = `mailto:?subject=${encodeURIComponent(`Check out ${name}'s GraphLynk profile`)}&body=${encodeURIComponent(`I thought you might be interested in this profile: ${shareUrl}`)}`;
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white group-hover:scale-110 transition-transform">
                                    <Mail className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">Email</span>
                                </DropdownMenuItem>

                                {/* Embed */}
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const embedCode = `<iframe src="https://graphlynk.com/embed/${username}" width="400" height="600" frameborder="0" scrolling="auto" style="border: 1px solid #e5e7eb; border-radius: 16px;"></iframe>`;
                                    navigator.clipboard.writeText(embedCode);
                                    alert('Embed code copied to clipboard!');
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#6EE7F5]/10 dark:hover:bg-[#6EE7F5]/10 transition-all duration-200 group cursor-pointer outline-none focus:bg-[#6EE7F5]/10 dark:focus:bg-[#6EE7F5]/10"
                                >
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white group-hover:scale-110 transition-transform">
                                    <Code className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-[#E6E9EE] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]">Embed</span>
                                </DropdownMenuItem>
                              </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Name and Username */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-gray-900 dark:text-white">
                            {name}
                          </h2>
                          {isVerified && (
                            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-500 fill-blue-100 dark:fill-blue-900/30" />
                          )}
                        </div>
                        <p className="text-sm font-bold text-[#0b3d84] dark:text-[#9FF2FF]">@{username}</p>
                        {getLocationDisplay() && (
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getLocationDisplay())}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-[#98A2B3] text-sm mt-1 hover:text-[#0b3d84] dark:hover:text-[#6EE7F5] transition-colors block"
                            title="View on Google Maps"
                          >
                            {getLocationDisplay()}
                          </a>
                        )}
                      </div>

                      <div className="mb-6">
                        <h4 className="text-xs text-gray-500 dark:text-[#98A2B3] mb-2">BIOGRAPHY</h4>
                        <p className="text-sm text-gray-700 dark:text-[#E6E9EE] leading-relaxed">
                          {bio}
                        </p>
                      </div>

                      {/* Profile Links */}
                      <div>
                        <h4 className="text-xs text-gray-500 dark:text-[#98A2B3] mb-3">PROFILES</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {links.map((link) => {
                            const Icon = getIconComponent(link.type);
                            const displayDomain = extractDomain(link.url);
                            return (
                              <a
                                key={link.id}
                                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#12161A] rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all group border border-gray-200 dark:border-white/10 cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-lg flex items-center justify-center shadow-sm">
                                    <Icon className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-900 dark:text-white">{link.label}</p>
                                    <p className="text-xs text-gray-500 dark:text-[#98A2B3]">{displayDomain}</p>
                                  </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors" />
                              </a>
                            );
                          })}
                        </div>
                      </div>



                      {/* Blog Section */}
                      {blogPosts.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
                          <div className="flex items-center justify-between mb-4">
                             <h4 className="text-xs text-gray-500 dark:text-[#98A2B3] uppercase tracking-wider flex items-center gap-2">
                               <LayoutGrid className="w-4 h-4" /> Latest from the Blog
                             </h4>
                             <div className="flex gap-2">
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setPreviewIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
                                 }}
                                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-[#98A2B3] transition-colors"
                                 title="Previous Post"
                               >
                                 <ChevronLeft className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setPreviewIndex((prev) => (prev + 1) % blogPosts.length);
                                 }}
                                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-[#98A2B3] transition-colors"
                                 title="Next Post"
                               >
                                 <ChevronRight className="w-4 h-4" />
                               </button>
                             </div>
                          </div>
                          
                          {/* Carousel Card */}
                          {(() => {
                             const post = blogPosts[previewIndex] || blogPosts[0];
                             if (!post) return null;
                             
                             return (
                               <div 
                                 onClick={() => {
                                    setCurrentSlideIndex(previewIndex);
                                    setShowSlideshow(true);
                                 }}
                                 className="group relative aspect-[2/1] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all"
                               >
                                 <img 
                                   key={post.id}
                                   src={post.coverImage} 
                                   alt={post.title} 
                                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                                    {post.isPinned && (
                                      <div className="absolute top-4 right-4 bg-[#0b3d84] text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                                        <Pin className="w-3 h-3 fill-current" /> Pinned
                                      </div>
                                    )}
                                    
                                    <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                      <div className="flex items-center gap-2 text-xs opacity-80 mb-2">
                                         <Calendar className="w-3 h-3" />
                                         {post.date}
                                         <span className="w-1 h-1 rounded-full bg-white/50 mx-1" />
                                         <span className="text-[#6EE7F5]">Read Story</span>
                                      </div>
                                      <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-[#6EE7F5] transition-colors">{post.title}</h3>
                                      <p className="text-sm text-gray-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{post.excerpt}</p>
                                    </div>
                                 </div>
                               </div>
                             );
                          })()}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Knowledge Graph Metrics */}
                  <div className="pt-8 border-t border-gray-200 dark:border-white/10">
                    <h4 className="text-xs text-gray-500 dark:text-[#98A2B3] mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      KNOWLEDGE GRAPH METRICS
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-[#12161A] rounded-xl">
                        {metrics.claimed ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        ) : (
                          <div className="w-6 h-6 mx-auto mb-2" />
                        )}
                        <p className="text-xs text-gray-500 dark:text-[#98A2B3]">Claimed</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-[#12161A] rounded-xl">
                        <p className="text-2xl text-gray-900 dark:text-white mb-1">{metrics.mentions}</p>
                        <p className="text-xs text-gray-500 dark:text-[#98A2B3]">Mentions</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-[#12161A] rounded-xl">
                        <p className="text-2xl text-gray-900 dark:text-white mb-1">{metrics.accuracy}%</p>
                        <p className="text-xs text-gray-500 dark:text-[#98A2B3]">Accuracy</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-[#12161A] rounded-xl">
                        <p className="text-2xl text-gray-900 dark:text-white mb-1">{metrics.lastCrawl}</p>
                        <p className="text-xs text-gray-500 dark:text-[#98A2B3]">Last Crawl</p>
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-400 dark:text-[#98A2B3] mt-4">
                      Schema markup active and validated by <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="text-[#0b3d84] dark:text-[#6EE7F5] hover:underline">Google</a>
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 dark:bg-[#12161A] border-t border-gray-200 dark:border-white/10">
                  <p className="text-xs text-center text-gray-500 dark:text-[#98A2B3]">
                    Powered by <span className="text-[#0b3d84] dark:text-[#6EE7F5]">Graphlynk</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compose Request Modal - Temporarily disabled */}
      {/* {showComposeRequest && (
        <ComposeRequest
          tier={tier}
          onClose={() => setShowComposeRequest(false)}
          sentToday={0}
          sendLimit={tier === 'free' ? 3 : tier === 'premium' ? 10 : 25}
        />
      )} */}

      {/* Blog Slideshow Modal */}
      <BlogSlideshowModal
        isOpen={showSlideshow}
        onClose={() => setShowSlideshow(false)}
        posts={blogPosts}
        startIndex={currentSlideIndex}
        onIndexChange={setCurrentSlideIndex}
      />
    </div>
  );
}
