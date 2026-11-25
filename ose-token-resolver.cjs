const fs = require("fs");
const path = require("path");

const MOD_DIR = "C:/Users/justi/AppData/Local/FoundryVTT-Gygax75/Data/modules/fade-compendiums-tokens";

function norm(s) {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const OSE_SYNONYMS = {
  "acolyte": "Commoner",
  "fire beetle": "Giant Fire Beetle",
  "oil beetle": "Giant Fire Beetle",
  "tiger beetle": "Giant Fire Beetle",
  "brigand": "Bandit",
  "carcass crawler": "Carrion Crawler",
  "sabre-toothed tiger": "Saber-Toothed Tiger",
  "cave locust": "Giant Wasp",
  "conjured snake": "Poisonous Snake",
  "giant crocodile": "Crocodile",
  "black dragon": "Young Black Dragon",
  "blue dragon": "Young Blue Dragon",
  "gold dragon": "Young Gold Dragon",
  "green dragon": "Young Green Dragon",
  "red dragon": "Young Red Dragon",
  "white dragon": "Young White Dragon",
  "sea dragon": "Dragon Turtle",
  "sea serpent": "Dragon Turtle",
  "driver ant": "Ant, Giant",
  "eefreeti": "Efreeti",
  "efreeti": "Efreeti",
  "djinni": "Djinni",
  "giant bass": "Fish, Giant",
  "giant catfish": "Fish, Giant",
  "giant piranha": "Fish, Giant",
  "giant rockfish": "Fish, Giant",
  "giant sturgeon": "Fish, Giant",
  "giant electric eel": "Fish, Giant",
  "giant pike": "Fish, Giant",
  "giant swordfish": "Fish, Giant",
  "gnome bodyguard": "Deep Gnome",
  "gnome chieftain": "Deep Gnome",
  "gnome leader": "Deep Gnome",
  "goblin bodyguard": "Goblin",
  "grey ooze": "Gray Ooze",
  "giant hawk": "Giant Eagle",
  "normal hawk": "Giant Eagle",
  "hawk, giant": "Giant Eagle",
  "hawk, normal": "Giant Eagle",
  "large herd animal": "Elk",
  "medium herd animal": "Elk",
  "small herd animal": "Elk",
  "herd animal": "Elk",
  "hobgoblin bodyguard": "Hobgoblin",
  "wild horse": "Riding Horse",
  "holy charger": "Warhorse",
  "hunting dog": "Canine/Dog",
  "war dog": "Canine/Dog",
  "wild dog": "Canine/Dog",
  "huge war dogs": "Canine/Dog",
  "insect swarm": "Swarm of Insects",
  "killer bee guard": "Giant Wasp",
  "killer bee queen": "Giant Wasp",
  "killer bee": "Giant Wasp",
  "kobold bodyguard": "Kobold",
  "kobold chieftan": "Kobold",
  "draco": "Giant Lizard",
  "gecko": "Giant Lizard",
  "horned chameleon": "Giant Lizard",
  "tuatara": "Giant Lizard",
  "flame lizard": "Giant Lizard",
  "giant gecko lizard": "Giant Lizard",
  "mastodon": "Mammoth",
  "medium": "Noble",
  "merchant": "Commoner",
  "trader": "Commoner",
  "neanderthal leader": "Neanderthal",
  "caveman": "Neanderthal",
  "nomad": "Tribal Warrior",
  "octopus, giant": "Devilfish",
  "giant octopus": "Devilfish",
  "squid, giant": "Devilfish",
  "giant squid": "Devilfish",
  "orc leader": "Orc",
  "owl bear": "Owlbear",
  "pirate": "Humans/Buccaneer",
  "normal rhinoceros": "Dinosaur/Medium Herbivore",
  "woolly rhinoceros": "Dinosaur/Medium Herbivore",
  "titanothere": "Dinosaur/Large Herbivore",
  "stegosaurus": "Dinosaur/Ankylosaurus",
  "scorpion, giant": "Scorpion",
  "giant scorpion": "Scorpion",
  "giant rattler": "Giant Poisonous Snake",
  "pit viper": "Poisonous Snake",
  "rock python": "Constrictor Snake",
  "sea snake": "Poisonous Snake",
  "spitting cobra": "Poisonous Snake",
  "cobra snake": "Poisonous Snake",
  "hooded cobra": "Poisonous Snake",
  "black widow": "Giant Spider",
  "black widow spider": "Giant Spider",
  "crab spider": "Giant Spider",
  "tarantella": "Giant Spider",
  "huge tarantula": "Giant Spider",
  "huge tarantula swarm": "Giant Spider",
  "tornado": "Air Elemental",
  "vampire": "Vampire Spawn",
  "veteran": "Thug",
  "warp beast": "Displacer Beast",
  "freshwater termite": "Termite, Water",
  "saltwater termite": "Termite, Water",
  "swamp termite": "Termite, Water",
  "narwhal": "Killer Whale",
  "yellow mould": "Ochre Jelly",
  "brown mould": "Ochre Jelly",
  "animated tree": "Awakened Tree",
  "eye of terror": "Beholder",
  "eye of the deep": "Beholder",
  "flame salamander": "Salamander",
  "frost salamander": "Salamander",
  "giant shrew": "Giant Rat",
  "gray wolf": "Canine/Wolf",
  "grey wolf": "Canine/Wolf",
  "wooden mannequin": "Animated Armor",
  "archer bush": "Vine Blight",
  "vampire roses": "Vine Blight",
  "ghostly mob": "Ghost",
  "shadow demon": "Shadow"
};

const SPECIES_FALLBACK_RULES = [
  { re: /\bhobgoblin\b.*\b(king|chief|chieftain|captain|leader|sub-chief)\b/i, folder: "Hobgoblin Captain" },
  { re: /\bhobgoblin\b/i, folder: "Hobgoblin" },
  { re: /\bgoblin\b.*\b(king|chief|chieftain|boss|leader|sub-chief)\b/i, folder: "Goblin Boss" },
  { re: /\bgoblin\b/i, folder: "Goblin" },
  { re: /\borc\b.*\b(king|chief|chieftain|war chief|leader|sub-chief)\b/i, folder: "Orc War Chief" },
  { re: /\borc\b/i, folder: "Orc" },
  { re: /\bgnoll\b.*\b(king|chief|chieftain|pack lord|leader|sub-chief)\b/i, folder: "Gnoll Pack Lord" },
  { re: /\bgnoll\b/i, folder: "Gnoll" },
  { re: /\bbugbear\b/i, folder: "Bugbear" },
  { re: /\bkobold\b/i, folder: "Kobold" },
  { re: /\bogre\b/i, folder: "Ogre" },
  { re: /\btroll\b/i, folder: "Troll" },
  { re: /\bminotaur\b/i, folder: "Minotaur" },
  { re: /\blizard\s*(man|men|folk)\b/i, folder: "Lizardfolk" },
  { re: /\btroglodyte\b/i, folder: "Troglodyte" },
  { re: /\b(skeleton|skeletal)\b/i, folder: "Skeleton" },
  { re: /\bzombie\b/i, folder: "Zombie" },
  { re: /\bwight\b/i, folder: "Wight" },
  { re: /\bwraith\b/i, folder: "Wraith" },
  { re: /\bghoul\b/i, folder: "Ghoul" },
  { re: /\bmummy\b/i, folder: "Mummy" },
  { re: /\bbanshee\b/i, folder: "Banshee" },
  { re: /\bmedusa\b/i, folder: "Medusa" },
  { re: /\bspectre\b|\bspecter\b/i, folder: "Specter" },
  { re: /\bwerewolf\b/i, folder: "Lycanthropes/Werewolf" },
  { re: /\bwererat\b/i, folder: "Lycanthropes/Wererat" },
  { re: /\bwereboar\b/i, folder: "Lycanthropes/Wereboar" },
  { re: /\bweretiger\b/i, folder: "Lycanthropes/Weretiger" },
  { re: /\bwerebear\b/i, folder: "Lycanthropes/Werebear" },
  { re: /\b(bandit|brigand|outlaw|highwayman|raider)\b/i, folder: "Bandit" },
  { re: /\bberserker\b/i, folder: "Berserker" },
  { re: /\b(pirate|buccaneer|corsair)\b/i, folder: "Humans/Buccaneer" },
  { re: /\bdervish\b/i, folder: "Humans/Dervish" },
  { re: /\b(nomad|tribal warrior)\b/i, folder: "Tribal Warrior" },
  { re: /\bneanderthal\b|\bcaveman\b/i, folder: "Neanderthal" },
  { re: /\b(guardsmen|guard|men-at-arms|crossbowmen|soldiers|corporal|sergeant|captain of the guard|escort|mercenary|warrior maiden)\b/i, folder: "Thug" },
  { re: /\b(castellan|bailiff|guild master|banker|curate|noble)\b/i, folder: "Noble" },
  { re: /\b(stable boy|blacksmith|servants|wife|clerk|cookie|patrons|scribe|assistants|provisioner|son|slave girl|acolytes|assistant)\b/i, folder: "Commoner" }
];

function createFadeTokenResolver(modDir = MOD_DIR) {
  const fadeMap = JSON.parse(fs.readFileSync(path.join(modDir, "map-fantastic-depths.json"), "utf8"))["fade-compendiums.actor-compendium"];
  const aliases = JSON.parse(fs.readFileSync(path.join(modDir, "aliases.json"), "utf8"));

  function scanAssets(dir, rel = "") {
    const results = {};
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries.filter(e => e.isFile() && e.name.endsWith(".webp")).map(e => e.name).sort();
    if (files.length > 0) {
      let tokenSrc = `modules/fade-compendiums-tokens/assets/${rel}/*.webp`;
      let actorSrc = `modules/fade-compendiums-tokens/assets/${rel}/${files[0]}`;
      for (const v of Object.values(fadeMap)) {
        if (v.actor && v.actor.startsWith(`modules/fade-compendiums-tokens/assets/${rel}/`)) {
          actorSrc = v.actor;
          break;
        }
      }
      results[rel] = { folder: rel, actor: actorSrc, tokenSrc, count: files.length };
    }
    for (const e of entries.filter(e => e.isDirectory())) {
      Object.assign(results, scanAssets(path.join(dir, e.name), rel ? `${rel}/${e.name}` : e.name));
    }
    return results;
  }

  const folderInfo = scanAssets(path.join(modDir, "assets"));
  const lookup = {};

  for (const f of Object.keys(folderInfo)) {
    lookup[norm(f)] = f;
    const leaf = f.split("/").pop();
    if (!lookup[norm(leaf)]) lookup[norm(leaf)] = f;
    const parts = f.split("/");
    if (parts.length === 2) {
      const p0 = parts[0].replace(/s$/i, "");
      lookup[norm(`${parts[1]} ${p0}`)] = f;
      lookup[norm(`${p0}, ${parts[1]}`)] = f;
      if (["Lycanthropes", "Canine", "Dinosaur", "Humans"].includes(parts[0])) {
        lookup[norm(parts[1])] = f;
      }
    }
  }

  for (const [k, v] of Object.entries(aliases)) {
    const nk = norm(k);
    lookup[nk] = v;
    const nNoParen = nk.replace(/\s*\([^)]*\)/g, "").trim();
    if (nNoParen && !lookup[nNoParen]) lookup[nNoParen] = v;
    const m = nk.match(/^([^,]+),\s*(.+)$/);
    if (m) {
      lookup[`${m[2]} ${m[1]}`] = v;
      const m2NoParen = `${m[2]} ${m[1]}`.replace(/\s*\([^)]*\)/g, "").trim();
      if (m2NoParen && !lookup[m2NoParen]) lookup[m2NoParen] = v;
    }
  }

  for (const [k, v] of Object.entries(OSE_SYNONYMS)) {
    lookup[norm(k)] = v;
  }

  function resolve(creatureName, { allowSpeciesFallback = false } = {}) {
    if (!creatureName) return null;
    const n = norm(creatureName);
    let folder = lookup[n];
    if (!folder) {
      const n2 = n.replace(/\s+[a-c]$/, "");
      folder = lookup[n2];
      if (!folder) {
        const n3 = n2.replace(/\s*\([^)]*\)/g, "").trim();
        folder = lookup[n3];
        if (!folder) {
          const m = n3.match(/^([^,]+),\s*(.+)$/);
          if (m) {
            const flipped = `${m[2]} ${m[1]}`.trim();
            folder = lookup[flipped] || lookup[m[1].trim()];
          }
        }
      }
    }
    if (!folder && allowSpeciesFallback) {
      for (const rule of SPECIES_FALLBACK_RULES) {
        if (rule.re.test(creatureName)) {
          folder = rule.folder;
          break;
        }
      }
    }
    if (!folder || !folderInfo[folder]) return null;
    return folderInfo[folder];
  }

  return { folderInfo, lookup, resolve, fadeMap };
}

