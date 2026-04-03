// NAVIGATION
export const NAV_LINKS = [
  {
    key: 'home',
    label: 'Home',
    href: '/',
  },
  {
    key: 'about',
    label: 'About',
    children: [
      {
        key: 'shri_mataji',
        label: 'Our Founder',
        href: '/shri-mataji',
      },
      {
        key: 'sahaja_yoga',
        label: 'What is Sahaja Yoga?',
        href: '/sahaja-yoga',
      },
      {
        key: 'meditation',
        label: 'Meditation',
        href: '/meditate',
      },
    ],
  },
  {
    key: 'centers',
    label: 'Centers',
    href: '/centers',
  },
  {
    key: 'events',
    label: 'Events',
    href: '/events',
  },
  {
    key: 'programs',
    label: 'Programs',
    children: [
      {
        key: 'corporate',
        label: 'Corporate Wellness Programs',
        href: '/corporate-register',
      },
      {
        key: 'schools',
        label: 'School Meditation Programs',
        href: '/school-programs',
      },
    ],
  },
  {
    key: 'contact',
    label: 'Contact Us',
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
      title: 'Quick Links',
      links: [
        { label: 'Meditation in Hyderabad', path: '/meditation-hyderabad' },
        { label: 'Shri Mataji', path: '/shri-mataji' },
        { label: 'Sahaja Yoga', path: '/sahaja-yoga' },
        // { label: 'Kundalini & Chakras', path: '/' },
        { label: 'Meditation Programs for School', path: '/school-programs' },
        { label: 'Meditation Programs for Corporates', path: '/corporate-register' },
        { label: 'Contact Us', path: '/contact-us' },
      ],
    },
    {
      title: 'For Yogis',
      links: [
        // { label: 'Share Experience', path: '/' },
        { label: 'Centers Near You', path: '/centers' },
        { label: 'My Dashboard', path: '/dashboard' },
        { label: 'Add a seeker', path: '/add-seeker' },
        { label: 'Share your experience', path: '/share-your-experience' },
        { label: 'Volunteer with us', path: '/volunteer' },
        { label: 'Admin Dashboard', path: '/admin/dashboard' },
      ],
    },
  ];
  
  
  export const FOOTER_CONTACT_INFO = {
    title: 'Contact Us',
    links: [
      { label: 'Call Us', value: '+91 898 898 22 00' },
      { label: 'Email', value: 'sahajayogatelangana@gmail.com' },
    ],
  };
  
  export const SOCIALS = {
    title: 'Social',
    links: [
      '/facebook.svg',
      '/instagram.svg',
      '/youtube.svg',
    ],
  };
