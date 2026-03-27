/**
 * WA Summer Camp Safari — data, map, weighted scores, compare, confetti
 */

const WEIGHT_KEYS = [
  { id: "scenery", label: "Epic views & scenery" },
  { id: "water", label: "Water fun (swim, paddle, boat)" },
  { id: "kids", label: "Kid & group comfort (bathrooms, ease)" },
  { id: "peace", label: "Nature vibe (less “RV resort”)" },
  { id: "drive", label: "Shorter drive from Bothell" },
];

const defaultWeights = () =>
  Object.fromEntries(WEIGHT_KEYS.map((k) => [k.id, 50]));

/** @type {typeof defaultWeights} */
let weights = defaultWeights();

const sites = [
  {
    id: "potlatch",
    name: "Potlatch State Park",
    region: "NW · Hood Canal",
    lat: 47.3482,
    lng: -123.0889,
    driveFromBothell: "~1h 50m · ~85 mi",
    driveHours: 1.85,
    bookUrl: "https://www.parks.wa.gov/569/Potlatch",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Hood_Canal_1.jpg/1024px-Hood_Canal_1.jpg",
    photoCredit: "Hood Canal (representative of canal-side parks) — Wikimedia",
    terrain:
      "Mossy **Douglas-fir / mixed forest** rolling down to **Hood Canal** shoreline — rocky/shell beaches, grassy loops, not desert.",
    commercial:
      "**State park** — developed loops, showers, amphitheater: comfortable, not a theme-park KOA. Still feels like “real” PNW water and forest.",
    activities: [
      "Kayak / paddle (calm canal days)",
      "Crabbing & fishing (rules + licenses)",
      "Beachcombing & low-tide exploring",
      "Short walks in-park; longer hikes nearby on the peninsula",
      "Moorage buoys if you bring a boat",
    ],
    water:
      "**Salt / brackish Hood Canal** — swimmable on calm warm days; many people wade and paddle. **Cooler than warm inland lakes** — think refreshing, not bathwater. Full water access along the park shore.",
    waterTempNote:
      "Summer surface often **high 50s–mid 60s °F** depending on tide, weather, and exact spot — pleasant on hot days, not Florida-warm.",
    nature:
      "Elk in the broader region, eagles, seals sometimes; classic **PNW estuary + fjord-like canal** scenery with Olympics on the skyline.",
    scenic: 8,
    scores: { scenery: 8, water: 8, kids: 8, peace: 7, drive: 9 },
    quirks:
      "Part of the campground closes seasonally in fall — check your dates. Popular on summer weekends; book early.",
  },
  {
    id: "paradise",
    name: "Paradise Point State Park",
    region: "SW · Lewis River → Columbia",
    lat: 45.8381,
    lng: -122.6728,
    driveFromBothell: "~3h 10m · ~185 mi",
    driveHours: 3.15,
    bookUrl: "https://www.parks.wa.gov/560/Paradise-Point",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Lewis_River_Upstream_of_Merced_Falls.jpg/1024px-Lewis_River_Upstream_of_Merced_Falls.jpg",
    photoCredit: "Lewis River (regional river vibe) — Wikimedia",
    terrain:
      "**Mixed woodland** along the **Lewis River** near the **Columbia** — sandy swim beach area, river bottomland, not high alpine.",
    commercial:
      "Full **state-park amenities** (showers, disc golf). **I-5 traffic noise** reaches some sites — pick a wooded interior site if that matters.",
    activities: [
      "Sandy river swimming",
      "Kayak / fishing on the Lewis",
      "Disc golf course",
      "Wildlife viewing along riparian corridors",
    ],
    water:
      "**Fresh river + swim beach** — easier “classic swimming” than cold salt water. Boat ramp to the Lewis (primitive).",
    waterTempNote:
      "Summer river/lagoon pockets often **low–mid 70s °F** when the weather cooperates — much warmer than Hood Canal for casual swimming.",
    nature:
      "Wetland/river ecology; great for **kids + multi-family** comfort. Tradeoff is **highway proximity** on part of the campground.",
    scenic: 6,
    scores: { scenery: 6, water: 7, kids: 8, peace: 4, drive: 4 },
    quirks:
      "If your group wants “silent forest,” read site reviews or choose tent loops farther from the freeway roar.",
  },
  {
    id: "curlew",
    name: "Curlew Lake State Park",
    region: "NE · Ferry County",
    lat: 48.7279,
    lng: -118.5968,
    driveFromBothell: "~5h 30m+ · long haul",
    driveHours: 5.5,
    bookUrl: "https://www.parks.wa.gov/find-parks/state-parks/curlew-lake-state-park",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Curlew_Lake%2C_Washington.JPG/1024px-Curlew_Lake%2C_Washington.JPG",
    photoCredit: "Curlew Lake — Wikimedia (Jsayre64)",
    terrain:
      "**Ponderosa pine hills** and **open lawns** on a natural **mountain lake** — inland “Northeast Washington” feel, not rainforest, not desert.",
    commercial:
      "Proper state park with **dock, ramp, showers** — friendly and maintained, still surrounded by **forest and open water**.",
    activities: [
      "Fishing (trout, bass, perch, tiger muskie — check regs)",
      "Motor boating & paddling",
      "Swimming from park areas",
      "~2 mi hike/bike trails; birding (heron rookery, osprey, eagles)",
    ],
    water:
      "**Fresh lake** with beach-style access in places — great for **boats and floats**.",
    waterTempNote:
      "Mid-summer surface commonly **pleasant for swimming** (often **high 60s–low 70s °F** range on warm weeks) — much warmer than alpine tarns.",
    nature:
      "Strong **wildlife + quieter nights** than I-5 corridor parks. You earn it with **drive time**.",
    scenic: 8,
    scores: { scenery: 8, water: 7, kids: 7, peace: 8, drive: 2 },
    quirks:
      "Park traditionally **closed Nov–early April** — perfect for your Jul–Sep window. Register at ranger station on arrival.",
  },
  {
    id: "sunlakes",
    name: "Sun Lakes–Dry Falls State Park",
    region: "NC · Grand Coulee / scablands",
    lat: 47.5996,
    lng: -119.3648,
    driveFromBothell: "~3h 45m · ~200+ mi",
    driveHours: 3.75,
    bookUrl: "https://www.parks.wa.gov/298/Sun-Lakes-Dry-Falls",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Dry_Falls_-_Sun_Lakes-Dry_Falls_State_Park.jpg/1024px-Dry_Falls_-_Sun_Lakes-Dry_Falls_State_Park.jpg",
    photoCredit: "Dry Falls — Wikimedia (JonRMcelroy)",
    terrain:
      "**Ice-age scablands**: basalt cliffs, **Dry Falls** overlooks, sagebrush/steppe mixed with **lake basins** — famously **not** mossy west-side forest.",
    commercial:
      "Busy flagship park (visitor energy, lots of campers) but the **landscape is geologically huge** — feels like another planet compared to Bothell.",
    activities: [
      "Dry Falls visitor center & overlooks",
      "Swimming, paddling, boating on park lakes",
      "Golf nearby (external)",
      "Stargazing / big-sky sunsets",
    ],
    water:
      "Multiple **freshwater lakes**; boat rentals nearby in the region.",
    waterTempNote:
      "Early season can be **chilly**; by **late July–August** many swimmers find it **fine** (often **mid/high 60s °F** and up on hot weeks depending on lake and weather).",
    nature:
      "Top-tier **“wow, Washington does THIS too?”** scenery — desert-coulee ecology, rattlesnakes possible (stay aware on rocks/trails).",
    scenic: 10,
    scores: { scenery: 10, water: 7, kids: 7, peace: 6, drive: 5 },
    quirks:
      "Bring shade + sun strategy — eastern WA summer heat is real. One of the **most photogenic** picks for the whole group.",
  },
  {
    id: "potholes",
    name: "Potholes State Park",
    region: "SC · Columbia Basin",
    lat: 46.9828,
    lng: -119.0825,
    driveFromBothell: "~3h 15m",
    driveHours: 3.25,
    bookUrl: "https://www.parks.wa.gov/568/Potholes",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Channeled_Scablands.jpg/1024px-Channeled_Scablands.jpg",
    photoCredit: "Channeled Scablands (regional landform) — Wikimedia (USDA)",
    terrain:
      "**High-desert shrub-steppe** around **Potholes Reservoir** — dunes, sage, irrigation-influenced water levels; **not** shady rainforest.",
    commercial:
      "Family-friendly **state park**: playgrounds, volleyball, docks — can feel **busy and boaty** on holiday weekends. Still open sky and wild birds.",
    activities: [
      "Boating & water-sports hub",
      "Serious birding (cranes, raptors, waterfowl)",
      "Fishing year-round (check regs)",
      "Cabins available if some folks want walls",
    ],
    water:
      "**Fresh reservoir** — swim where allowed; boating is the main culture.",
    waterTempNote:
      "Summer surface temperatures often **warm** for WA (**low/mid 70s °F** and up) — great for “lake day” people.",
    nature:
      "Feels like **eastern Washington summer**: jackrabbits, coyotes at night, dramatic **sunsets over water**.",
    scenic: 6,
    scores: { scenery: 6, water: 8, kids: 8, peace: 5, drive: 5 },
    quirks:
      "**Water levels fluctuate** — campsites are set back from shore by design. If you want trees for shade, this isn’t your mossy peninsula.",
  },
  {
    id: "wanapum",
    name: "Wanapum Recreation Area",
    region: "EC · Columbia River (Ginkgo / Vantage)",
    lat: 46.8662,
    lng: -119.9674,
    driveFromBothell: "~2h 45m",
    driveHours: 2.75,
    bookUrl: "https://www.parks.wa.gov/find-parks/state-parks/wanapum-recreation-area",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Columbia_River_Vantage_WA.jpg/1024px-Columbia_River_Vantage_WA.jpg",
    photoCredit: "Columbia River at Vantage — Wikimedia (Cmakin)",
    terrain:
      "**Columbia Plateau**: sage, basalt, **big river** — pairs with **Ginkgo Petrified Forest** trails (petrified logs, interpretive hikes).",
    commercial:
      "Campground is **RV-forward** with full hookups; park warns **evening wind** — **tents are a pain** here more often than in forest parks.",
    activities: [
      "Columbia boating & fishing",
      "Ginkgo trails + interpretive center (seasonal hours)",
      "Wanapum Heritage Center nearby",
      "Classic **Vantage / Gorge** photo ops",
    ],
    water:
      "**Big river** access — swimming happens but it’s **river culture** (current, boat wakes) more than a roped beach day.",
    waterTempNote:
      "Mid-summer Columbia mainstem often **upper 60s–low 70s °F** in sluggish back-eddies; can feel cooler with wind.",
    nature:
      "High scenic drama (**gorge, cliffs, river**) with a **drier, sunnier** ecology than western WA.",
    scenic: 8,
    scores: { scenery: 8, water: 7, kids: 5, peace: 7, drive: 6 },
    quirks:
      "For **3 tents + families**, read wind reports — many groups prefer **hard-sided** or **heavier tent stakes + wind breaks**. Adjacent **Ginkgo** is the nature jackpot.",
  },
  {
    id: "lewisclark",
    name: "Lewis & Clark State Park",
    region: "SW · Chehalis (note: not eastern WA)",
    lat: 46.6394,
    lng: -122.8558,
    driveFromBothell: "~1h 55m",
    driveHours: 1.9,
    bookUrl: "https://www.parks.wa.gov/296/Lewis-Clark",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cowlitz_River_in_Lewis_and_Clark_State_Park.jpg/1024px-Cowlitz_River_in_Lewis_and_Clark_State_Park.jpg",
    photoCredit: "Cowlitz River in Lewis & Clark SP — Wikimedia (Kjkolb)",
    terrain:
      "Rare **old-growth-leaning forest** (big trees) along the **Cowlitz River** — classic **west-side river bottom** camping.",
    commercial:
      "Very **family-standard state park**: easy loops, river access, interpretive vibe. Feels **woodsy-natural** despite crowds on peak weekends.",
    activities: [
      "River wading & fishing (check regs)",
      "Easy hiking inside the park",
      "Historic / interpretive interest (Lewis & Clark corridor)",
      "Great “first big campout” energy for kids",
    ],
    water:
      "**River** — wading and cautious play; not a big sandy swim beach like Paradise Point.",
    waterTempNote:
      "Summer river temps often **60s °F** — refreshing, not warm-lake bathwater.",
    nature:
      "Dense canopy, ferns, **elk** possible in region — strongest **“green PNW forest”** pick on your list **closest to Bothell**.",
    scenic: 7,
    scores: { scenery: 7, water: 6, kids: 9, peace: 6, drive: 9 },
    quirks:
      "Your note said “Lewis and Clark Trail” in the SE bucket — **this campground is SW (Chehalis)**, not Tri-Cities. Eastern “Trail” units are often **day-use**; this is the **sleep-in-a-tent** star with that name.",
  },
];

