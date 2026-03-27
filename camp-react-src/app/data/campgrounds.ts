/**
 * Campground card photos: each `image` is an **Unsplash** URL (stock photography, often from a
 * Figma “Make” export). They are **mood / theme** shots — not guaranteed to be that exact park.
 * Swap URLs anytime for official park photos or your own shots.
 *
 * Water temperature blurbs: **July–August typical ranges**, synthesized from marine/river/lake
 * references (e.g. Hood Canal seasonal SST, Columbia basin lake behavior, river safety messaging).
 * Exact degrees vary daily — treat as planning hints, not a forecast.
 */

/** 1–10 rubric for weighted “match” scoring (see Interest sliders on Home). */
export interface MatchScores {
  scenery: number;
  water: number;
  peace: number;
  drive: number;
}

export interface Campground {
  id: string;
  name: string;
  region: 'NW' | 'NE' | 'SW' | 'SE';
  latitude: number;
  longitude: number;
  distanceFromBothell: number; // in miles
  driveTime: string;
  terrain: string;
  waterAccess: {
    available: boolean;
    type?: string; // lake, river, etc.
    temperature: string;
  };
  scenicRating: number; // 1-5
  commercialLevel: string; // natural, moderate, commercial
  activities: string[];
  description: string;
  proTips: string[];
  bestFor: string[];
  image: string;
  bookingUrl: string;
  season: string[];
  matchScores: MatchScores;
}

