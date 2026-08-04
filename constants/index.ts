// NAVIGATION
export const NAV_LINKS = [
  {
    key: 'home',
    href: '/',
  },
  {
    key: 'about',
    children: [
      {
        key: 'shri_mataji',
        href: '/shri-mataji',
      },
      {
        key: 'sahaja_yoga',
        href: '/sahaja-yoga',
      },
      {
        key: 'meditation',
        href: '/meditate',
      },
    ],
  },
  {
    key: 'centers',
    href: '/centers',
  },
  {
    key: 'events',
    href: '/events',
  },
  {
    key: 'programs',
    children: [
      {
        key: 'corporate',
        href: '/corporate-register',
      },
      {
        key: 'schools',
        href: '/school-programs',
      },
    ],
  },
  {
    key: 'contact',
    href: '/contact-us',
  },
];

  
  // CAMP SECTION
  export const PEOPLE_URL = [
    '/person-1.png',
    '/person-2.png',
    '/person-3.png',
    '/person-4.png',
  ];
  
  // FEATURES SECTION
  export const FEATURES = [
    {
      title: 'It is Always Free',
      icon: '/free1.svg',
      variant: 'green',
      description:
        'In Sahaja Yoga, we have no enrollment, you cannot pay for it. It is the right of every human being, to get self-realization. One can\'t pay money for a living process such as sprouting seed to the Mother Earth.',
    },
    {
      title: 'It is Transformational',
      icon: '/smile.svg',
      variant: 'green',
      description:
        'Sahaja Yoga begins with an experience that is effortless, and spontaneous. With this very first experience (known as Self-Realization) you gain a new dimension in your awareness and witness the absolute truth. Anybody can do it.',
    },
    {
      title: 'Everyone Needs Meditation',
      icon: '/heart.svg',
      variant: 'green',
      description:
        "Today all of humanity is shaken up and going through unprecedented times. Taking care of personal health has never been so crucial. Meditating every day is the key to unlocking the power within each of us.",
    },
    {
      title: 'Unlock The Benefits Today',
      icon: '/sparkle.svg',
      variant: 'orange',
      description:
        'Once you start meditating regularly, there is a wide range of benefits you can tap into – from stress reduction, strengthening attention span, improving memory, and boosting confidence to attaining higher spiritual awareness – the list goes on.',
    },
  ];
  
  // FOOTER SECTION
  export const FOOTER_LINKS = [
    {
      titleKey: 'footer.quick_links',
      links: [
        { labelKey: 'footer.meditation_hyderabad', path: '/meditation-hyderabad' },
        { labelKey: 'footer.shri_mataji', path: '/shri-mataji' },
        { labelKey: 'footer.sahaja_yoga', path: '/sahaja-yoga' },
        { labelKey: 'footer.school_programs', path: '/school-programs' },
        { labelKey: 'footer.corporate_programs', path: '/corporate-register' },
        { labelKey: 'footer.contact_us', path: '/contact-us' },
        { labelKey: 'Privacy Policy', path: '/privacy-policy' },
        { labelKey: 'Account & Data Deletion', path: '/delete-account' },
      ],
    },
    {
      titleKey: 'footer.for_yogis',
      links: [
        { labelKey: 'footer.centers_near_you', path: '/centers' },
        { labelKey: 'footer.my_dashboard', path: '/dashboard' },
        { labelKey: 'footer.add_seeker', path: '/add-seeker' },
        { labelKey: 'footer.share_experience', path: '/share-your-experience' },
        { labelKey: 'footer.volunteer', path: '/volunteer' },
        { labelKey: 'footer.volunteer_screening', path: '/volunteer-screening' },
        { labelKey: 'footer.admin_dashboard', path: '/admin/dashboard' },
      ],
    },
  ];
  
  
export const FOOTER_CONTACT_INFO = {
  titleKey: 'footer.contact',
  links: [
    { labelKey: 'footer.call_us', value: '+91 898 898 22 00' },
    { labelKey: 'footer.email', value: 'sahajayogatelangana@gmail.com' },
  ],
};

export const JOURNEY_WHATSAPP_BOT_NUMBER = '917989128851';
  
export const SOCIALS = {
  title: 'Social',
  links: [
    { platform: 'facebook', url: 'https://www.facebook.com/sahajayogatelangana/' },
    { platform: 'instagram', url: 'https://www.instagram.com/sahajayogatelangana/' },
    { platform: 'youtube', url: 'https://www.youtube.com/c/SahajaYogaTelangana' },
  ],
};
