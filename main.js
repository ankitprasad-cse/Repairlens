/**
 * RepairLens — Core MVP Logic
 * Concept-based natural language classification & Repair-vs-Replace decision engine.
 */

// -------------------------------------------------------------
// 1. Comprehensive Product Catalog & Multi-Concept Rules
// -------------------------------------------------------------
const PRODUCT_CATALOG = [
  {
    id: 'laptop',
    name: 'Laptop Computer',
    category: 'Computers',
    primaryKeywords: ['laptop', 'notebook', 'macbook', 'thinkpad', 'ultrabook', 'chromebook'],
    replaceCostRange: [35000, 65000],
    issueRules: [
      {
        id: 'laptop_liquid_board_damage',
        severity: 5,
        forceReplace: true,
        conceptGroups: [
          ['water', 'liquid', 'soaked', 'soak', 'spill', 'spilled', 'spilling', 'wet', 'drowned', 'drench', 'drenched', 'coffee', 'tea', 'corrosion', 'corroded'],
          ['motherboard', 'board', 'dead', 'died', 'short', 'fried', 'wont turn on', 'not turning on', 'no power', 'died completely', 'killed', 'power on', 'doesnt power on', 'wont power']
        ],
        issue: 'Severe liquid ingress causing multi-rail motherboard short circuit and component corrosion.',
        repairMethod: 'Full logic board replacement or ultrasonic BGA micro-soldering. High recurrence failure risk.',
        difficulty: 'High Complexity / Hazardous',
        repairCostRange: [22000, 32000]
      },
      {
        id: 'laptop_thermal_throttling',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['overheating', 'overheat', 'heating', 'hot', 'thermal', 'fan', 'noisy', 'loud fan', 'throttling', 'shutting down', 'cooling', 'dust', 'clogged', 'clog']
        ],
        issue: 'Dried thermal paste on CPU/GPU heatpipes and dust-clogged exhaust radiator.',
        repairMethod: 'Disassemble heatsink, clean fan blower, and apply high-grade non-conductive thermal paste.',
        difficulty: 'Moderate Fix',
        repairCostRange: [600, 1200]
      },
      {
        id: 'laptop_hinge_body',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['hinge', 'screen frame', 'lid', 'body cracked', 'bezel', 'casing', 'open close', 'chassis']
        ],
        issue: 'Stripped brass anchor bushings from plastic palmrest/chassis housing.',
        repairMethod: 'Re-anchor brass screw bushings using structural epoxy resin or replace palmrest frame.',
        difficulty: 'Moderate Fix',
        repairCostRange: [800, 1600]
      },
      {
        id: 'laptop_battery_degraded',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['battery', 'backup', 'drain', 'draining', 'charge hold', 'swollen', 'unplugged', 'drains fast', 'fast drain']
        ],
        issue: 'Internal lithium-polymer battery wear past rated cycle lifespan.',
        repairMethod: 'Safe battery disconnection and replacement with an OEM-spec battery pack.',
        difficulty: 'Easy Fix',
        repairCostRange: [2200, 4200]
      }
    ],
    fallbackIssue: {
      issue: 'Internal hardware or power distribution fault.',
      repairMethod: 'Perform hardware diagnostic testing and inspect DC power rail continuity.',
      difficulty: 'Moderate Fix',
      repairCostRange: [1200, 2500]
    }
  },
  {
    id: 'bicycle',
    name: 'Bicycle',
    category: 'Mobility & Sports',
    primaryKeywords: ['bicycle', 'bike', 'cycle', 'cycle frame', 'mtb', 'road bike'],
    replaceCostRange: [7000, 16000],
    issueRules: [
      {
        id: 'bike_structural_damage',
        severity: 5,
        forceReplace: true,
        conceptGroups: [
          ['frame', 'fork', 'forks', 'chassis', 'tube', 'tubing', 'handlebar stem', 'body', 'structural'],
          ['crack', 'cracked', 'cracking', 'bent', 'bend', 'bending', 'break', 'broke', 'broken', 'snapped', 'fractured', 'fracture', 'accident', 'crash', 'crashed', 'collision', 'hit', 'heavy damage', 'badly damaged']
        ],
        issue: 'Severe structural fracture or geometry misalignment in frame/fork tubing.',
        repairMethod: 'Frame welding or structural alignment compromises rider safety. Frame/fork replacement required.',
        difficulty: 'High Risk / Severe',
        repairCostRange: [4500, 7500]
      },
      {
        id: 'bike_drivetrain_chain',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['chain', 'gear', 'gears', 'slipping', 'slip', 'slips', 'skipping', 'skip', 'derailleur', 'shifting', 'pedal', 'pedaling', 'cog', 'freewheel', 'crank', 'chain slipping']
        ],
        issue: 'Stretched drive chain, misaligned derailleur limit screws, or worn cassette cogs.',
        repairMethod: 'Degrease drivetrain, adjust derailleur cable indexing, or install replacement chain links.',
        difficulty: 'Easy Fix',
        repairCostRange: [200, 550]
      },
      {
        id: 'bike_brakes',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['brake', 'brakes', 'stopping', 'lever', 'squeak', 'squeaking', 'squeal', 'squealing', 'pad', 'pads', 'cable', 'wire']
        ],
        issue: 'Worn friction rubber brake pads or stretched stainless steel brake cables.',
        repairMethod: 'Replace brake shoes/discs and re-tension the mechanical brake wire.',
        difficulty: 'Easy Fix',
        repairCostRange: [150, 400]
      }
    ],
    fallbackIssue: {
      issue: 'Mechanical drivetrain wear or cable slack.',
      repairMethod: 'Tune gear shifting, tighten loose hardware, and lubricate drivetrain bearings.',
      difficulty: 'Easy Fix',
      repairCostRange: [250, 600]
    }
  },
  {
    id: 'table_fan',
    name: 'Table / Desk Fan',
    category: 'Small Appliance',
    primaryKeywords: ['table fan', 'desk fan', 'small fan', 'portable fan', 'pedestal fan', 'standing fan', 'fan'],
    replaceCostRange: [1500, 2600],
    issueRules: [
      {
        id: 'fan_motor_burnt',
        severity: 4,
        forceReplace: false,
        conceptGroups: [
          ['burnt', 'smoke', 'smell', 'spark', 'coil', 'winding', 'dead completely', 'wont turn on', 'not turning on']
        ],
        issue: 'Burned stator copper winding or open thermal cutoff fuse.',
        repairMethod: 'Stator rewinding with insulated copper wire or motor sub-assembly replacement.',
        difficulty: 'Moderate Fix',
        repairCostRange: [450, 850]
      },
      {
        id: 'fan_slow_bearing_capacitor',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['slow', 'hum', 'humming', 'buzz', 'buzzing', 'jammed', 'stuck', 'stopping', 'stopped', 'bearing', 'capacitor', 'blade', 'spin', 'spinning', 'oil', 'lubrication']
        ],
        issue: 'Dry rotor sleeve bearings or degraded 2.0–2.5µF starter capacitor.',
        repairMethod: 'Clean dust buildup from rotor shaft, apply SAE-20 machine oil, and solder new capacitor.',
        difficulty: 'Easy Fix',
        repairCostRange: [200, 450]
      }
    ],
    fallbackIssue: {
      issue: 'Bearing resistance or power delivery issue to the motor.',
      repairMethod: 'Clean shaft housing, lubricate bearings, and inspect wire terminals.',
      difficulty: 'Easy Fix',
      repairCostRange: [250, 500]
    }
  },
  {
    id: 'ceiling_fan',
    name: 'Ceiling Fan',
    category: 'Home Appliance',
    primaryKeywords: ['ceiling fan', 'roof fan'],
    replaceCostRange: [2200, 3800],
    issueRules: [
      {
        id: 'ceiling_fan_slow_capacitor',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['slow', 'speed', 'capacitor', 'hum', 'humming', 'regulator', 'not fast']
        ],
        issue: 'Weak starter capacitor or degraded wall regulator speed controller.',
        repairMethod: 'Replace the 2.5µF ceiling fan capacitor or swap the triac speed switch.',
        difficulty: 'Easy Fix',
        repairCostRange: [150, 350]
      },
      {
        id: 'ceiling_fan_wobble_bearing',
        severity: 3,
        forceReplace: false,
        conceptGroups: [
          ['wobble', 'wobbling', 'shaking', 'noise', 'creak', 'bearing', 'grinding', 'blade bend']
        ],
        issue: 'Worn sealed ball bearings (6201/6202) or unweighted fan blade misalignment.',
        repairMethod: 'Rebalance blades with counterweights and press-fit replacement ball bearings.',
        difficulty: 'Moderate Fix',
        repairCostRange: [400, 750]
      }
    ],
    fallbackIssue: {
      issue: 'Capacitor degradation or motor bearing friction.',
      repairMethod: 'Replace starter capacitor and grease rotor bearing assemblies.',
      difficulty: 'Easy Fix',
      repairCostRange: [250, 550]
    }
  },
  {
    id: 'mixer',
    name: 'Mixer / Grinder',
    category: 'Kitchen Appliance',
    primaryKeywords: ['mixer', 'grinder', 'blender', 'mixie', 'juicer'],
    replaceCostRange: [2400, 4500],
    issueRules: [
      {
        id: 'mixer_coupler_blade',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['coupler', 'teeth', 'jar', 'blade', 'leak', 'spinning loose', 'rubber', 'broken coupler', 'plastic tooth']
        ],
        issue: 'Stripped drive coupler teeth or worn jar brass bush seal.',
        repairMethod: 'Unthread damaged rubber drive coupler and install replacement coupler and jar seal.',
        difficulty: 'Easy Fix',
        repairCostRange: [150, 350]
      },
      {
        id: 'mixer_overload_trip',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['trip', 'tripped', 'red button', 'overload', 'stops suddenly', 'shut off']
        ],
        issue: 'Tripped bi-metal thermal overload protection relay (CB switch).',
        repairMethod: 'Allow motor cooling and reset or replace faulty 2.7A overload switch.',
        difficulty: 'Easy Fix',
        repairCostRange: [120, 250]
      },
      {
        id: 'mixer_motor_spark_brush',
        severity: 3,
        forceReplace: false,
        conceptGroups: [
          ['spark', 'sparking', 'smoke', 'burnt', 'smell', 'carbon brush', 'loud', 'screech']
        ],
        issue: 'Worn carbon brushes or commutator copper bar scoring.',
        repairMethod: 'Replace pair of high-wear carbon brushes and polish motor commutator.',
        difficulty: 'Moderate Fix',
        repairCostRange: [350, 750]
      }
    ],
    fallbackIssue: {
      issue: 'Drive coupler slippage or carbon brush wear.',
      repairMethod: 'Inspect drive coupler and service motor brush contacts.',
      difficulty: 'Easy Fix',
      repairCostRange: [250, 600]
    }
  },
  {
    id: 'cable',
    name: 'Charging / Data Cable',
    category: 'Cables & Accessories',
    primaryKeywords: ['charging cable', 'usb cable', 'type-c cable', 'lightning cable', 'cable', 'cord', 'data cable'],
    replaceCostRange: [250, 600],
    issueRules: [
      {
        id: 'cable_severed_frayed',
        severity: 4,
        forceReplace: true,
        conceptGroups: [
          ['frayed', 'torn', 'cut', 'snapped', 'loose', 'bent', 'neck', 'angle', 'cuts out', 'holding at angle', 'wire exposed', 'tape']
        ],
        issue: 'Fractured internal copper power/data conductors near stress relief boot.',
        repairMethod: 'Temporary heat-shrink wrap is unreliable. Splicing costs exceed new cable replacement.',
        difficulty: 'Difficult Fix',
        repairCostRange: [180, 350]
      }
    ],
    fallbackIssue: {
      issue: 'Fractured internal copper strands near connector boot.',
      repairMethod: 'Replace cable. Splicing low-cost cables poses intermittent power/short risks.',
      difficulty: 'Difficult Fix',
      repairCostRange: [180, 350]
    }
  },
  {
    id: 'charger',
    name: 'Power Adapter / Charger Brick',
    category: 'Electronics',
    primaryKeywords: ['charger', 'adapter', 'power brick', 'fast charger', 'charging block', 'wall adapter', 'power supply'],
    replaceCostRange: [1200, 2400],
    issueRules: [
      {
        id: 'charger_loose_pin',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['loose pin', 'prongs', 'plug', 'pin', 'wall socket', 'bent pin', 'shaking']
        ],
        issue: 'Cold solder joint or fractured connection at AC wall prong terminals.',
        repairMethod: 'Resolder AC terminal contacts and reinforce prong retaining tabs.',
        difficulty: 'Moderate Fix',
        repairCostRange: [180, 380]
      },
      {
        id: 'charger_burnt_internal',
        severity: 5,
        forceReplace: true,
        conceptGroups: [
          ['burnt', 'smoke', 'smell', 'pop', 'spark', 'dead', 'exploded', 'stopped working', 'died']
        ],
        issue: 'Blown high-voltage switching MOSFET or shorted primary filter capacitor.',
        repairMethod: 'Opening ultrasonic-welded plastic housing poses electrical fire hazards. Replace unit.',
        difficulty: 'High Complexity / Hazardous',
        repairCostRange: [750, 1200]
      }
    ],
    fallbackIssue: {
      issue: 'Loose internal contact or degraded output voltage regulator.',
      repairMethod: 'Inspect AC inlet prongs and test output voltage continuity.',
      difficulty: 'Moderate Fix',
      repairCostRange: [250, 500]
    }
  },
  {
    id: 'keyboard',
    name: 'Computer Keyboard',
    category: 'Peripherals',
    primaryKeywords: ['keyboard', 'keycap', 'mechanical keyboard', 'keypad'],
    replaceCostRange: [1800, 4500],
    issueRules: [
      {
        id: 'keyboard_liquid_short',
        severity: 4,
        forceReplace: false,
        conceptGroups: [
          ['water', 'liquid', 'spill', 'spilled', 'coffee', 'tea', 'juice', 'corroded']
        ],
        issue: 'Liquid ingress across membrane traces or PCB controller matrix short.',
        repairMethod: 'Disassemble housing, bathe membrane in 99% isopropyl alcohol, and bridge broken traces.',
        difficulty: 'Difficult Fix',
        repairCostRange: [900, 1800]
      },
      {
        id: 'keyboard_sticky_switch',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['stuck', 'sticky', 'switch', 'spacebar', 'key', 'keys', 'miss', 'double typing', 'chattering', 'unresponsive', 'clicking']
        ],
        issue: 'Oxidized mechanical switch contacts or debris trapped under keycap stabilizers.',
        repairMethod: 'Remove keycaps, flush switch stem with contact cleaner, or desolder and swap individual switches.',
        difficulty: 'Easy Fix',
        repairCostRange: [150, 400]
      }
    ],
    fallbackIssue: {
      issue: 'Switch contact oxidation or dirty stabilizer wire.',
      repairMethod: 'Deep-clean switch stems and reflow cracked solder pads.',
      difficulty: 'Easy Fix',
      repairCostRange: [200, 500]
    }
  },
  {
    id: 'mouse',
    name: 'Computer Mouse',
    category: 'Peripherals',
    primaryKeywords: ['mouse', 'trackball', 'optical mouse', 'gaming mouse'],
    replaceCostRange: [800, 2200],
    issueRules: [
      {
        id: 'mouse_scroll_encoder',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['scroll', 'scrolling', 'wheel', 'jumping', 'jump', 'encoder', 'middle click']
        ],
        issue: 'Dust/lint accumulation inside the rotary mechanical scroll encoder.',
        repairMethod: 'Apply electrical contact cleaner to encoder cavity or solder a replacement 9mm/11mm rotary encoder.',
        difficulty: 'Easy Fix',
        repairCostRange: [100, 250]
      },
      {
        id: 'mouse_click_double',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['click', 'clicking', 'double click', 'double clicking', 'left click', 'right click', 'switch', 'omron']
        ],
        issue: 'Fatigued copper spring leaf in primary microswitch causing signal debounce errors.',
        repairMethod: 'Desolder faulty microswitch and solder fresh subminiature snap-action switch.',
        difficulty: 'Moderate Fix',
        repairCostRange: [150, 300]
      }
    ],
    fallbackIssue: {
      issue: 'Microswitch contact fatigue or wire strain.',
      repairMethod: 'Replace primary button switch and clean optical tracking lens.',
      difficulty: 'Easy Fix',
      repairCostRange: [150, 350]
    }
  },
  {
    id: 'headphones',
    name: 'Headphones / Earbuds',
    category: 'Audio',
    primaryKeywords: ['headphones', 'earphones', 'earbuds', 'headset', 'tws', 'airpods', 'earphone', 'headphone'],
    replaceCostRange: [2000, 5500],
    issueRules: [
      {
        id: 'headphones_one_side_cable',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['one side', 'single side', 'left side', 'right side', 'no sound', 'wire', 'jack', '3.5mm', 'aux', 'angle', 'bending wire']
        ],
        issue: 'Fractured copper wire strand near 3.5mm connector or headband pivot hinge.',
        repairMethod: 'Cut damaged cable segment and solder a replacement 3-pole/4-pole gold-plated audio jack.',
        difficulty: 'Easy Fix',
        repairCostRange: [150, 350]
      },
      {
        id: 'headphones_battery_dead',
        severity: 3,
        forceReplace: false,
        conceptGroups: [
          ['battery', 'drain', 'case not charging', 'case', 'dead bud', 'tws', 'not holding charge']
        ],
        issue: 'Depleted lithium button-cell battery in ultrasonically sealed earbud shell.',
        repairMethod: 'Heat-assisted shell splitting and precision micro-battery replacement.',
        difficulty: 'Difficult Fix',
        repairCostRange: [800, 1600]
      }
    ],
    fallbackIssue: {
      issue: 'Audio jack contact oxidation or driver mesh clogging.',
      repairMethod: 'Clean acoustic driver ports and resolder loose cable terminals.',
      difficulty: 'Easy Fix',
      repairCostRange: [200, 450]
    }
  },
  {
    id: 'speaker',
    name: 'Bluetooth / Audio Speaker',
    category: 'Audio',
    primaryKeywords: ['speaker', 'bluetooth speaker', 'soundbar', 'woofer', 'audio speaker'],
    replaceCostRange: [2200, 5000],
    issueRules: [
      {
        id: 'speaker_charging_port',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['port', 'charging port', 'loose', 'usb', 'type-c', 'wont charge', 'pin loose', 'socket']
        ],
        issue: 'Fractured solder pads or broken center tongue in USB charging connector.',
        repairMethod: 'Resolder replacement surface-mount USB port with jumper wire reinforcement.',
        difficulty: 'Moderate Fix',
        repairCostRange: [250, 500]
      },
      {
        id: 'speaker_sound_distortion',
        severity: 3,
        forceReplace: false,
        conceptGroups: [
          ['distortion', 'distorted', 'buzz', 'buzzing', 'crackling', 'rattle', 'blown', 'cone', 'teared', 'muffled']
        ],
        issue: 'Torn passive radiator rubber surround or overheated driver voice coil.',
        repairMethod: 'Patch diaphragm surround with flexible silicone or swap replacement 40mm driver.',
        difficulty: 'Moderate Fix',
        repairCostRange: [400, 800]
      }
    ],
    fallbackIssue: {
      issue: 'Battery degradation or charging socket contact failure.',
      repairMethod: 'Replace internal lithium battery cell or repair charging interface.',
      difficulty: 'Moderate Fix',
      repairCostRange: [350, 700]
    }
  },
  {
    id: 'chair',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    primaryKeywords: ['office chair', 'desk chair', 'chair', 'gaming chair', 'ergonomic chair'],
    replaceCostRange: [5500, 12000],
    issueRules: [
      {
        id: 'chair_sinking_cylinder',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['sink', 'sinks', 'sinking', 'height', 'hydraulic', 'gas lift', 'cylinder', 'dropping', 'goes down', 'lowest']
        ],
        issue: 'Degraded internal pressure seal in the Class-4 pneumatic gas cylinder.',
        repairMethod: 'Dislodge old cylinder from base using pipe wrench and install universal Class-4 replacement.',
        difficulty: 'Moderate Fix',
        repairCostRange: [650, 1100]
      },
      {
        id: 'chair_caster_wheel',
        severity: 1,
        forceReplace: false,
        conceptGroups: [
          ['wheel', 'wheels', 'caster', 'casters', 'rolling', 'stuck wheel', 'broken wheel', 'floor']
        ],
        issue: 'Cracked polyurethane caster housing or debris wound around wheel axle.',
        repairMethod: 'Pull out friction-stem casters and push in replacement heavy-duty rollerblade wheels.',
        difficulty: 'Easy Fix',
        repairCostRange: [300, 600]
      }
    ],
    fallbackIssue: {
      issue: 'Gas cylinder seal wear or loose structural bolts.',
      repairMethod: 'Replace hydraulic cylinder and tighten recline mechanism bolts.',
      difficulty: 'Moderate Fix',
      repairCostRange: [600, 1000]
    }
  },
  {
    id: 'phone',
    name: 'Smartphone / Mobile Phone',
    category: 'Electronics',
    primaryKeywords: ['phone', 'smartphone', 'mobile', 'iphone', 'android', 'handset'],
    replaceCostRange: [14000, 30000],
    issueRules: [
      {
        id: 'phone_severe_liquid_board',
        severity: 5,
        forceReplace: true,
        conceptGroups: [
          ['water', 'liquid', 'pool', 'toilet', 'soaked', 'drowned', 'drench', 'wet'],
          ['dead', 'died', 'motherboard', 'board', 'short', 'screen and board', 'wont turn on', 'not turning on']
        ],
        issue: 'Extensive liquid corrosion across power management IC and display connector.',
        repairMethod: 'Simultaneous logic board micro-soldering and screen replacement exceeds viable economics.',
        difficulty: 'High Complexity / Hazardous',
        repairCostRange: [11000, 18000]
      },
      {
        id: 'phone_battery_drain',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['battery', 'drain', 'draining', 'fast drain', 'backup', 'charge hold', 'swollen', 'dying at 20%', 'backup poor', 'drains fast']
        ],
        issue: 'Chemical depletion of lithium-polymer battery past rated charge cycle life.',
        repairMethod: 'Remove back adhesive panel and install OEM-spec high-capacity replacement battery.',
        difficulty: 'Moderate Fix',
        repairCostRange: [1100, 2200]
      },
      {
        id: 'phone_charging_port',
        severity: 2,
        forceReplace: false,
        conceptGroups: [
          ['port', 'charging port', 'loose cable', 'loose', 'usb', 'type-c', 'not charging', 'pin broken']
        ],
        issue: 'Compacted debris or damaged sub-board USB charging pin array.',
        repairMethod: 'Anti-static cleaning of connector cavity or replacement of modular daughterboard.',
        difficulty: 'Easy Fix',
        repairCostRange: [400, 900]
      }
    ],
    fallbackIssue: {
      issue: 'Battery degradation or charging sub-board wear.',
      repairMethod: 'Replace daughterboard or install fresh battery module.',
      difficulty: 'Moderate Fix',
      repairCostRange: [800, 1800]
    }
  }
];

