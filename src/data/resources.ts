export type ResourceItemType = 'pdf' | 'video' | 'image' | 'link' | 'drive-folder';

export type ResourceItem = {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: ResourceItemType;
  fileSize?: string;
};

export type ResourceCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  items: ResourceItem[];
};

export const PROPAGATION_CATEGORIES: ResourceCategory[] = [
  {
    id: 'introduction-booklets',
    title: 'Introduction Booklets',
    subtitle: 'Concise guides for new seekers',
    icon: 'book-outline',
    items: [],
  },
  {
    id: 'books',
    title: 'Books',
    subtitle: 'In-depth spiritual literature',
    icon: 'library-outline',
    items: [],
  },
  {
    id: 'pamphlets-posters',
    title: 'Pamphlets & Posters',
    subtitle: 'Ready-to-print designs for public programs',
    icon: 'megaphone-outline',
    items: [],
  },
  {
    id: 'realization-videos',
    title: 'Realization Videos',
    subtitle: "Shri Mataji's videos to share with seekers",
    icon: 'videocam-outline',
    items: [],
  },
  {
    id: 'designs-logos',
    title: 'Standard Designs & Logos',
    subtitle: 'Brand assets for yogis and centers',
    icon: 'color-palette-outline',
    items: [],
  },
  {
    id: 'research',
    title: 'Research Papers',
    subtitle: 'Scientific studies on Sahaja Yoga',
    icon: 'flask-outline',
    items: [],
  },
  {
    id: 'children-materials',
    title: "Children's Materials",
    subtitle: 'Coloring books, stories & activities',
    icon: 'happy-outline',
    items: [],
  },
  {
    id: 'puja-protocol',
    title: 'Puja & Protocol',
    subtitle: 'Guides for pujas and rituals',
    icon: 'flower-outline',
    items: [],
  },
  {
    id: 'yogi-guides',
    title: 'Guides for Yogis',
    subtitle: 'How to organize, advertise & run programs',
    icon: 'compass-outline',
    items: [],
  },
];