if (require.main === module) {
  const resolver = createFadeTokenResolver();

  function loadJsonDir(dir) {
    let res = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) res = res.concat(loadJsonDir(p));
      else if (e.name.endsWith(".json")) {
        const d = JSON.parse(fs.readFileSync(p, "utf8"));
        if (d.type === "monster" || d.type === "character") res.push(d);
      }
    }
    return res;
  }

  const cfMonsters = loadJsonDir("C:/Users/justi/AppData/Local/FoundryVTT-Gygax75/Data/modules/classicfantasycompendium/packs/_source/monsters");
  const afMonsters = loadJsonDir("C:/Users/justi/AppData/Local/FoundryVTT-Gygax75/Data/modules/ose-advancedfantasytome/packs/_source/monsters");
  const afAnimals = loadJsonDir("C:/Users/justi/AppData/Local/FoundryVTT-Gygax75/Data/modules/ose-advancedfantasytome/packs/_source/animals");

  const mapOse = {
    "classicfantasycompendium.monsters": {},
    "ose-advancedfantasytome.monsters": {},
    "ose-advancedfantasytome.animals": {},
    "fade-compendiums.actor-compendium": resolver.fadeMap
  };

  let cfCount = 0, afCount = 0, afAnimCount = 0;

  // 1. Classic Fantasy Compendium (257 monsters with generic icons -> set BOTH actor portrait & wildcard token)
  for (const m of cfMonsters) {
    const info = resolver.resolve(m.name);
    if (info) {
      mapOse["classicfantasycompendium.monsters"][m._id] = {
        actor: info.actor,
        token: {
          randomImg: true,
          texture: {
            src: info.tokenSrc
          }
        }
      };
      cfCount++;
    }
  }

  // 2. OSE Advanced Fantasy Tome Monsters (Hybrid: preserve OSE book portrait in `actor`, set wildcard token in `token`)
  for (const m of afMonsters) {
    const info = resolver.resolve(m.name);
    if (info) {
      mapOse["ose-advancedfantasytome.monsters"][m._id] = {
        actor: m.img,
        token: {
          randomImg: true,
          texture: {
            src: info.tokenSrc
          }
        }
      };
      afCount++;
    }
  }

  // 3. OSE Advanced Fantasy Tome Animals (Hybrid: preserve OSE book portrait in `actor`, set wildcard token in `token`)
  for (const a of afAnimals) {
    const info = resolver.resolve(a.name);
    if (info) {
      mapOse["ose-advancedfantasytome.animals"][a._id] = {
        actor: a.img,
        token: {
          randomImg: true,
          texture: {
            src: info.tokenSrc
          }
        }
      };
      afAnimCount++;
    }
  }

  const mapOsePath = path.join(MOD_DIR, "map-ose.json");
  fs.writeFileSync(mapOsePath, JSON.stringify(mapOse, null, 2), "utf8");

  // Also write ose-fade-index.json for Python pdf-to-foundry consumption
  const pyIndex = {
    folders: resolver.folderInfo,
    lookup: resolver.lookup
  };
  fs.writeFileSync(path.join(MOD_DIR, "ose-fade-index.json"), JSON.stringify(pyIndex, null, 2), "utf8");

  console.log(`Generated ${mapOsePath}:`);
  console.log(`  - classicfantasycompendium.monsters: ${cfCount}/${cfMonsters.length}`);
  console.log(`  - ose-advancedfantasytome.monsters:  ${afCount}/${afMonsters.length}`);
  console.log(`  - ose-advancedfantasytome.animals:   ${afAnimCount}/${afAnimals.length}`);
  console.log(`  - fade-compendiums.actor-compendium: ${Object.keys(resolver.fadeMap).length}`);
}

module.exports = { createFadeTokenResolver };