const GENERIC_PRODUCT_PROFILE = {
  id: 'generic_item',
  name: 'General Inspected Item',
  category: 'Household / Utility',
  replaceCostRange: [1800, 3500],
  fallbackIssue: {
    issue: 'Mechanical wear, loose internal fasteners, or electrical contact oxidation.',
    repairMethod: 'Disassemble housing, inspect component continuity, and service worn parts.',
    difficulty: 'Moderate Fix',
    repairCostRange: [350, 700]
  }
};

// -------------------------------------------------------------
// 2. Application State & DOM Bindings
// -------------------------------------------------------------
const state = {
  selectedFile: null,
  activePreset: null
};

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const dropPrompt = document.getElementById('dropPrompt');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');
const problemDesc = document.getElementById('problemDescription');
const analyzeBtn = document.getElementById('analyzeBtn');
const presetChips = document.querySelectorAll('.chip');
const errorBanner = document.getElementById('errorBanner');
const errorMessage = document.getElementById('errorMessage');
const dismissErrorBtn = document.getElementById('dismissErrorBtn');

const inputScreen = document.getElementById('inputScreen');
const loadingScreen = document.getElementById('loadingScreen');
const resultScreen = document.getElementById('resultScreen');
const loadingStage = document.getElementById('loadingStage');
const resetBtn = document.getElementById('resetBtn');

