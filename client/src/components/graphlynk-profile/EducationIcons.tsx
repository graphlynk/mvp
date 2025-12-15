// Education Credential Icon System
// 24×24 grid, 1.8px stroke, 2–3px corner radius
// Designed for legibility at 16px with 3:1 contrast

import React from 'react';

// Badge Overlays (8-10px, positioned top-right)
export const VerifiedBadge = () => (
  <div className="absolute -top-1 -right-1 w-[10px] h-[10px] bg-green-500 rounded-full flex items-center justify-center">
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
      <path d="M1 3L2.5 4.5L5 1.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export const HonorsBadge = () => (
  <div className="absolute -top-1 -right-1 w-[10px] h-[10px] bg-yellow-500 rounded-full flex items-center justify-center">
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
      <path d="M3 1L3.5 2.5L5 3L3.5 3.5L3 5L2.5 3.5L1 3L2.5 2.5L3 1Z" fill="white"/>
    </svg>
  </div>
);

export const InProgressBadge = () => (
  <div className="absolute -top-1 -right-1 w-[10px] h-[10px] bg-blue-500 rounded-full flex items-center justify-center">
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
      <path d="M3 1L4 3.5L3 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export const RestrictedBadge = () => (
  <div className="absolute -top-1 -right-1 w-[10px] h-[10px] bg-gray-500 rounded-full flex items-center justify-center">
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
      <rect x="2" y="2.5" width="2" height="2" rx="0.5" fill="white"/>
      <path d="M2.5 2.5V2C2.5 1.5 2.7 1 3 1C3.3 1 3.5 1.5 3.5 2V2.5" stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
    </svg>
  </div>
);

// Certificate/Bootcamp - Rosette (outline)
export const CertificateOutline = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 5L13 8L16 9L13 10L12 13L11 10L8 9L11 8L12 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M12 19L10 22M12 19L14 22M12 19V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const CertificateFilled = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="7" fill="currentColor" fillOpacity="0.15"/>
    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 5L13 8L16 9L13 10L12 13L11 10L8 9L11 8L12 5Z" fill="currentColor"/>
    <path d="M12 19L10 22M12 19L14 22M12 19V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// Associate - Certificate with small laurel sprig
export const AssociateOutline = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M9 12H15M9 15H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M17 6C18 6.5 18.5 7 19 8M17 4C18.5 4.5 19.5 5.5 20 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const AssociateFilled = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="6" y="8" width="12" height="10" rx="2" fill="currentColor" fillOpacity="0.15"/>
    <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M9 12H15M9 15H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M17 6C18 6.5 18.5 7 19 8M17 4C18.5 4.5 19.5 5.5 20 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// Bachelor - Diploma with ribbon
export const BachelorOutline = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="7" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8 11H16M8 14H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M12 18L12 21M10 21L12 19L14 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BachelorFilled = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="7" width="14" height="11" rx="2" fill="currentColor" fillOpacity="0.15"/>
    <rect x="5" y="7" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8 11H16M8 14H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M12 18L12 21M10 21L12 19L14 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Master - Graduation cap
export const MasterOutline = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 5L20 9L12 13L4 9L12 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M7 10.5V14C7 14 9 16 12 16C15 16 17 14 17 14V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 9V14M20 16.5V16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 19.5V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const MasterFilled = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 5L20 9L12 13L4 9L12 5Z" fill="currentColor" fillOpacity="0.15"/>
    <path d="M12 5L20 9L12 13L4 9L12 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M7 10.5V14C7 14 9 16 12 16C15 16 17 14 17 14V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 9V14M20 16.5V16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
    <path d="M12 19.5V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// Doctorate - Cap with laurel wreath