function computeScore(site) {
  let num = 0;
  let den = 0;
  for (const k of WEIGHT_KEYS) {
    const w = weights[k.id] ?? 0;
    num += w * site.scores[k.id];
    den += w;
  }
  if (den === 0) return 0;
  return Math.round((num / den) * 10) / 10;
}

function renderSliders() {
  const root = document.getElementById("weight-sliders");
  root.innerHTML = "";
  for (const k of WEIGHT_KEYS) {
    const row = document.createElement("div");
    row.className = "slider-row";
    const v = weights[k.id];
    row.innerHTML = `
      <label for="w-${k.id}"><span>${k.label}</span><span>${v}</span></label>
      <input type="range" id="w-${k.id}" min="0" max="100" value="${v}" data-key="${k.id}" />
    `;
    root.appendChild(row);
  }
  root.querySelectorAll('input[type="range"]').forEach((input) => {
    input.addEventListener("input", () => {
      const key = input.dataset.key;
      weights[key] = Number(input.value);
      input.previousElementSibling.querySelector("span:last-child").textContent =
        input.value;
      updateAllScores();
    });
  });
}

function updateAllScores() {
  document.querySelectorAll(".card").forEach((card) => {
    const id = card.dataset.id;
    const site = sites.find((s) => s.id === id);
    if (!site) return;
    const el = card.querySelector(".card-score");
    if (el) el.textContent = computeScore(site);
  });
}