// -------------------------------------------------------------
// 3. Robust Classification & Decision Engine
// -------------------------------------------------------------

function normalizeText(str) {
  return (str || '')
    .toLowerCase()
    .replace(/['’]/g, '') // normalizes won't -> wont, doesn't -> doesnt
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks whole-word / token boundaries and common inflectional suffixes.
 */
function matchConceptTerm(cleanText, term) {
  const cleanTerm = normalizeText(term);
  if (!cleanTerm) return false;

  const escaped = cleanTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  // Handle multi-word vs single-word boundary checks
  const pattern = cleanTerm.includes(' ')
    ? `(?:^|\\s)${escaped}(?:\\s|$)`
    : `(?:^|\\s)${escaped}(?:s|es|ed|ing)?(?:\\s|$)`;

  const regex = new RegExp(pattern, 'i');
  return regex.test(cleanText);
}

/**
 * Step 1: Identifies the product independently before evaluating damage.
 * Dynamically resolves compound nouns (e.g., "laptop charger" -> charger)
 * using token positional adjacency across PRODUCT_CATALOG keywords.
 */
function findProductProfile(text, presetKey) {
  const cleanText = normalizeText(text);

  if (cleanText) {
    const tokens = cleanText.split(' ').filter(Boolean);
    const matches = [];

    // 1. Scan token stream to locate all product primaryKeyword matches
    for (const product of PRODUCT_CATALOG) {
      for (const kw of product.primaryKeywords) {
        const kwTokens = normalizeText(kw).split(' ').filter(Boolean);
        const kwLen = kwTokens.length;
        if (kwLen === 0) continue;

        for (let i = 0; i <= tokens.length - kwLen; i++) {
          const sliceText = tokens.slice(i, i + kwLen).join(' ');
          if (matchConceptTerm(sliceText, kw)) {
            matches.push({
              product,
              keyword: kw,
              startIndex: i,
              endIndex: i + kwLen - 1,
              wordCount: kwLen
            });
          }
        }
      }
    }

    if (matches.length > 0) {
      // 2. Score matches based on specificity and positional relationship
      const productScores = new Map();

      for (const m of matches) {
        let score = m.wordCount * 25;

        // Evaluate positional adjacency against other competing product matches
        for (const other of matches) {
          if (other.product.id === m.product.id) continue;

          // Case A: Another product immediately precedes this match (e.g. "laptop" -> "charger")
          // In English compound nouns, the trailing noun is the head noun (the true object).
          if (other.endIndex + 1 === m.startIndex) {
            score += 50; // Head noun boost
          }

          // Case B: This match immediately precedes another product match (e.g. "laptop" -> "charger")
          // This match is acting as an attributive modifier.
          if (m.endIndex + 1 === other.startIndex) {
            score -= 20; // Modifier demotion
          }
        }

        const currentTotal = productScores.get(m.product) || 0;
        productScores.set(m.product, currentTotal + score);
      }

      // 3. Pick the product profile with the highest aggregate score
      let bestProduct = null;
      let highestScore = -Infinity;

      for (const [product, score] of productScores.entries()) {
        if (score > highestScore) {
          highestScore = score;
          bestProduct = product;
        }
      }

      if (bestProduct && highestScore > 0) {
        return bestProduct;
      }
    }
  }

  // 4. Fallback to preset chip only if text contained no identifiable product
  if (presetKey) {
    const presetAliases = {
      fan: 'table_fan',
      charger: 'charger',
      keyboard: 'keyboard',
      chair: 'chair'
    };
    const targetId = presetAliases[presetKey] || presetKey;
    const directMatch = PRODUCT_CATALOG.find((p) => p.id === targetId);
    if (directMatch) return directMatch;
  }

  return GENERIC_PRODUCT_PROFILE;
}

/**
 * Step 2: Evaluates all applicable issue rules with concept-group matching.
 */
function evaluateItemDiagnosis(product, text, hasImage) {
  const cleanText = normalizeText(text);
  let bestIssueRule = null;
  let highestRuleScore = -1;

  if (product.issueRules && product.issueRules.length > 0) {
    for (const rule of product.issueRules) {
      // Rule matches IF AND ONLY IF every concept group in the rule is satisfied
      const allGroupsMatched = rule.conceptGroups.every((group) =>
        group.some((term) => matchConceptTerm(cleanText, term))
      );

      if (allGroupsMatched) {
        // Count total matched concepts for match confidence
        let matchedTermsCount = 0;
        for (const group of rule.conceptGroups) {
          for (const term of group) {
            if (matchConceptTerm(cleanText, term)) matchedTermsCount++;
          }
        }

        // Primary rank: Severity tier (x1000). Secondary rank: Matched terms (x10).
        const score = (rule.severity || 1) * 1000 + matchedTermsCount * 10;
        if (score > highestRuleScore) {
          highestRuleScore = score;
          bestIssueRule = rule;
        }
      }
    }
  }

  // Fall back to product-specific fallback if no specific rule matched
  const selectedIssue = bestIssueRule || product.fallbackIssue;

  // Compute economic metrics
  const [repMin, repMax] = selectedIssue.repairCostRange;
  const [repNewMin, repNewMax] = product.replaceCostRange;
  const avgRepair = (repMin + repMax) / 2;
  const avgReplace = (repNewMin + repNewMax) / 2;
  const costRatio = avgRepair / avgReplace;

  // Decision Logic: Safety / ForceReplace OR Repair Cost >= 55% of New Unit
  const isForceReplace = Boolean(selectedIssue.forceReplace);
  const isEconomicallyUnviable = costRatio >= 0.55;
  const recommendReplace = isForceReplace || isEconomicallyUnviable;

  const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`;

  let verdictTitle = '';
  let verdictType = '';
  let reason = '';

  if (recommendReplace) {
    verdictTitle = 'REPLACEMENT RECOMMENDED';
    verdictType = 'replace';
    if (isForceReplace) {
      reason = `Repairing this damage costs ${formatCurrency(repMin)}–${formatCurrency(repMax)}, which approaches replacement cost while presenting structural or electrical safety risks.`;
    } else {
      reason = `Estimated repair cost (${formatCurrency(repMin)}–${formatCurrency(repMax)}) exceeds 55% of a brand-new unit (${formatCurrency(repNewMin)}–${formatCurrency(repNewMax)}). Replacement is economically more sensible.`;
    }
  } else {
    verdictTitle = 'REPAIR RECOMMENDED';
    verdictType = 'repair';
    const percentSavings = Math.round((1 - costRatio) * 100);
    reason = `Repairing this item saves approximately ${percentSavings}% compared to buying new (${formatCurrency(repNewMin)}–${formatCurrency(repNewMax)}) and keeps functional hardware in service.`;
  }

  let finalDiagnosis = selectedIssue.issue;
  if (!cleanText && hasImage) {
    finalDiagnosis += ' (Estimated from visual inspection. Provide written symptoms for higher precision.)';
  }

  return {
    item: product.name,
    difficulty: selectedIssue.difficulty,
    issue: finalDiagnosis,
    repairMethod: selectedIssue.repairMethod,
    repairCost: `${formatCurrency(repMin)} - ${formatCurrency(repMax)}`,
    replaceCost: `${formatCurrency(repNewMin)} - ${formatCurrency(repNewMax)}`,
    verdict: verdictTitle,
    verdictType: verdictType,
    reason: reason
  };
}

// -------------------------------------------------------------
// 4. UI Helpers & Screen Management
// -------------------------------------------------------------
function showError(msg) {
  errorMessage.textContent = msg;
  errorBanner.classList.remove('hidden');
}

function clearError() {
  errorBanner.classList.add('hidden');
}

function updateSubmitButton() {
  const hasImage = Boolean(state.selectedFile);
  const hasText = problemDesc.value.trim().length >= 2;
  const hasPreset = Boolean(state.activePreset);
  analyzeBtn.disabled = !(hasImage || hasText || hasPreset);
}

function switchScreen(screenName) {
  inputScreen.classList.add('hidden');
  loadingScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');

  if (screenName === 'input') inputScreen.classList.remove('hidden');
  if (screenName === 'loading') loadingScreen.classList.remove('hidden');
  if (screenName === 'result') resultScreen.classList.remove('hidden');
}

// -------------------------------------------------------------
// 5. Image Upload & Validation Handlers
// -------------------------------------------------------------
function handleFile(file) {
  clearError();
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showError('Please upload a valid image file (JPG, PNG, or WEBP).');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showError('Image size exceeds 10MB limit. Please choose a smaller photo.');
    return;
  }

  state.selectedFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    dropPrompt.classList.add('hidden');
    imagePreviewContainer.classList.remove('hidden');
    updateSubmitButton();
  };
  reader.onerror = () => {
    showError('Failed to read image. Please try again.');
  };
  reader.readAsDataURL(file);
}

function clearImage() {
  state.selectedFile = null;
  fileInput.value = '';
  imagePreview.src = '';
  imagePreviewContainer.classList.add('hidden');
  dropPrompt.classList.remove('hidden');
  updateSubmitButton();
}

// -------------------------------------------------------------
// 6. Event Listeners
// -------------------------------------------------------------
dropZone.addEventListener('click', (e) => {
  if (e.target !== removeImageBtn) fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    handleFile(e.target.files[0]);
  }
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0]);
  }
});

removeImageBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  clearImage();
});

problemDesc.addEventListener('input', () => {
  state.activePreset = null;
  updateSubmitButton();
});

dismissErrorBtn.addEventListener('click', clearError);

// Preset Chips Handling
presetChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const presetKey = chip.getAttribute('data-preset');
    state.activePreset = presetKey;

    const sampleText = {
      fan: 'Table fan humming loudly but blades do not spin.',
      charger: 'Phone charging cable has frayed rubber near the neck and cuts out.',
      keyboard: 'Mechanical keyboard spacebar and "E" key are sticking.',
      chair: 'Office chair slowly sinks to the lowest level when sitting down.'
    };

    problemDesc.value = sampleText[presetKey] || '';
    updateSubmitButton();
  });
});

// -------------------------------------------------------------
// 7. Analysis Orchestration & Result Rendering
// -------------------------------------------------------------
async function runAnalysis() {
  switchScreen('loading');

  let combinedDescription = problemDesc.value || '';
  let visionAnalysisResult = null;

  // If an image is uploaded...
  // If an image is uploaded, send it to the Express backend for Gemini Vision analysis
  if (state.selectedFile) {
    loadingStage.textContent = 'Running AI visual inspection...';
    try {
      const formData = new FormData();
      formData.append('image', state.selectedFile);

      const response = await fetch('http://localhost:3000/api/analyze-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      const visionResult = await response.json();
      console.log('Gemini Vision Result:', visionResult);

      // Combine Gemini's findings with the user's original written description
// Keep the complete Gemini result available for dynamic analysis
visionAnalysisResult = visionResult;

const visionContext = `Item identified from image: ${visionResult.item}. Category: ${visionResult.category}. Visible damage: ${visionResult.visibleDamage}. Likely issue: ${visionResult.likelyIssue}. Severity: ${visionResult.severity}. Repairability: ${visionResult.repairability}. Vision confidence: ${visionResult.confidence}.`;

if (combinedDescription.trim().length > 0) {
  combinedDescription = `${combinedDescription}\n\n${visionContext}`;
} else {
  combinedDescription = visionContext;
}
    } catch (error) {
      console.error('Image analysis failed or backend unavailable. Falling back to text description:', error);
      // Fallback: combinedDescription remains the user's original text input
    }
  }

  // Continue with the existing loading animation sequence
  const stages = [
    'Identifying item category & specifications...',
    'Evaluating component-level fault signatures...',
    'Calculating market repair viability vs. replacement...'
  ];

  for (let i = 0; i < stages.length; i++) {
    loadingStage.textContent = stages[i];
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

 // 1. Identify Product Profile using the combined text context
const product = findProductProfile(combinedDescription, state.activePreset);

// 2. If Gemini identified an item that is NOT in our catalog,
// use Gemini's dynamic analysis instead of "General Inspected Item".
let resultData;

const isGenericProduct = product.id === 'generic_item';

if (visionAnalysisResult && isGenericProduct) {
  const vision = visionAnalysisResult;

  const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  const repairRange = Array.isArray(vision.repairCostRange)
    ? vision.repairCostRange
    : [0, 0];

  const replacementRange = Array.isArray(vision.replacementCostRange)
    ? vision.replacementCostRange
    : [0, 0];

  const repairMin = Number(repairRange[0]) || 0;
  const repairMax = Number(repairRange[1]) || 0;
  const replaceMin = Number(replacementRange[0]) || 0;
  const replaceMax = Number(replacementRange[1]) || 0;

  let verdictType = 'repair';

  if (vision.recommendation === 'replace') {
    verdictType = 'replace';
  } else if (vision.recommendation === 'uncertain') {
    verdictType = 'repair';
  }

  const verdictTitle =
    verdictType === 'replace'
      ? 'REPLACEMENT RECOMMENDED'
      : 'REPAIR RECOMMENDED';

  let reason;

  if (vision.recommendation === 'replace') {
    reason = `Based on the identified ${vision.item.toLowerCase()} and the visible damage, replacement appears more sensible than repair.`;
  } else if (vision.recommendation === 'repair') {
    reason = `The identified ${vision.item.toLowerCase()} appears reasonably repairable based on the visible condition and estimated repair cost.`;
  } else {
    reason = `The condition of this ${vision.item.toLowerCase()} is uncertain from the available visual evidence. A physical inspection is recommended before deciding.`;
  }

  resultData = {
    item: vision.item || 'Unknown Object',
    difficulty:
      vision.severity === 'high'
        ? 'High Complexity'
        : vision.severity === 'medium'
          ? 'Moderate Fix'
          : 'Easy Fix',

    issue: vision.likelyIssue || vision.visibleDamage || 'Visual inspection inconclusive.',

    repairMethod:
      vision.repairability === 'repairable'
        ? `Repair based on the identified damage: ${vision.visibleDamage || 'physical inspection required'}.`
        : 'Further physical inspection is recommended to determine the appropriate repair method.',

    repairCost: `${formatCurrency(repairMin)} - ${formatCurrency(repairMax)}`,

    replaceCost: `${formatCurrency(replaceMin)} - ${formatCurrency(replaceMax)}`,

    verdict: verdictTitle,

    verdictType: verdictType,

    reason: reason
  };
} else {
  // Known catalog item → keep using our detailed rule-based diagnosis.
  resultData = evaluateItemDiagnosis(
    product,
    combinedDescription,
    Boolean(state.selectedFile)
  );
}

// 3. Render Output
renderResult(resultData);
}

function renderResult(data) {
  document.getElementById('resultItemName').textContent = data.item;
  document.getElementById('resultDifficultyBadge').textContent = data.difficulty;
  document.getElementById('resultDiagnosis').textContent = data.issue;
  document.getElementById('resultRepairMethod').textContent = data.repairMethod;
  document.getElementById('resultRepairCost').textContent = data.repairCost;
  document.getElementById('resultReplaceCost').textContent = data.replaceCost;

  const verdictBanner = document.getElementById('verdictBanner');
  const verdictTitle = document.getElementById('verdictTitle');
  const verdictExplanation = document.getElementById('verdictExplanation');

  verdictTitle.textContent = data.verdict;
  verdictExplanation.textContent = data.reason;

  if (data.verdictType === 'replace') {
    verdictBanner.classList.add('replace-recommended');
  } else {
    verdictBanner.classList.remove('replace-recommended');
  }

  switchScreen('result');
}

// -------------------------------------------------------------
// 8. Form Triggers & Reset
// -------------------------------------------------------------
analyzeBtn.addEventListener('click', () => {
  if (analyzeBtn.disabled) return;
  runAnalysis().catch(() => {
    showError('Unable to complete diagnosis. Please try again.');
    switchScreen('input');
  });
});

resetBtn.addEventListener('click', () => {
  clearImage();
  problemDesc.value = '';
  state.activePreset = null;
  updateSubmitButton();
  switchScreen('input');
});