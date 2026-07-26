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
    items: [
      {
        id: 'intro-booklet-en',
        title: 'Introduction to Sahaja Yoga (English)',
        url: 'https://sahajaresources.com/materials/Booklet%20-%20Introduction%20(English).pdf',
        type: 'pdf',
        fileSize: '463 KB',
      },
      {
        id: 'guide-to-chakras',
        title: 'Guide to Chakras — Light Version',
        description: 'A visual guide to the subtle energy system',
        url: 'https://sahajaresources.com/materials/english_-_guide_to_chakras_-_light_version.pdf',
        type: 'pdf',
        fileSize: '2 MB',
      },
      {
        id: 'stress-management',
        title: 'Introduction to Stress Management through Sahaja Yoga',
        url: 'https://drive.google.com/drive/u/1/folders/1iUoBeFa6D9xUN2brrd7VKABF0bSyxaXE',
        type: 'drive-folder',
        fileSize: '83.9 MB',
      },
      {
        id: 'sahaj-mft',
        title: 'Sahaja Yoga Meditation — MFT',
        url: 'https://sahajaresources.com/materials/Sahaja%20Yoga%20Meditation%20-%20MFT.pdf',
        type: 'pdf',
        fileSize: '553 KB',
      },
      {
        id: 'sufi-meditation',
        title: 'Introduction Sufi Meditation — Know Thyself',
        url: 'https://sahajaresources.com/materials/Introduction%20Sufi%20Meditation%20technique%20to%20know%20thyself.pdf',
        type: 'pdf',
        fileSize: '35.9 MB',
      },
    ],
  },
  {
    id: 'books',
    title: 'Books',
    subtitle: 'In-depth spiritual literature',
    icon: 'library-outline',
    items: [
      {
        id: 'book-10-primordial',
        title: '10 Primordial Masters — Rafael Sol',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '11.6 MB',
      },
      {
        id: 'book-shri-mataji',
        title: 'H. H. Shri Mataji Nirmala Devi',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '2.5 MB',
      },
      {
        id: 'book-advent',
        title: 'The Advent — G. De Kalbermatten',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '1.2 MB',
      },
      {
        id: 'book-devi-mahatmyam',
        title: 'Devi Mahatmyam',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '50.3 MB',
      },
      {
        id: 'book-nirmal-dhyana',
        title: 'Nirmal Dhyana — Book 1',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '37.9 MB',
      },
      {
        id: 'book-anahat-deep',
        title: 'Anahat Deep',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '5 MB',
      },
    ],
  },
  {
    id: 'pamphlets-posters',
    title: 'Pamphlets & Posters',
    subtitle: 'Ready-to-print designs for public programs',
    icon: 'megaphone-outline',
    items: [
      {
        id: 'advert-business-cards',
        title: 'Business Card Designs',
        description: 'Printable business cards for distribution',
        url: 'https://sahajaresources.com/adverts',
        type: 'link',
      },
      {
        id: 'advert-posters',
        title: 'Poster Templates',
        description: 'Standard poster designs for public programs',
        url: 'https://sahajaresources.com/adverts',
        type: 'link',
      },
      {
        id: 'advert-brochures',
        title: 'Brochure Designs',
        description: 'Tri-fold brochure templates',
        url: 'https://sahajaresources.com/adverts',
        type: 'link',
      },
      {
        id: 'school-propagation',
        title: 'School Propagation Materials',
        url: 'https://drive.google.com/drive/u/1/folders/1iUoBeFa6D9xUN2brrd7VKABF0bSyxaXE',
        type: 'drive-folder',
      },
      {
        id: 'sy-public-program',
        title: 'SY Public Program Kit',
        url: 'https://drive.google.com/drive/u/1/folders/1iUoBeFa6D9xUN2brrd7VKABF0bSyxaXE',
        type: 'drive-folder',
      },
    ],
  },
  {
    id: 'realization-videos',
    title: 'Realization Videos',
    subtitle: "Shri Mataji's videos to share with seekers",
    icon: 'videocam-outline',
    items: [
      {
        id: 'video-realization',
        title: 'Shri Mataji — Self Realization Talk',
        description: 'Classic introduction to Sahaja Yoga by Shri Mataji',
        url: 'https://www.youtube.com/results?search_query=shri+mataji+nirmala+devi+self+realization',
        type: 'video',
      },
      {
        id: 'video-navaratri',
        title: 'Navaratri Talks by Shri Mataji',
        url: 'https://www.youtube.com/results?search_query=shri+mataji+navaratri+talk',
        type: 'video',
      },
      {
        id: 'video-shri-mataji-talks',
        title: 'Shri Mataji — Full Speech Collection',
        url: 'https://www.youtube.com/results?search_query=shri+mataji+nirmala+devi+speech',
        type: 'video',
      },
      {
        id: 'video-kundalini',
        title: 'Kundalini Awakening — Guided Session',
        url: 'https://www.youtube.com/results?search_query=kundalini+awakening+sahaja+yoga+guided',
        type: 'video',
      },
    ],
  },
  {
    id: 'designs-logos',
    title: 'Standard Designs & Logos',
    subtitle: 'Brand assets for yogis and centers',
    icon: 'color-palette-outline',
    items: [
      {
        id: 'design-shri-mataji-photos',
        title: 'Shri Mataji Photo Collection',
        description: 'High-resolution photos for banners and posters',
        url: 'https://sahajaresources.com/images',
        type: 'link',
      },
      {
        id: 'design-logos',
        title: 'Sahaja Yoga Logos',
        description: 'Official logos in multiple formats',
        url: 'https://sahajaresources.com/images',
        type: 'link',
      },
      {
        id: 'design-stock-photos',
        title: 'Stock Photo Collection',
        description: 'Meditation and nature photos for materials',
        url: 'https://sahajaresources.com/images',
        type: 'link',
      },
      {
        id: 'design-themed',
        title: 'Themed Design Sets',
        description: 'Coordinated design systems for events',
        url: 'https://sahajaresources.com/themes',
        type: 'link',
      },
    ],
  },
  {
    id: 'research',
    title: 'Research Papers',
    subtitle: 'Scientific studies on Sahaja Yoga',
    icon: 'flask-outline',
    items: [
      {
        id: 'research-papers',
        title: 'Scientific Research Collection',
        description: 'Published papers on the impact of Sahaja Yoga meditation',
        url: 'https://sahajaresources.com/documents',
        type: 'link',
      },
      {
        id: 'research-treatments',
        title: '1008 Treatments — Sahaja Yoga',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '18.8 MB',
      },
      {
        id: 'research-diseases',
        title: 'Diseases & Remedies — Sahasrara Day 2022',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '35.2 MB',
      },
    ],
  },
  {
    id: 'children-materials',
    title: "Children's Materials",
    subtitle: 'Coloring books, stories & activities',
    icon: 'happy-outline',
    items: [
      {
        id: 'children-coloring',
        title: "Sahaj Children's Colouring Book 3",
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '28.8 MB',
      },
      {
        id: 'children-bedtime-stories',
        title: 'Bedtime Stories — Version 6',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '4.7 MB',
      },
      {
        id: 'children-drawing',
        title: 'Drawing Book 1',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '13.9 MB',
      },
    ],
  },
  {
    id: 'puja-protocol',
    title: 'Puja & Protocol',
    subtitle: 'Guides for pujas and rituals',
    icon: 'flower-outline',
    items: [
      {
        id: 'puja-booklet',
        title: 'Puja Booklet 2014',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '1.1 MB',
      },
      {
        id: 'puja-protocol-doc',
        title: 'Sahaja Yoga Puja Protocol',
        url: 'https://sahajaresources.com/materials/Sahaja%20Yoga%20Puja%20Protocol.pdf',
        type: 'pdf',
        fileSize: '95 KB',
      },
      {
        id: 'prayer-book',
        title: 'Prayer Book — Aruba',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '2 MB',
      },
      {
        id: 'mantra-book',
        title: 'Mantra Book v8.2',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '6.3 MB',
      },
    ],
  },
  {
    id: 'yogi-guides',
    title: 'Guides for Yogis',
    subtitle: 'How to organize, advertise & run programs',
    icon: 'compass-outline',
    items: [
      {
        id: 'guide-facebook-ads',
        title: 'Facebook Advertising Guide',
        description: 'How to run effective ad campaigns',
        url: 'https://sahajaresources.com/guides',
        type: 'link',
      },
      {
        id: 'guide-12-week-course',
        title: '12-Week Course Guide',
        description: 'Structured introduction course for seekers',
        url: 'https://sahajaresources.com/guides',
        type: 'link',
      },
      {
        id: 'guide-tour-organization',
        title: 'Tour Organization Guide',
        description: 'Hosting public programs and tours',
        url: 'https://sahajaresources.com/guides',
        type: 'link',
      },
      {
        id: 'guide-raising-children',
        title: 'Raising Children in Sahaja Yoga',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '769 KB',
      },
      {
        id: 'guide-marriage',
        title: 'Marriage in Sahaja Yoga — Excerpts',
        url: 'https://drive.google.com/drive/u/1/folders/1ZlNSp8cIklm4HpdTYvru4hWlrL0gBrVb',
        type: 'drive-folder',
        fileSize: '1.1 MB',
      },
    ],
  },
];