export const DoctorateOutline = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4L19 7.5L12 11L5 7.5L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M7 9V12C7 12 9 13.5 12 13.5C15 13.5 17 12 17 12V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 15C4 15 6 13 8 13M20 15C20 15 18 13 16 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M5 18C5 18 7 16 9 16M19 18C19 18 17 16 15 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M7 21C7 21 9 19.5 11 19.5M17 21C17 21 15 19.5 13 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const DoctorateFilled = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4L19 7.5L12 11L5 7.5L12 4Z" fill="currentColor" fillOpacity="0.15"/>
    <path d="M12 4L19 7.5L12 11L5 7.5L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M7 9V12C7 12 9 13.5 12 13.5C15 13.5 17 12 17 12V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 15C4 15 6 13 8 13M20 15C20 15 18 13 16 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M5 18C5 18 7 16 9 16M19 18C19 18 17 16 15 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M7 21C7 21 9 19.5 11 19.5M17 21C17 21 15 19.5 13 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// Professional License - Shield with check
export const LicenseOutline = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3L19 6V11C19 15.5 16 19 12 21C8 19 5 15.5 5 11V6L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LicenseFilled = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3L19 6V11C19 15.5 16 19 12 21C8 19 5 15.5 5 11V6L12 3Z" fill="currentColor" fillOpacity="0.15"/>
    <path d="M12 3L19 6V11C19 15.5 16 19 12 21C8 19 5 15.5 5 11V6L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Wrapper component with badge support
interface CredentialIconProps {
  level: 'certificate' | 'associate' | 'bachelor' | 'master' | 'doctorate' | 'license';
  variant?: 'outline' | 'filled';
  badge?: 'verified' | 'honors' | 'inProgress' | 'restricted';
  className?: string;
}

export const CredentialIcon = ({ level, variant = 'outline', badge, className = "" }: CredentialIconProps) => {
  const iconMap = {
    certificate: variant === 'filled' ? CertificateFilled : CertificateOutline,
    associate: variant === 'filled' ? AssociateFilled : AssociateOutline,
    bachelor: variant === 'filled' ? BachelorFilled : BachelorOutline,
    master: variant === 'filled' ? MasterFilled : MasterOutline,
    doctorate: variant === 'filled' ? DoctorateFilled : DoctorateOutline,
    license: variant === 'filled' ? LicenseFilled : LicenseOutline,
  };

  const badgeMap = {
    verified: VerifiedBadge,
    honors: HonorsBadge,
    inProgress: InProgressBadge,
    restricted: RestrictedBadge,
  };

  const IconComponent = iconMap[level];
  const BadgeComponent = badge ? badgeMap[badge] : null;

  return (
    <div className="relative inline-block">
      <IconComponent className={className} />
      {BadgeComponent && <BadgeComponent />}
    </div>
  );
};

// JSON Mapping for degree to icon + badge
export const degreeMapping = {
  "High School Diploma": { icon: "certificate", badge: null },
  "Certificate": { icon: "certificate", badge: null },
  "Bootcamp": { icon: "certificate", badge: null },
  "Associate Degree": { icon: "associate", badge: null },
  "Associate of Arts (A.A.)": { icon: "associate", badge: null },
  "Associate of Science (A.S.)": { icon: "associate", badge: null },
  "Bachelor's Degree": { icon: "bachelor", badge: null },
  "Bachelor of Arts (B.A.)": { icon: "bachelor", badge: null },
  "Bachelor of Science (B.S.)": { icon: "bachelor", badge: null },
  "Master's Degree": { icon: "master", badge: null },
  "Master of Arts (M.A.)": { icon: "master", badge: null },
  "Master of Science (M.S.)": { icon: "master", badge: null },
  "MBA": { icon: "master", badge: null },
  "Doctorate": { icon: "doctorate", badge: null },
  "Ph.D.": { icon: "doctorate", badge: null },
  "M.D.": { icon: "doctorate", badge: null },
  "J.D.": { icon: "doctorate", badge: null },
  "Professional License": { icon: "license", badge: "verified" },
  "CPA": { icon: "license", badge: "verified" },
  "PE": { icon: "license", badge: "verified" },
  "Bar License": { icon: "license", badge: "verified" },
};
