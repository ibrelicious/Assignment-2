/**
 * Assignment 2 — SpaceX API
 * Fokus: fetch, async/await, JSON + map, filter, reduce, flatMap, some, every, sort, slice
 *
 * Flöde:
 *  1) Hämta JSON från SpaceX v4 (launches + rockets) med fetch/async/await.
 *  2) Normalisera och berika launch-objekt (lägger till rocketName, år osv).
 *  3) Visa resultat i konsolen:
 *      - Första 5 **launch-namn** i alfabetisk ordning.
 *      - Alla launches som tillhör en given "kategori" (här: raketnamn) → skriv "name — category".
 *      - Ett objekt som räknar hur många launches per kategori (raket).
 *      - some/every, flatMap, sort, slice demonstreras tydligt.
 *  4) Stretch (VG):
 *      - groupBy(items, keyOrFn)
 *      - Select & reshape till kompakta sammanfattningar
 *      - Frequency map på t.ex. failure reasons och booster-cores
 *
 * OBS: Allt skrivs till konsolen (uppgiften kräver ej UI).
 */

"use strict";

// -------------------------
// Konfiguration
// -------------------------
const BASE = "https://api.spacexdata.com/v4";

// Vilken "kategori" vill vi filtrera på? (case-insensitive)
// Vanliga: "Falcon 9", "Falcon Heavy", "Starship", "Falcon 1"
const GIVEN_CATEGORY = "Falcon 9";

// -------------------------
// Små hjälpare
// -------------------------

/** Snygg utskrift i konsolen */
function print(label, value) {
  console.log(`\n🔹 ${label}`);
  console.log(value);
}

/** groupBy — kan ta nyckelsträng eller funktion */
function groupBy(items, keyOrFn) {
  const getKey = typeof keyOrFn === "function" ? keyOrFn : (x) => x[keyOrFn];
  return items.reduce((acc, item) => {
    const k = getKey(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

/** Frequency map från array av strängar */
function frequency(items) {
  return items.reduce((acc, v) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});
}

/** Bas-funktion för GET + JSON + enkel felhantering */
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  }
  return res.json();
}

// -------------------------
// Data-åtkomst
// -------------------------

/**
 * Hämtar launches och rockets parallellt.
 * /v4/launches → array av launches (med rocket-id m.m.)
 * /v4/rockets  → array av rockets (med namn)
 */
async function fetchSpaceXData() {
  const [launches, rockets] = await Promise.all([
    fetchJson(`${BASE}/launches`),
    fetchJson(`${BASE}/rockets`),
  ]);
  return { launches, rockets };
}

/** Normaliserar launch-objekt och berikar med rocketName + år */
function normalizeLaunches(launches, rockets) {
  const rocketById = Object.fromEntries(rockets.map(r => [r.id, r]));
  return launches.map(l => {
    const rocket = rocketById[l.rocket] || {};
    return {
      id: l.id,
      name: l.name,
      dateUtc: l.date_utc,
      year: (l.date_utc || "").slice(0, 4) || "Unknown",
      success: l.success,          // true/false/null
      upcoming: l.upcoming,        // true/false
      rocketId: l.rocket,
      rocketName: rocket.name || "Unknown",
      failures: (l.failures || []).map(f => f.reason || "Unknown"),
      payloads: l.payloads || [],  // ID:er – duger fint för reshaping
      cores: (l.cores || []).map(c => c.core).filter(Boolean), // booster/core ID
    };
  });
}

// -------------------------
// Huvudprogram
// -------------------------

(async function main() {
  console.group("Assignment 2 — SpaceX API");

  try {
    // 1) FETCH: hämta & parsa JSON
    const { launches, rockets } = await fetchSpaceXData();
    print("Antal hämtade launches", launches.length);
    print("Antal hämtade rockets", rockets.length);

    // 2) Normalisera
    const data = normalizeLaunches(launches, rockets);
    print("Normaliserade exempel (2 st)", data.slice(0, 2));

    // Snabba sanity checks (some/every)
    const anyFailed = data.some(l => l.success === false);
    const everyHasName = data.every(l => typeof l.name === "string" && l.name.length > 0);
    print("Finns det misslyckade launches? (some)", anyFailed);
    print("Har alla ett namn? (every)", everyHasName);

    // 3.1) Första 5 launch-namn i alfabetisk ordning (sort + slice)
    const firstFiveNamesAlpha = [...data.map(l => l.name)]
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 5);
    print("Första 5 launch-namn (alfabetiskt)", firstFiveNamesAlpha);

    // 3.2) Alla launches som tillhör GIVEN_CATEGORY (filter), skriv "name — category"
    const inCategory = data.filter(
      l => (l.rocketName || "").toLowerCase() === GIVEN_CATEGORY.toLowerCase()
    );
    print(`Alla launches i kategori "${GIVEN_CATEGORY}" (name — category)`, "");
    inCategory.forEach(l => console.log(`• ${l.name} — ${l.rocketName}`));

    // 3.3) Objekt som räknar hur många launches per kategori (reduce)
    // Kategori = rocketName
    const launchesPerRocket = data.reduce((acc, l) => {
      const k = l.rocketName || "Unknown";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    print("Antal launches per raket (kategori)", launchesPerRocket);

    // --- Stretch goals (VG) ---

    // 4.1) groupBy: efter rocketName och efter år
    const byRocket = groupBy(data, "rocketName");
    const byYear = groupBy(data, l => l.year);
    print("groupBy rocketName → nycklar (förhandsvisning)", Object.keys(byRocket).slice(0, 5));
    print("groupBy år → nycklar (förhandsvisning)", Object.keys(byYear).slice(0, 5));

    // 4.2) Select & reshape: kompakta sammanfattningar
    // Liknar { id, name, category, ingredients: [...] } från uppgiften.
    // Här: payloads motsvarar “ingredients”-listan (ID:er räcker för demo).
    const summaries = data.map(l => ({
      id: l.id,
      name: l.name,
      category: l.rocketName,   // “kategori”
      payloads: l.payloads,     // lista av payload-ID:n
      meta: {
        date: l.dateUtc,
        year: l.year,
        success: l.success,
        upcoming: l.upcoming,
      }
    }));
    print("Kompakta sammanfattningar (3 st)", summaries.slice(0, 3));

    // 4.3) Frequency map över “ingredienser”
    // Ex 1: Failure reasons över alla launches (flatMap + reduce)
    const failureReasons = data.flatMap(l => l.failures); // redan strängar
    const failureFrequency = frequency(failureReasons);
    print("Frekvens av failure reasons (flatMap + reduce)", failureFrequency);

    // Ex 2 (bonus): frekvens på booster-cores (återanvändning över flera flights)
    const allCores = data.flatMap(l => l.cores); // lista av core-ID:n
    const coreFrequency = frequency(allCores);
    const top5Cores = Object.entries(coreFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([coreId, count]) => `${coreId}: ${count}`);
    print("Topp 5 mest använda cores", top5Cores);

  } catch (err) {
    console.error("❌ Misslyckades att hämta/bearbeta SpaceX-data:", err);
  } finally {
    console.groupEnd();
  }
})();
