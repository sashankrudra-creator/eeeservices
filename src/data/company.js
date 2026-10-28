export const company = {
  name: 'Triple E Services',
  tagline: 'Energy | Execution | Efficiency',
  website: 'www.eeeservices.in',
  emails: ['info@eeeservices.in', 'eeeservices2007@gmail.com'],
  offices: [
    {
      id: 'registered',
      title: 'Registered Office',
      lines: ['H No. 268, KK Complex,', 'Ranastalam, Srikakulam,', 'Andhra Pradesh – 532407'],
      phones: ['9494694787', '9866415101'],
      mapQuery: 'Ranastalam, Srikakulam, Andhra Pradesh 532407',
      city: 'Srikakulam',
    },
    {
      id: 'admin',
      title: 'Administrative Office',
      lines: ['D No 8-27-3/B, Sainagar,', 'Thotapalem, Vizianagaram –', '535001'],
      phones: ['9494694787', '8886820568'],
      mapQuery: 'Thotapalem, Vizianagaram, Andhra Pradesh 535001',
      city: 'Vizianagaram',
    },
  ],
  licences: [
    {
      id: 'ibr',
      title: 'Special Class IBR Licence',
      text: 'Special Class IBR License/Certificate issued by Rajasthan and endorsed by AP state for boiler operations and high-pressure steam works.',
      image: '/images/licence-ibr-rajasthan.jpg',
      badges: ['Special Class', 'AP Endorsed'],
    },
    {
      id: 'electrical',
      title: 'Electrical "A" Grade Licence',
      text: 'Electrical "A" Grade License certificate issued by Rajasthan and endorsed by AP state (All Voltages, EHT / HT / LT installations).',
      image: '/images/licence-electrical-a-grade.jpg',
      badges: ["'A' Grade", 'All Voltages', 'AP Endorsed'],
    },
    {
      id: 'iso',
      title: 'ISO Integrated Management Systems',
      text: 'ISO 9001:2015 (QMS), ISO 14001:2015 (EMS) & ISO 45001:2018 (OHSMS) Certified Systems for Quality, Environmental, and Occupational Safety compliance.',
      image: '/images/iso-9001-2015.jpg',
      badges: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018'],
    },
  ],
};

export const certificates = [
  {
    id: 'lic-ibr',
    src: '/images/licence-ibr-rajasthan.jpg',
    caption: 'Special Class IBR Licence (Rajasthan)',
    category: 'Statutory Licences',
  },
  {
    id: 'lic-electrical',
    src: '/images/licence-electrical-a-grade.jpg',
    caption: 'Electrical "A" Grade Licence (Rajasthan)',
    category: 'Statutory Licences',
  },
  {
    id: 'lic-ap-ibr',
    src: '/images/licence-ap-endorsement-1.jpg',
    caption: 'AP Endorsement — IBR Recognition',
    category: 'Statutory Licences',
  },
  {
    id: 'lic-ap-electrical',
    src: '/images/licence-ap-endorsement-2.jpg',
    caption: 'AP Endorsement — Electrical Licence',
    category: 'Statutory Licences',
  },
  {
    id: 'iso-9001',
    src: '/images/iso-9001-2015.jpg',
    caption: 'ISO 9001:2015 — Quality Management System (QMS)',
    category: 'ISO Certifications',
  },
  {
    id: 'iso-14001',
    src: '/images/iso-14001-2015.jpg',
    caption: 'ISO 14001:2015 — Environmental Management System (EMS)',
    category: 'ISO Certifications',
  },
  {
    id: 'iso-45001',
    src: '/images/iso-45001-2018.jpg',
    caption: 'ISO 45001:2018 — Occupational Health & Safety (OHSMS)',
    category: 'ISO Certifications',
  },
];

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services', mega: true },
  { to: '/operations-maintenance', label: 'O&M' },
  { to: '/resources', label: 'Resources' },
  { to: '/projects', label: 'Projects' },
  { to: '/manpower', label: 'Manpower' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/clients', label: 'Clients' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export const stats = [
  { value: 20, suffix: '+', label: 'Years Founder Experience' },
  { value: 135, suffix: ' MW', label: 'Plant O&M' },
  { value: 1343, suffix: '', label: 'Total Manpower' },
  { value: 6, suffix: '', label: 'States' },
  { value: 800, suffix: '+', label: 'O&M Workforce' },
  { value: 1300, suffix: '+', label: 'Electrical Workforce' },
  { value: 24, suffix: '+', label: 'Active / Recent O&M Contracts' },
];

export const heroWords = ['Reliable', 'Efficient', 'Safe'];

export const oneStop = {
  quote:
    'A one-stop shop is a wonderful idea for clients. We can be a single specialised agency in all aspects.',
  verticals: [
    {
      icon: 'Sun',
      title: 'Solar Plants & Power Plants',
      text: 'EPC and O&M for solar plants and power plants, from erection and commissioning to long-term operations.',
    },
    {
      icon: 'Flame',
      title: 'Boiler O&M',
      text: 'Operation and maintenance of CFBC / AFBC / PF boilers, auxiliaries, pressure parts and shutdown activities.',
    },
  ],
};

export const timeline = [
  { year: '2010', text: 'E&I project works begin at Sarda Metals & Alloys.' },
  { year: '2012', text: 'Substation O&M at Trimex Sands and E&I works at Nagarjuna Group begin.' },
  { year: '2015', text: 'Utility O&M services start at SMS Pharma.' },
  { year: '2016', text: 'Erection & commissioning of an AFBC boiler at Veda Bio Fuel.' },
  { year: '2018', text: '1x135 MW power plant O&M (VSLP), 400 kV JSW-MPCL line O&M and Dr. Reddy\'s plant O&M begin.' },
  { year: '2019', text: '600–700 gang resources mobilised for revamp and restoration; 135 MW generator repair work.' },
  { year: '2021', text: 'Bokaro Power Supply Company (Central Govt) E&I O&M and Visakha Dairy solar O&M begin.' },
  { year: '2022', text: '220 kV substation works and 36 MVA submerged furnace works at Sarda Metals.' },
  { year: '2025', text: 'Thermax-partnered power & distillery O&M across Odisha, Telangana and Tamil Nadu.' },
];

export const faqs = [
  {
    q: 'Which regions do you serve?',
    a: 'We have manpower and active sites across Andhra Pradesh, Telangana, Jharkhand, Rajasthan, Tamil Nadu and Chhattisgarh, with workshops across the country.',
  },
  {
    q: 'What licences and certifications do you hold?',
    a: 'We hold a Special Class IBR licence and an Electrical "A" Grade licence (both issued by Rajasthan and endorsed by AP state), alongside ISO 9001:2015 (QMS), ISO 14001:2015 (EMS), and ISO 45001:2018 (OHSMS) certified management systems.',
  },
  {
    q: 'Can you mobilise large teams quickly?',
    a: 'Yes. About 1,003 people are on permanent rolls, and additional manpower is tied up within each state so we can meet requirements in the shortest time. In 2019 we mobilised 600–700 resources in a single instance for revamp and restoration work.',
  },
  {
    q: 'What O&M contract models do you offer?',
    a: 'Comprehensive or package basis O&M for thermal, solar, DG and windmill plants, covering BTG, BOP, CHP and ash handling, plus integrated support from preventive maintenance to shutdowns.',
  },
];