function sortCardsByScore() {
  const container = document.getElementById("cards");
  const cards = [...container.querySelectorAll(".card")];
  cards.sort((a, b) => {
    const sa = sites.find((s) => s.id === a.dataset.id);
    const sb = sites.find((s) => s.id === b.dataset.id);
    return computeScore(sb) - computeScore(sa);
  });
  cards.forEach((c) => container.appendChild(c));
}

/** @type {Set<string>} */
const compareSet = new Set();

function toggleCompare(id) {
  if (compareSet.has(id)) {
    compareSet.delete(id);
  } else if (compareSet.size < 3) {
    compareSet.add(id);
  } else {
    compareSet.delete([...compareSet][0]);
    compareSet.add(id);
  }
  renderCompareChips();
  syncCompareButtons();
}

function renderCompareChips() {
  const wrap = document.getElementById("compare-chips");
  wrap.innerHTML = "";
  for (const id of compareSet) {
    const site = sites.find((s) => s.id === id);
    if (!site) continue;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `${site.name}<button type="button" aria-label="Remove ${site.name}">×</button>`;
    chip.querySelector("button").addEventListener("click", () => {
      compareSet.delete(id);
      renderCompareChips();
      syncCompareButtons();
      document.querySelector(`.card[data-id="${id}"] .btn-compare`)?.classList.remove("active");
    });
    wrap.appendChild(chip);
  }
  if (compareSet.size === 0) {
    wrap.innerHTML = `<span style="color:var(--muted);font-size:0.85rem">No spots selected yet.</span>`;
  }
}

