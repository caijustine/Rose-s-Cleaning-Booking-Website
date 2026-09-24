// All business facts and page content live here. Edit this file, then run
// `npm run build` to regenerate the site in public/.

export const site = {
  name: "Rose's Cleaning & Janitorial",
  shortName: "Rose's Cleaning",
  url: 'https://roses-cleaning.com',
  phone: '(435) 301-4337',
  phoneE164: '+14353014337',
  email: 'brambilarosie773@gmail.com',
  city: 'St. George',
  region: 'UT',
  regionName: 'Utah',
  county: 'Washington County',
  owners: 'Rose and Maria',
  hours: { label: 'Mon – Sat, 8:00 AM – 6:00 PM', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' },
  ogImage: '/assets/img/og-image.jpg',
};

// Photos (see scripts/optimize-images.sh). w/h are the aspect ratio of the source.
export const photos = {
  kitchen: { src: 'img-0617', w: 4, h: 3, alt: 'Bright, spotless kitchen and dining area in a St. George home' },
  masterBath: { src: 'img-0616', w: 3, h: 4, alt: 'Clean master bathroom with polished counters and mirrors' },
  masterBed: { src: 'img-0615', w: 4, h: 3, alt: 'Freshly cleaned master bedroom with a made bed' },
  suite: { src: 'img-0614', w: 4, h: 3, alt: 'Tidy twin bedroom suite after a cleaning visit' },
  owner: { src: 'owner-rose', w: 4, h: 5, alt: 'Rose, owner of Rose’s Cleaning & Janitorial' },
};

// Before-and-after pairs shown in "Our work" (see scripts/optimize-images.sh).
export const results = [
  { label: 'Sink & vanity', before: 'img-0612', after: 'img-0613' },
  { label: 'Bathtub', before: 'img-0608', after: 'img-0609' },
  { label: 'Toilet', before: 'img-0610', after: 'img-0611' },
];

export const reviews = [
  {
    quote: 'Rose and Maria have been cleaning our home in St. George for over three months, and it feels like a luxury hotel every time we walk in. They use fresh systems, never miss baseboards, and pay attention to detail. Absolute peace of mind.',
    name: 'Sarah H.', detail: 'Residential client, Little Valley', service: 'standard-cleaning', area: 'st-george-ut',
  },
  {
    quote: 'We booked their move-out cleaning service on our previous rental. The kitchen and bathroom fixtures literally sparkled. They helped us secure our full deposit back. Very professional and friendly!',
    name: 'Marcus B.', detail: 'Move-out client, Washington City', service: 'move-in-move-out-cleaning', area: 'washington-ut',
  },
  {
    quote: 'Rose’s team manages our office space janitorial schedule. They arrive on time, keep bathrooms pristine, clean workspaces, and mop floors beautifully. The best cleaning service in St. George.',
    name: 'Emily L.', detail: 'Commercial client, Downtown St. George', service: 'commercial-janitorial', area: 'st-george-ut',
  },
];

export const services = [
  {
    slug: 'standard-cleaning',
    blurb: 'Regular upkeep: dusting, floors, kitchen, and bathrooms.',
    name: 'Standard House Cleaning',
    short: 'Standard Cleaning',
    icon: 'home',
    price: 'From $120',
    priceNote: 'Final price depends on square footage, bedrooms, and bathrooms. Use the estimator for a range.',
    title: 'House Cleaning in St. George, UT | Standard & Recurring Cleaning',
    description: 'Reliable standard house cleaning in St. George, UT from $120. Dusting, floors, kitchens, and sanitized bathrooms by a licensed & insured local family team.',
    headline: 'Standard house cleaning that keeps your home guest-ready',
    summary: 'Regular upkeep for homes that are already in good shape. We handle the dusting, floors, kitchen, and bathrooms so you get your weekends back.',
    intro: [
      'Our standard cleaning is the everyday reset: every room dusted, every floor vacuumed or mopped, kitchens wiped down, and bathrooms fully sanitized. It is the service most of our St. George clients book on a repeating schedule so the house never slides back to “we need to deal with this.”',
      'Because it is Rose and Maria in your home each visit, you are not re-explaining your preferences to a new crew every time. We learn how you like things and keep it that way.',
    ],
    included: [
      'Dusting all accessible surfaces', 'Vacuuming carpets and rugs', 'Sweeping and damp-mopping hard floors',
      'Bathrooms sanitized: tubs, showers, toilets, sinks', 'Kitchen counters and appliance exteriors wiped',
      'Mirrors cleaned and shined', 'Trash removed and liners replaced', 'Bedrooms and common living areas tidied',
    ],
    bestFor: ['Weekly, every-other-week, or monthly upkeep', 'Busy families and working professionals', 'Homes that had a deep clean recently', 'Keeping a vacation or second home fresh between stays'],
    faqs: [
      { q: 'How often should I schedule a standard cleaning?', a: 'Most households choose every week or every other week. Monthly works well for smaller homes or people who tidy in between. Tell us what you have in mind and we will build a schedule around it.' },
      { q: 'What is the difference between standard and deep cleaning?', a: 'Standard cleaning covers the surfaces you see and use every day. Deep cleaning adds the detail work: inside cabinets, baseboards hand-wiped, window sills, blinds, vents, and grout. If your home has not been professionally cleaned in a while, we usually suggest starting with a deep clean.' },
    ],
  },
  {
    slug: 'deep-cleaning',
    blurb: 'Top-to-bottom detail, from baseboards to grout.',
    name: 'Deep Cleaning',
    short: 'Deep Cleaning',
    icon: 'sparkle',
    price: 'From $200',
    priceNote: 'Priced by square footage, bedrooms, and bathrooms. Get a range in the estimator.',
    title: 'Deep Cleaning Services in St. George, UT | Rose’s Cleaning',
    description: 'Top-to-bottom deep cleaning in St. George, UT from $200. Baseboards, cabinets, blinds, vents, grout, and more by a licensed & insured local team.',
    headline: 'Deep cleaning for the corners everyone else skips',
    summary: 'A top-to-bottom detail clean: baseboards, cabinets, blinds, vents, grout, and everything in between.',
    intro: [
      'A deep clean is where we slow down and get into the details that build up over months: the tops of door frames, the inside of cabinets, the grout lines, the vents, and the baseboards that are easy to ignore until you notice them.',
      'It is the right first visit for most new clients, a great seasonal reset, and the service people book before hosting family or putting a home on the market.',
    ],
    included: [
      'Everything in a standard clean', 'Cabinets detailed inside and out', 'Baseboards hand-wiped', 'Interior windows and sills',
      'Appliances detailed (interior options available)', 'Doors, frames, and light switches wiped', 'Blinds, vents, and cobweb removal',
      'Detailed bathroom grout sanitation', 'Laundry area and under accessible furniture',
    ],
    bestFor: ['Your first cleaning with us', 'Spring or seasonal resets', 'Before hosting guests or holidays', 'Getting a home ready to list or show'],
    faqs: [
      { q: 'How long does a deep clean take?', a: 'It depends on the size and condition of the home. We will give you a realistic time frame along with your free estimate so you can plan your day.' },
      { q: 'Should I book a deep clean before starting regular service?', a: 'Usually, yes. A deep clean brings everything up to a baseline, and then standard visits keep it there. It also makes each regular visit faster and more affordable.' },
    ],
  },
  {
    slug: 'move-in-move-out-cleaning',
    blurb: 'Empty-home cleans that help protect your deposit.',
    name: 'Move-In / Move-Out Cleaning',
    short: 'Move-In / Move-Out',
    icon: 'key',
    price: 'Custom quote',
    priceNote: 'Empty-home cleans are quoted per property. Call or text for a same-day quote.',
    title: 'Move-In & Move-Out Cleaning in St. George, UT | Rose’s Cleaning',
    description: 'Move-in and move-out cleaning in St. George & Washington County. Inside ovens, fridges, cabinets, and closets. Help getting your deposit back. Free quotes.',
    headline: 'Move-out cleaning that helps you get your deposit back',
    summary: 'An empty-home detail clean for renters, landlords, buyers, and sellers. Inside every cabinet, appliance, and closet.',
    intro: [
      'Moving is stressful enough without scrubbing an oven at midnight. Our move-in and move-out cleaning covers an empty home from the inside of the refrigerator to the window tracks, so you can hand over the keys, or move your things in, with confidence.',
      'Renters book us to protect their deposit, landlords and property managers book us between tenants, and buyers book us so their first night in a new home starts clean.',
    ],
    included: [
      'Oven and refrigerator interiors deep-cleaned', 'All cabinets and drawers cleaned inside and out', 'Bathrooms fully sanitized and descaled',
      'All flooring scrubbed or vacuumed', 'Baseboards, sills, and window tracks detailed', 'Doors, frames, and light panels hand-washed',
      'Storage rooms and closets detailed', 'Patio and entry thresholds swept',
    ],
    bestFor: ['Renters moving out and protecting a deposit', 'Landlords and property managers between tenants', 'Buyers moving into a new home', 'Sellers preparing for a final walkthrough'],
    faqs: [
      { q: 'Should the home be empty for a move-out clean?', a: 'An empty home lets us reach every cabinet, closet, and floor edge, so that is ideal. If you are still moving things out, let us know and we will plan around it.' },
      { q: 'Do you work with landlords and property managers?', a: 'Yes. We are happy to handle turnovers between tenants. Call or text with the property details and your timeline.' },
    ],
  },
  {
    slug: 'commercial-janitorial',
    blurb: 'Offices and small businesses, on your schedule.',
    name: 'Commercial & Janitorial Cleaning',
    short: 'Commercial & Janitorial',
    icon: 'building',
    price: 'Custom quote',
    priceNote: 'Quoted by space and schedule after a free walkthrough.',
    title: 'Commercial Cleaning & Janitorial Services in St. George, UT',
    description: 'Office and commercial janitorial cleaning in St. George, UT. Restrooms, workspaces, floors, and trash on a schedule that fits your business. Licensed & insured.',
    headline: 'Office and janitorial cleaning on your schedule',
    summary: 'Recurring janitorial service for offices and small businesses: restrooms, workspaces, floors, and trash, on the schedule you need.',
    intro: [
      'A clean workspace is the first thing clients and employees notice. We provide recurring janitorial service for offices and small businesses around St. George, working around your hours so cleaning never gets in the way of work.',
      'You get the same dependable team every visit, a clear checklist, and a single local number to call if anything needs attention.',
    ],
    included: [
      'Office workspaces and desks detailed', 'Restroom sanitization and supply refill', 'Commercial trash and recycling removal',
      'Floor sweeping, mopping, and vacuuming', 'Conference rooms and break areas detailed', 'Custom scheduling: daily, weekly, or as needed',
    ],
    bestFor: ['Professional and medical offices', 'Small businesses and studios', 'Shared workspaces and conference rooms', 'Businesses that need a custom cleaning schedule'],
    faqs: [
      { q: 'Can you work around our business hours?', a: 'We set commercial schedules around each client. Tell us when your space is open and when it is quiet, and we will plan visits that keep it clean without interrupting your day.' },
      { q: 'How is commercial cleaning priced?', a: 'It depends on square footage, the number of restrooms, and how often you need service. We will walk the space with you and give you a free, no-pressure quote.' },
    ],
  },
];

// Service area pages. Each needs genuinely local copy so it is useful to a
// visitor (and not a thin "doorway" page, which Google penalizes).
export const areas = [
  {
    slug: 'st-george-ut',
    name: 'St. George',
    lat: 37.0965, lng: -113.5684,
    title: 'House Cleaning in St. George, UT | Rose’s Cleaning & Janitorial',
    description: 'Local, licensed & insured house cleaning in St. George, UT. Standard, deep, move-out, and office cleaning by Rose & Maria. Free estimates: (435) 301-4337.',
    headline: 'House cleaning in St. George, from neighbors who live here too',
    intro: [
      'St. George is home for us, and it is where most of our clients live. From family homes in Little Valley to condos near Downtown and houses tucked up by the Red Hills, we know the area and plan routes so we show up on time.',
      'Southern Utah living brings its own kind of mess: fine red dust that settles on every ledge, hard water spots on glass and fixtures, and sand that finds its way into every entryway. Our checklists are built around exactly that.',
    ],
    neighborhoods: ['Little Valley', 'Downtown St. George', 'Bloomington', 'Green Valley', 'Sunbrook', 'Entrada & Snow Canyon area', 'Desert Color'],
    localTip: 'Tip for St. George homes: hard water builds up fast here. Regular cleaning keeps shower glass and faucets from getting that cloudy white film that is hard to remove later.',
  },
  {
    slug: 'washington-ut',
    name: 'Washington',
    lat: 37.1305, lng: -113.5083,
    title: 'House Cleaning in Washington, UT | Rose’s Cleaning & Janitorial',
    description: 'House, deep, and move-out cleaning in Washington City, UT. Licensed & insured local family team serving Washington and all of Washington County.',
    headline: 'Trusted house cleaning in Washington City',
    intro: [
      'Washington City has grown fast, and a lot of our clients here are in newer homes, rentals, and move-in situations. We help families settle into new builds, help renters get deposits back, and keep busy households on a steady cleaning schedule.',
      'It is a short drive from St. George, so Washington clients get the same scheduling flexibility and the same two faces at the door every visit.',
    ],
    neighborhoods: ['Green Springs', 'Coral Canyon', 'Washington Fields', 'Sienna Hills', 'Historic downtown Washington'],
    localTip: 'Moving into a new build? Construction dust gets into cabinets, vents, and window tracks. A move-in clean before you unpack saves you from wiping everything twice.',
  },
  {
    slug: 'santa-clara-ut',
    name: 'Santa Clara',
    lat: 37.1330, lng: -113.6541,
    title: 'House Cleaning in Santa Clara, UT | Rose’s Cleaning & Janitorial',
    description: 'Detail-focused house cleaning in Santa Clara, UT. Standard, deep, and move-out cleaning from a licensed & insured St. George family team.',
    headline: 'Careful, detail-focused cleaning for Santa Clara homes',
    intro: [
      'Santa Clara’s quiet streets and larger family homes are a great fit for our detail-first approach. Whether you want a standard clean every other week or a full deep clean before the holidays, we treat your home with the same care we would our own.',
      'Just west of St. George, Santa Clara is right on our regular routes, so booking a time that works for you is easy.',
    ],
    neighborhoods: ['Historic Santa Clara', 'Santa Clara Heights', 'Along Santa Clara Drive'],
    localTip: 'Homes near the open desert collect more fine dust on window sills and blinds. Adding blinds and sills to a deep clean once a season makes a big difference.',
  },
  {
    slug: 'ivins-ut',
    name: 'Ivins',
    lat: 37.1686, lng: -113.6794,
    title: 'House Cleaning in Ivins, UT | Rose’s Cleaning & Janitorial',
    description: 'House cleaning and vacation home upkeep in Ivins, UT, near Kayenta and Snow Canyon. Licensed & insured local cleaners. Free estimates.',
    headline: 'House cleaning in Ivins, near Kayenta and Snow Canyon',
    intro: [
      'Ivins homes, from Kayenta to the neighborhoods around Snow Canyon, often have big windows, open floor plans, and lots of natural stone. We clean them carefully and pay attention to the finishes that make these homes special.',
      'If your Ivins home is a second home, we can keep it fresh between visits so it is ready the moment you arrive.',
    ],
    neighborhoods: ['Kayenta', 'Snow Canyon area', 'Padre Canyon', 'Central Ivins'],
    localTip: 'Part-time resident? A standard clean scheduled just before you arrive means you walk into a fresh home instead of a dusty one.',
  },
  {
    slug: 'hurricane-ut',
    name: 'Hurricane',
    lat: 37.1753, lng: -113.2899,
    title: 'House Cleaning in Hurricane, UT | Rose’s Cleaning & Janitorial',
    description: 'House, deep, and move-in/move-out cleaning in Hurricane, UT. Licensed & insured family cleaning team serving Washington County. Free estimates.',
    headline: 'House cleaning for Hurricane homes and rentals',
    intro: [
      'Hurricane has become one of the fastest-growing towns in Washington County, with new neighborhoods, rentals, and homes near Sand Hollow. We help families keep up with busy schedules and help owners turn over rentals between guests or tenants.',
      'Call or text with your address and the kind of cleaning you need, and we will find a time that fits.',
    ],
    neighborhoods: ['Sky Mountain', 'Sand Hollow area', 'Dixie Springs', 'Central Hurricane'],
    localTip: 'Renting out a home near Sand Hollow? Scheduling a move-out style clean between long-term tenants keeps the property in listing-ready shape.',
  },
];

export const faqs = [
  {
    group: 'Booking & estimates',
    items: [
      { q: 'How do I book a cleaning?', a: 'Call or text Rose or Maria at (435) 301-4337, email us, or send a request through our contact page. We respond the same day, and we will set up a time that works for you.' },
      { q: 'Are estimates really free?', a: 'Yes. Tell us about your home or business and we will give you an honest number upfront, with no pressure and no surprise charges later.' },
      { q: 'What are your hours?', a: 'We clean Monday through Saturday, 8:00 AM to 6:00 PM. Commercial schedules are set with each client.' },
    ],
  },
  {
    group: 'Pricing',
    items: [
      { q: 'How much does house cleaning cost in St. George?', a: 'Our standard cleaning starts at $120 and deep cleaning starts at $200. The final price depends on square footage, bedrooms, bathrooms, and the condition of the home. Try our cleaning cost estimator for an instant range.' },
      { q: 'How are move-out and commercial cleanings priced?', a: 'Both are quoted individually because every property is different. Move-out quotes depend on the size and condition of the empty home; commercial quotes depend on your space and schedule.' },
    ],
  },
  {
    group: 'Our services',
    items: [
      { q: 'What is the difference between a standard and a deep clean?', a: 'A standard clean covers the everyday surfaces: dusting, floors, kitchen, and bathrooms. A deep clean adds detail work like inside cabinets, baseboards, blinds, vents, window sills, and grout.' },
      { q: 'Do you offer recurring cleaning?', a: 'Yes. Most of our residential clients book standard cleaning on a regular schedule, such as weekly, every other week, or monthly. Commercial clients can set a custom schedule.' },
      { q: 'Do you clean offices and businesses?', a: 'Yes. We provide janitorial service for offices and small businesses, including restrooms, workspaces, floors, and trash removal, on a schedule that fits your hours.' },
    ],
  },
  {
    group: 'Trust & safety',
    items: [
      { q: 'Are you licensed and insured?', a: 'Yes. Rose’s Cleaning & Janitorial is a licensed and insured business, so you and your home are protected.' },
      { q: 'Who will be cleaning my home?', a: 'Rose and Maria, the owners. You will not get a rotating crew of strangers. We are a local family business, and we treat every home like our own.' },
    ],
  },
  {
    group: 'Service areas',
    items: [
      { q: 'What areas do you serve?', a: 'We are based in St. George and serve Washington County, including Washington, Santa Clara, Ivins, and Hurricane. Not sure if you are in range? Just ask.' },
    ],
  },
];