export const campgrounds: Campground[] = [
  {
    id: 'potlatch',
    name: 'Potlatch State Park',
    region: 'NW',
    latitude: 47.3502,
    longitude: -123.1554,
    distanceFromBothell: 98,
    driveTime: '2 hours',
    terrain: 'Coastal forest with Hood Canal waterfront. Dense Douglas fir and western red cedar trees meet rocky beach.',
    waterAccess: {
      available: true,
      type: 'Hood Canal (saltwater / brackish)',
      temperature:
        'July surface typically ~58-68°F (occasional warm layers toward ~70°F on calm, hot weeks). Much cooler than eastern WA lakes — fine for wading and short dips; long swims feel brisk.',
    },
    scenicRating: 4.5,
    commercialLevel: 'Natural with basic amenities',
    activities: [
      'Shellfish harvesting (oysters, clams)',
      'Kayaking & paddleboarding',
      'Beachcombing',
      'Fishing (salmon, rockfish)',
      'Beach fires',
      'Tidepool exploring',
      'Scenic hiking trails',
    ],
    description:
      'A hidden gem on Hood Canal with old-growth forest meeting saltwater. Perfect mix of beach and woods camping. The sunsets over the Olympics are spectacular, and low tide reveals amazing tidepools. Less crowded than Olympic National Park but equally beautiful.',
    proTips: [
      'Check tide charts for best clamming times',
      'Bring your shellfish license',
      'Sites 1-17 are right on the water',
      'Evening campfires on the beach are magical',
    ],
    bestFor: ['Families', 'Water activities', 'Seafood lovers', 'Beach camping'],
    image: 'https://images.unsplash.com/photo-1570747792707-139b1110f5d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kJTIwY2FuYWwlMjB3YXNoaW5ndG9ufGVufDF8fHx8MTc3NDU5NDQ4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    bookingUrl: 'https://washington.goingtocamp.com/create-booking/results',
    season: ['July', 'August', 'September'],
    matchScores: { scenery: 8, water: 8, peace: 7, drive: 9 },
  },
  {
    id: 'curlew-lake',
    name: 'Curlew Lake State Park',
    region: 'NE',
    latitude: 48.7185,
    longitude: -118.6784,
    distanceFromBothell: 295,
    driveTime: '5 hours',
    terrain:
      'Forest-fringed mountain lake in northeast Washington — ponderosa pine hills and open lawns, dry sunny summers, big-sky feel (not west-side rainforest).',
    waterAccess: {
      available: true,
      type: 'Curlew Lake (freshwater)',
      temperature:
        'July–August surface commonly high 60s–mid 70s °F in this relatively shallow, sun-heated lake; cooler after weather systems or away from shore.',
    },
    scenicRating: 4,
    commercialLevel: 'Natural with moderate amenities',
    activities: [
      'Swimming (great for kids)',
      'Fishing (rainbow trout, bass)',
      'Water skiing',
      'Boating',
      'Beach volleyball',
      'Wildlife watching (eagles, osprey)',
      'Stargazing (minimal light pollution)',
    ],
    description:
      'Northeast Washington lake camping with reliably swimmable summer water compared to cold west-side rivers. Less humid than the coast, sunny and dry. Sandy areas and shallow entry make it a classic inland lake trip — quieter than I-5 corridor parks.',
    proTips: [
      'Bring sunscreen - it\'s HOT and dry here',
      'Sites 15-25 have best lake access',
      'Bring your own firewood (none available)',
      'Amazing for star photography at night',
    ],
    bestFor: ['Hot summer weather', 'Swimming', 'Kids', 'Fishing', 'Peace and quiet'],
    image: 'https://images.unsplash.com/photo-1719543197944-c91701169658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJsZXclMjBsYWtlJTIwd2FzaGluZ3RvbnxlbnwxfHx8fDE3NzQ1OTQ0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bookingUrl: 'https://washington.goingtocamp.com/create-booking/results',
    season: ['July', 'August', 'September'],
    matchScores: { scenery: 8, water: 8, peace: 8, drive: 2 },
  },
  {
    id: 'sun-lakes',
    name: 'Sun Lakes State Park',
    region: 'NE',
    latitude: 47.5881,
    longitude: -119.5189,
    distanceFromBothell: 193,
    driveTime: '3.5 hours',
    terrain: 'Dramatic desert landscape carved by ancient floods. Tall basalt cliffs, sagebrush, and deep blue lakes. Mars-like geology.',
    waterAccess: {
      available: true,
      type: 'Park lakes (freshwater, alkaline)',
      temperature:
        'Late July–August: surface often high 60s–low 70s °F on typical hot weeks; early July or deeper water can feel noticeably cooler. Desert sun makes air hot even when water is refreshing.',
    },
    scenicRating: 5,
    commercialLevel: 'Moderate amenities (but unique landscape)',
    activities: [
      'Swimming in crystal-clear water',
      'Fishing (stocked trout)',
      'Paddleboarding',
      'Hiking (Dry Falls viewpoint nearby)',
      'Cave exploring',
      'Photography (epic landscapes)',
      'Golf (9-hole course on site)',
    ],
    description:
      'MOST UNIQUE LANDSCAPE on this list. Feels like another planet — basalt, coulees, desert lakes. Water is clear; by peak summer it\'s swim-friendly for many people, though it warms through the season (don\'t expect Florida bathwater in early July). Dry Falls is one of Washington\'s most dramatic sights. Hot days, cool nights, big sunsets.',
    proTips: [
      'Visit Dry Falls Visitor Center - mind-blowing',
      'Bring shade structures - minimal tree cover',
      'Water is pristine for swimming',
      'Surprisingly good restaurant on-site',
    ],
    bestFor: ['Unique scenery', 'Photography', 'Geology lovers', 'Hot weather', 'Swimming'],
    image: 'https://images.unsplash.com/photo-1641667408229-edb68be87983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW4lMjBsYWtlcyUyMHN0YXRlJTIwcGFya3xlbnwxfHx8fDE3NzQ1OTQ0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bookingUrl: 'https://washington.goingtocamp.com/create-booking/results',
    season: ['July', 'August', 'September'],
    matchScores: { scenery: 10, water: 7, peace: 6, drive: 5 },
  },
  {
    id: 'paradise-point',
    name: 'Paradise Point State Park',
    region: 'SW',
    latitude: 45.7675,
    longitude: -122.6211,
    distanceFromBothell: 211,
    driveTime: '3.5 hours',
    terrain:
      'Lowland mixed forest along the East Fork Lewis River (maple, cottonwood, Douglas-fir) — green and mossy in places, but not coastal rainforest.',
    waterAccess: {
      available: true,
      type: 'East Fork Lewis River (sandy swim beach + river)',
      temperature:
        'Mid–late July: the park’s slow, sandy swimming area often reaches upper 60s–low 70s °F on hot days. Main current and deeper water stay much colder (~55–65°F). Swift water and cold shock are real risks — use life jackets, especially kids.',
    },
    scenicRating: 4,
    commercialLevel: 'Natural with good facilities',
    activities: [
      'River swimming (rope swing!)',
      'Fishing (salmon, steelhead)',
      'Hiking forested trails',
      'Mountain biking',
      'Nearby Moulton Falls hike',
      'Disc golf',
      'Relaxing in the forest',
    ],
    description:
      'Riverfront state park with mature forest and a long sandy beach on the East Fork Lewis. Spacious sites; great for families who want river swimming (respect currents). Near Portland/Vancouver for supplies. Some sites hear I-5 — check reviews if you want maximum quiet.',
    proTips: [
      'Sites 1-36 are closest to river',
      'Check out nearby Moulton Falls',
      'Rope swing is a kid magnet',
      'Can be busy - book early for summer weekends',
    ],
    bestFor: ['Forest lovers', 'Families', 'Classic PNW vibes', 'River activities'],
    image: 'https://images.unsplash.com/photo-1639050154816-bced01e66bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhZGlzZSUyMHBvaW50JTIwc3RhdGUlMjBwYXJrJTIwd2FzaGluZ3RvbnxlbnwxfHx8fDE3NzQ1OTQ0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bookingUrl: 'https://washington.goingtocamp.com/create-booking/results',
    season: ['July', 'August', 'September'],
    matchScores: { scenery: 6, water: 8, peace: 4, drive: 4 },
  },
  {
    id: 'potholes',
    name: 'Potholes State Park',
    region: 'SE',
    latitude: 46.9967,
    longitude: -119.2089,
    distanceFromBothell: 157,
    driveTime: '3 hours',
    terrain: 'Desert shrub-steppe with surprising water features. Sagebrush, basalt rock formations, and dozens of interconnected lakes.',
    waterAccess: {
      available: true,
      type: 'Potholes Reservoir (freshwater)',
      temperature:
        'July–August surface commonly mid/high 60s to mid 70s °F — among the warmer swim spots on this list. Levels fluctuate with irrigation; swimming is from designated areas, not right at fluctuating shorelines.',
    },
    scenicRating: 3.5,
    commercialLevel: 'Moderate (popular with RVs)',
    activities: [
      'World-class fishing (bass, walleye, trout)',
      'Boating (lots of waterways)',
      'Swimming',
      'Waterfowl watching',
      'Sand dunes exploring',
      'Hunting (in season)',
    ],
    description:
      'A fisherman\'s paradise in the desert. Hundreds of small "pothole" lakes created by irrigation. Unique ecosystem - desert meeting water. Great for boating with lots of hidden coves to explore. Hot and dry summer weather. More of an "activity" camp than a "nature retreat" camp.',
    proTips: [
      'Bring serious fishing gear - trophy bass here',
      'Can be VERY hot - bring shade',
      'Popular spot, can feel crowded',
      'Bugs can be intense near water at dusk',
    ],
    bestFor: ['Fishing enthusiasts', 'Boating', 'Hot weather lovers', 'Water sports'],
    image: 'https://images.unsplash.com/photo-1500498036565-cdf5d84e5393?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBjYW1waW5nJTIwd2FzaGluZ3RvbnxlbnwxfHx8fDE3NzQ1OTQ0ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bookingUrl: 'https://washington.goingtocamp.com/create-booking/results',
    season: ['July', 'August', 'September'],
    matchScores: { scenery: 6, water: 8, peace: 5, drive: 6 },
  },
  {
    id: 'wanapum',
    name: 'Wanapum Recreation Area',
    region: 'SE',
    latitude: 46.8794,
    longitude: -119.9706,
    distanceFromBothell: 148,
    driveTime: '2.5 hours',
    terrain: 'Columbia River shoreline with desert backdrop. Open landscape with sagebrush and native grasses. River beach access.',
    waterAccess: {
      available: true,
      type: 'Columbia River',
      temperature:
        'July surface at this mid-Columbia reach is often about mid/high 60s to low 70s °F, but wind, current, and upwelling change how it feels day to day.',
    },
    scenicRating: 3,
    commercialLevel: 'Developed park with full amenities',
    activities: [
      'Swimming beach',
      'Fishing (salmon, sturgeon)',
      'Boating (boat launch)',
      'Water skiing',
      'Basketball courts',
      'Horseshoe pits',
      'Biking',
    ],
    description:
      'A well-maintained riverside park on the Columbia River. Clean, spacious, functional. Great for groups that want reliable amenities and water access without going super remote. Think "comfortable camping" - hot showers, flush toilets, playground. Close to Vantage for supplies.',
    proTips: [
      'Sites 1-30 closest to water',
      'Very sunny - bring plenty of shade',
      'Good cell service',
      'Nearby Ginkgo Petrified Forest is cool',
    ],
    bestFor: ['Comfort camping', 'River access', 'Families with young kids', 'Convenience'],
    image: 'https://images.unsplash.com/photo-1571288622450-c87742110238?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2x1bWJpYSUyMHJpdmVyJTIwY2FtcGluZ3xlbnwxfHx8fDE3NzQ1OTQ0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bookingUrl: 'https://washington.goingtocamp.com/create-booking/results',
    season: ['July', 'August', 'September'],
    matchScores: { scenery: 8, water: 7, peace: 5, drive: 7 },
  },
  {
    id: 'lewis-clark',
    name: 'Lewis and Clark Trail State Park',
    region: 'SE',
    latitude: 46.3469,
    longitude: -117.8831,
    distanceFromBothell: 296,
    driveTime: '5 hours',
    terrain: 'Wooded canyon along the Touchet River. Mix of pine and cottonwood trees. Historic location with forested hiking trails.',
    waterAccess: {
      available: true,
      type: 'Touchet River (small stream)',
      temperature:
        'July: wading pockets roughly high 50s–mid 60s °F — cold, clear snowmelt-influenced water. Splashing and cooling off, not warm-lake swimming.',
    },
    scenicRating: 4,
    commercialLevel: 'Natural with basic amenities',
    activities: [
      'Hiking historic trails',
      'Fishing (small stream)',
      'Creek wading',
      'Wildlife watching',
      'Historic interpretation',
      'Bird watching',
      'Nature photography',
    ],
    description:
      'A peaceful, lesser-known gem near Walla Walla. Shaded canyon camping along a babbling creek. Historic significance as part of the Lewis and Clark trail. Good middle ground between desert and forest camping. Cooler than surrounding areas due to tree cover. More intimate and quiet than big reservoir parks.',
    proTips: [
      'Great escape from eastern WA heat',
      'Mosquitoes can be present near creek',
      'Very quiet and uncrowded',
      'Side trip to Walla Walla wineries',
    ],
    bestFor: ['History buffs', 'Peace and quiet', 'Shade seekers', 'Nature lovers'],
    image: 'https://images.unsplash.com/photo-1734903251897-032952a97fd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFrZSUyMHJpdmVyJTIwY2FtcGluZ3xlbnwxfHx8fDE3NzQ1OTQ0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bookingUrl: 'https://washington.goingtocamp.com/create-booking/results',
    season: ['July', 'August', 'September'],
    matchScores: { scenery: 7, water: 6, peace: 8, drive: 2 },
  },
];
