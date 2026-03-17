import { OutpostData, BrandSettings, Caption, CompanySlug } from '@/types';
import { setData, isSeeded } from './storage';

function makeCaption(
  companySlug: CompanySlug,
  text: string,
  postType: Caption['postType'],
  tags: string[]
): Caption {
  return {
    id: crypto.randomUUID(),
    companySlug,
    text,
    postType,
    tags,
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const defaultBrandSettings: Record<CompanySlug, BrandSettings> = {
  'flynn-development': {
    companySlug: 'flynn-development',
    name: 'Flynn Development / Modern Development Co.',
    phone: '931-510-6147',
    website: 'moderndevelopment.co',
    services: 'Custom homes, barndominiums, renovations and additions, commercial construction',
    targetAudience: 'Homeowners and families in Middle Tennessee planning to build or renovate',
    geoFocus: 'Upper Cumberland, Middle Tennessee, Cookeville, the 931',
    tone: 'Confident, process-forward, community rooted, warm but never soft, premium without arrogance',
    hardRules: [
      'No em dashes or hyphens mid sentence',
      'No two word or fragmented sentences',
      'Full flowing sentences with natural rhythm',
      'Never use the phrase "coming to life"',
      'Never toot your own horn or claim to be the best — let the work speak',
      'No contractor clichés',
      'No desperation language',
      'No discount language',
      'Never say "we take that seriously" or "we don\'t take that lightly"',
      'Never say "transformative," "innovative," "cutting-edge," or "game-changing"',
      'Do not write emotionally manipulative or cheesy copy',
      'Two solid paragraphs is the ideal post structure',
      'Confident but never arrogant',
    ],
    bannedPhrases: [
      'coming to life',
      'we take that seriously',
      'we don\'t take that lightly',
      'transformative',
      'innovative',
      'cutting-edge',
      'game-changing',
    ],
    ctaStyle: 'Soft and inviting. Never pushy. Always end with the phone number and website.',
    exampleCaptions: [],
    updatedAt: new Date().toISOString(),
  },
  'middle-tn-metals': {
    companySlug: 'middle-tn-metals',
    name: 'Middle TN Metals',
    phone: '931-510-6147',
    website: 'moderndevelopment.co',
    services: 'Barndominium design and construction exclusively',
    targetAudience: 'Families in Middle Tennessee planning to build a barndominium',
    geoFocus: 'Upper Cumberland, Middle Tennessee, Cookeville, the 931',
    tone: 'Identical to Flynn Development — confident, process-forward, community rooted, premium without arrogance',
    hardRules: [
      'All the same rules as Flynn Development apply exactly',
      'Barndominium focused exclusively',
      'No em dashes or hyphens mid sentence',
      'No two word or fragmented sentences',
      'Full flowing sentences with natural rhythm',
      'Never use the phrase "coming to life"',
      'No contractor clichés',
      'No desperation or discount language',
      'Confident but never arrogant',
    ],
    bannedPhrases: [
      'coming to life',
      'we take that seriously',
      'we don\'t take that lightly',
      'transformative',
      'innovative',
      'cutting-edge',
      'game-changing',
    ],
    ctaStyle: 'Soft and inviting. Never pushy. Always end with phone number.',
    exampleCaptions: [],
    updatedAt: new Date().toISOString(),
  },
  'modern-roofing-group': {
    companySlug: 'modern-roofing-group',
    name: 'Modern Roofing Group',
    phone: '931-400-8788',
    website: '',
    services: 'Residential, commercial, and industrial roofing across Middle Tennessee',
    targetAudience: 'Homeowners, commercial property owners, and industrial facility managers',
    geoFocus: 'Middle Tennessee, Upper Cumberland',
    tone: 'Measured and grounded. Process-forward. Short punchy paragraphs. Roofing at scale. Same DNA as Modern Development but applied entirely to roofing. Never residential-only in positioning.',
    hardRules: [
      'Same core rules as Modern Development',
      'No contractor clichés',
      'No discount language',
      'Roofing only — never references other trades',
      'Key sales reps to spotlight when relevant: Derick Bryant, Justin Buchanan, Connor Buis, Grant',
      'Never position as residential-only — always speak to the full scale',
    ],
    bannedPhrases: [
      'coming to life',
      'we take that seriously',
      'transformative',
      'innovative',
      'cutting-edge',
      'game-changing',
    ],
    ctaStyle: 'Soft CTAs. Never pushy. Always end with 931-400-8788.',
    exampleCaptions: [],
    updatedAt: new Date().toISOString(),
  },
  'complete-crete-coatings': {
    companySlug: 'complete-crete-coatings',
    name: 'Complete Crete Coatings',
    phone: '',
    website: '',
    services: 'Full floor coating systems — epoxy, polyaspartic, Spartacote, UV stable products, garage flake broadcast systems, stain and seal, pool decks, commercial and industrial floor systems',
    targetAudience: 'Homeowners, commercial property owners, and facility managers looking to upgrade or protect their floors',
    geoFocus: 'Middle Tennessee, Upper Cumberland',
    tone: 'Same voice family as Modern Development. Confident, process-forward, clean. Speaks entirely about floor systems and coatings. Educates without being condescending. Lets the finished product speak.',
    hardRules: [
      'Same core rules as Modern Development apply',
      'Floor systems only',
      'No generic home improvement language',
      'Educate without being condescending',
      'Let the finished product speak for itself',
    ],
    bannedPhrases: [
      'coming to life',
      'we take that seriously',
      'transformative',
      'innovative',
      'cutting-edge',
      'game-changing',
    ],
    ctaStyle: 'Soft and inviting. Never pushy.',
    exampleCaptions: [],
    updatedAt: new Date().toISOString(),
  },
  'blue-collar-hustle': {
    companySlug: 'blue-collar-hustle',
    name: 'Blue Collar Hustle',
    phone: '',
    website: '',
    services: 'Trades media and culture brand — TikTok scripts, short form video, Facebook content',
    targetAudience: 'Contractors, tradespeople, and small business owners in the trades',
    geoFocus: '',
    tone: 'Raw, direct, zero corporate language, experience-based, confident without arrogance. Personal platform — sounds like a real person talking not a brand.',
    hardRules: [
      'Short punchy sentences',
      'No fluff',
      'No motivational poster language',
      'No clichés',
      'No corporate speak',
      'Bold contrarian takes are encouraged',
      'Hard financial truths with actionable homework are encouraged',
      'Raw behind the scenes content is encouraged',
      'Never sounds polished or scripted even when it is',
    ],
    bannedPhrases: [
      'transformative',
      'innovative',
      'cutting-edge',
      'game-changing',
      'synergy',
      'leverage',
      'optimize',
    ],
    ctaStyle: 'Direct. No soft sells. Straight to the point.',
    exampleCaptions: [],
    updatedAt: new Date().toISOString(),
  },
};

const flynnCaptions: { text: string; postType: Caption['postType']; tags: string[] }[] = [
  // BARNDO POSTS
  {
    text: "It's barndominium season here in the Upper Cumberland, and we're absolutely here for it.\n\nThere's something about these builds that just clicks for us. Maybe it's the scale, the creativity, or the families who choose to build them. Either way, we've refined our process enough to know exactly what works and what doesn't.\n\nSteady communication. Clear expectations. A build that feels predictable from one phase to the next.\n\nIf you're thinking about a barndominium in Middle Tennessee, let's talk.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Project Spotlight',
    tags: ['barndo', 'spring-campaign-2026'],
  },
  {
    text: "Spring has arrived and we are coming into this construction season with real momentum behind us. All Q1 we have been sharpening our process, building our crew capacity, and getting after the details that most people never see but that make all the difference once a project is underway.\n\nBarndominiums are one of our favorite builds and the Upper Cumberland has become a place where we have done a lot of them well. If yours has been sitting on the back burner, we would love to bring some real energy and a proven process to the table for you.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Project Spotlight',
    tags: ['barndo', 'spring-campaign-2026'],
  },
  {
    text: "It is barndominium season in the Upper Cumberland and the excitement inside our company right now is real. We have spent all Q1 preparing for a season that we believe is going to be our best one yet and these builds are a huge part of what is driving that energy.\n\nThere is a real craft and a real science to building a barndominium correctly and we have put in the work to understand both sides of that equation. If you are ready to build yours, reach out and let's have an honest conversation about what that process looks like with us.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Project Spotlight',
    tags: ['barndo', 'spring-campaign-2026'],
  },
  {
    text: "We have been building some serious infrastructure here at Modern Development all Q1 and barndominiums are one of the builds we are most fired up to get after this season. The Upper Cumberland is a place where people have a vision for how they want to live and barndominiums have become the way a lot of families are choosing to do exactly that.\n\nWe have built enough of them at this point to have a process that is dialed in from the foundation to the final trim and every single one we build gets the same level of attention and care regardless of size or scope.\n\nIf the Upper Cumberland is where you are planting roots and a barndominium is how you want to do it, we would love nothing more than to be the team you call.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Project Spotlight',
    tags: ['barndo', 'spring-campaign-2026'],
  },
  {
    text: "All Q1 we have been refining our craft and building the kind of team and infrastructure that allows us to deliver barndominium builds that our clients are going to love for decades. This is a season we have been looking forward to and the Upper Cumberland is a market we know well and care deeply about.\n\nEvery barndominium we build is a family's home and we never lose sight of that. We bring the same engineering mindset, the same process, and the same ownership mentality to every phase of every build we take on. If yours is next, we are ready to go to work for you.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Project Spotlight',
    tags: ['barndo', 'spring-campaign-2026'],
  },
  // OUTDOOR POSTS
  {
    text: "This pool house is really starting to take shape and we could not be more excited about where it's headed. Somebody is going to have the perfect setup this summer and it all started with a conversation and a plan.\n\nSummer will be here before you know it and if you've been thinking about transforming your outdoor space, now is the time to get your project on the calendar. The season fills up fast and the families who plan ahead are always the ones who get to enjoy it most.\n\nReach out and let's talk about what we can build for you.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Project Spotlight',
    tags: ['outdoor', 'pool-house', 'spring-campaign-2026'],
  },
  {
    text: "Summer will be here before you know it and now is exactly the right time to start thinking seriously about what you want your outdoor space to become. All Q1 we have been gearing up for a season that we are genuinely excited about and pool houses and outdoor builds are some of the most rewarding projects we get to work on because the impact on how a family lives day to day is immediate and lasting.\n\nIf you have been sitting on an idea for your property, we would love to come out, walk the space with you, and start talking through what is possible. These projects are a lot of fun to build and we cannot wait to get after them this season.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Project Spotlight',
    tags: ['outdoor', 'spring-campaign-2026'],
  },
  // CUSTOM HOMES
  {
    text: "We have been gearing up all Q1 and construction season is officially here. At Modern Development we are built on systems and engineering principles that were designed to take the uncertainty out of the building process, and every spring we come in sharper than the year before because that is what our families deserve.\n\nA custom home is a long term commitment and the team you choose to build it with matters more than most people realize until they are already in the middle of it. We would love to be that team for you and show you firsthand what a well run build actually feels like.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Lead Gen',
    tags: ['custom-home', 'spring-campaign-2026'],
  },
  {
    text: "Construction season is upon us and we are walking into it with confidence. We spent Q1 the same way we spend every offseason at Modern Development, looking hard at what worked, what we could sharpen, and how to build a better experience for every family that puts their trust in us this year.\n\nCustom homes are at the heart of what we do and every one we build carries the full weight of our team, our process, and our values. If building yours has been the goal, we would love to show you what that journey looks like with a team that is fully committed to getting it right.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Lead Gen',
    tags: ['custom-home', 'spring-campaign-2026'],
  },
  {
    text: "A custom home is one of the few things in life where the experience of building it matters just as much as the finished product. The families we build for are not just buying a house, they are spending months of their life in a process that should feel organized, honest, and worth every bit of the investment they are making. That is the experience we work every single day to deliver.\n\nWe have built our company on systems and values that were designed to protect that experience at every phase and the Upper Cumberland families who have been through it with us will tell you exactly what it feels like. If you are ready to build your custom home, we are ready to go to work for you.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Lead Gen',
    tags: ['custom-home', 'spring-campaign-2026'],
  },
  {
    text: "There is a version of your life that happens inside a home that was designed specifically for the way your family lives. Getting there takes the right plan, the right people, and a process that keeps everything moving in the right direction from the first conversation to the final walkthrough.\n\nThat is what we do at Modern Development and it is what we have built this company around. Custom homes in the Upper Cumberland are not just a service we offer, they are the standard we hold everything else up to. If building yours has been the goal, we would love to sit down with you and show you exactly what that process looks like with us behind it.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Lead Gen',
    tags: ['custom-home', 'spring-campaign-2026'],
  },
  {
    text: "Most people don't realize how much the team behind the build shapes the entire experience of building a custom home. The decisions that get made in the early phases, the way communication flows through the middle of the build, and the attention to detail that shows up at the finish line all come back to the people you chose to trust with it.\n\nWe have spent years building a team and a process here at Modern Development that we are genuinely proud to put in front of the families of the Upper Cumberland. If a custom home is what you have been working toward, we would love to be the team you call.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Lead Gen',
    tags: ['custom-home', 'spring-campaign-2026'],
  },
  // ADDITIONS / RENOS
  {
    text: "There is a certain kind of homeowner who looks at the space they already have and sees something more in it. Not because they need to move, but because they have built a life in that house and they want it to grow with them. That is exactly the kind of project we love being a part of here at Modern Development.\n\nAdditions and renovations require a team that understands how a home works as a whole, not just the section being touched. We bring a full process to every project we take on and the result always feels intentional, well built, and like it belonged there all along. If you have been thinking about what your home could become, reach out and let's talk about it.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Lead Gen',
    tags: ['addition', 'renovation', 'spring-campaign-2026'],
  },
  {
    text: "There is something really special about a family that has outgrown their home but loves where they live too much to leave it. An addition done right does not just add square footage, it adds a whole new chapter to a home that already has meaning behind it and history built into its walls.\n\nWe love these projects because the stakes are personal and the result is permanent. Our team brings a full engineering mindset and a disciplined process to every addition we take on and when it is finished it feels like it was always supposed to be there. If your family needs more space and your home needs more room to grow, reach out and let's talk about what we can build for you.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Lead Gen',
    tags: ['addition', 'spring-campaign-2026'],
  },
  {
    text: "The best renovations are the ones where you walk into the finished space and it feels like it could not have been any other way. Getting there requires more than just good craftsmanship, it requires a team that listens well, plans thoroughly, and communicates clearly every step of the way so that nothing about the outcome comes as a surprise.\n\nThat is the standard we hold ourselves to on every renovation we take on at Modern Development. We work inside people's homes and we never lose sight of what that means or what it asks of us. If you are ready to do something meaningful with your space, give us a call and let's start talking.\n\n931-510-6147 | moderndevelopment.co",
    postType: 'Lead Gen',
    tags: ['renovation', 'spring-campaign-2026'],
  },
];

export function seedData(): void {
  if (isSeeded()) return;

  const captions: Caption[] = flynnCaptions.map((c) =>
    makeCaption('flynn-development', c.text, c.postType, c.tags)
  );

  const data: OutpostData = {
    version: 1,
    brandSettings: defaultBrandSettings,
    captions,
    posts: [],
  };

  setData(data);
}