function syncCompareButtons() {
  document.querySelectorAll(".btn-compare").forEach((btn) => {
    const id = btn.closest(".card").dataset.id;
    btn.classList.toggle("active", compareSet.has(id));
    btn.textContent = compareSet.has(id) ? "In compare ✓" : "Compare";
  });
  document.getElementById("open-compare").disabled = compareSet.size === 0;
}

function openCompareDialog() {
  const dlg = document.getElementById("compare-dialog");
  const wrap = document.getElementById("compare-table-wrap");
  const selected = [...compareSet].map((id) => sites.find((s) => s.id === id)).filter(Boolean);
  const rows = [
    ["Drive from Bothell", (s) => s.driveFromBothell],
    ["Terrain", (s) => s.terrain.replace(/\*\*/g, "")],
    ["Vibe (natural vs resorty)", (s) => s.commercial.replace(/\*\*/g, "")],
    ["Water", (s) => s.water.replace(/\*\*/g, "")],
    ["Water temp (Jul–Sep)", (s) => s.waterTempNote],
    ["Scenic punch (1–10)", (s) => String(s.scenic)],
    ["Match score (your sliders)", (s) => String(computeScore(s))],
    ["Book", (s) => `<a href="${s.bookUrl}" target="_blank" rel="noopener">Reserve</a>`],
  ];
  let html = "<table class='compare-table'><thead><tr><th>Topic</th>";
  for (const s of selected) {
    html += `<th>${s.name}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (const [label, fn] of rows) {
    html += `<tr><td>${label}</td>`;
    for (const s of selected) {
      html += `<td>${fn(s)}</td>`;
    }
    html += "</tr>";
  }
  html += "</tbody></table>";
  wrap.innerHTML = html;
  dlg.showModal();
}

function fireConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 200,
    w: 6 + Math.random() * 8,
    h: 8 + Math.random() * 10,
    vy: 2 + Math.random() * 4,
    vx: -2 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: -0.15 + Math.random() * 0.3,
    hue: [160, 45, 270, 340][Math.floor(Math.random() * 4)],
  }));
  let frames = 0;
  function tick() {
    frames++;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = `hsl(${p.hue} 85% 60%)`;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (frames < 90) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
  tick();
}

function renderCards() {
  const container = document.getElementById("cards");
  container.innerHTML = "";
  for (const site of sites) {
    const score = computeScore(site);
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = site.id;
    card.innerHTML = `
      <div class="card-image-wrap">
        <span class="card-region">${site.region}</span>
        <span class="card-score" title="Weighted match score">${score}</span>
        <img src="${site.image}" alt="" loading="lazy" width="800" height="450"
          onerror="this.src='https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80'" />
      </div>
      <div class="card-body">
        <h3>${site.name}</h3>
        <div class="card-meta">
          <span class="meta-pill">🚗 ${site.driveFromBothell}</span>
          <span class="meta-pill">📷 ${site.photoCredit}</span>
        </div>
        <p class="card-section-title">Terrain</p>
        <p class="card-section">${fmt(site.terrain)}</p>
        <p class="card-section-title">Natural vs “RV resort”</p>
        <p class="card-section">${fmt(site.commercial)}</p>
        <p class="card-section-title">Activities nearby</p>
        <p class="card-section">${site.activities.map((a) => `• ${a}`).join("<br/>")}</p>
        <p class="card-section-title">Water access & temp</p>
        <p class="card-section">${fmt(site.water)}<br/><strong>Jul–Sep:</strong> ${fmt(site.waterTempNote)}</p>
        <p class="card-section-title">Nature & scenery</p>
        <p class="card-section">${fmt(site.nature)} <strong>Scenic rating:</strong> ${site.scenic}/10 — ${site.quirks}</p>
        <div class="card-actions">
          <a class="btn small primary" href="${site.bookUrl}" target="_blank" rel="noopener">Book / park page</a>
          <button type="button" class="btn small secondary btn-compare">Compare</button>
          <button type="button" class="btn small ghost pick-winner" data-pick="${site.id}">We picked this! 🎉</button>
        </div>
      </div>
    `;
    card.querySelector(".btn-compare").addEventListener("click", () => {
      toggleCompare(site.id);
      syncCompareButtons();
    });
    card.querySelector(".pick-winner").addEventListener("click", () => {
      fireConfetti();
      const title = site.name;
      if (!document.getElementById("toast")) {
        const t = document.createElement("div");
        t.id = "toast";
        t.style.cssText =
          "position:fixed;bottom:1.25rem;left:50%;transform:translateX(-50%);z-index:99;background:var(--surface);border:1px solid var(--accent);color:var(--text);padding:0.75rem 1.25rem;border-radius:12px;font-weight:600;box-shadow:var(--shadow);animation:fadein 0.3s ease";
        document.body.appendChild(t);
      }
      const t = document.getElementById("toast");
      t.textContent = `${title} — great choice! Tell the group in chat.`;
      clearTimeout(window.__toastT);
      window.__toastT = setTimeout(() => {
        t.remove();
      }, 4500);
    });
    container.appendChild(card);
  }
}

function fmt(s) {
  return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function initMap() {
  const map = L.map("map", { scrollWheelZoom: true }).setView([47.5, -120.2], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);
  const bounds = [];
  for (const site of sites) {
    bounds.push([site.lat, site.lng]);
    const m = L.marker([site.lat, site.lng]).addTo(map);
    m.bindPopup(`<strong>${site.name}</strong><br/>${site.region}`);
  }
  map.fitBounds(bounds, { padding: [40, 40] });
}

document.getElementById("reset-weights").addEventListener("click", () => {
  weights = defaultWeights();
  renderSliders();
  updateAllScores();
});

document.getElementById("sort-by-score").addEventListener("click", sortCardsByScore);

document.getElementById("open-compare").addEventListener("click", openCompareDialog);

document.getElementById("clear-compare").addEventListener("click", () => {
  compareSet.clear();
  renderCompareChips();
  syncCompareButtons();
});

renderSliders();
renderCards();
renderCompareChips();
syncCompareButtons();
initMap();

const style = document.createElement("style");
style.textContent = `@keyframes fadein{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`;
document.head.appendChild(style);
