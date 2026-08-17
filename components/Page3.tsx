import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { LinkedInPosts, SeoBlog } from "@/lib/types";
import PawLoader from "@/components/PawLoader";
import Toast, { type ToastType } from "@/components/Toast";
import SeoMeter from "@/components/SeoMeter";
import HistoryDrawer from "@/components/HistoryDrawer";
import { useBlogGeneration } from "@/lib/BlogGenerationContext";

interface Page3Props {
  onBack: () => void;
  isActive?: boolean;
}

const TABS: Array<{ key: keyof LinkedInPosts; label: string; colorClass: string }> = [
  { key: "safeBet", label: "Safe Bet", colorClass: "safe-bet" },
  { key: "cleanLabel", label: "Clean-Label", colorClass: "clean-label" },
  { key: "microStory", label: "Micro-Story", colorClass: "micro-story" },
];

function triggerMicroConfetti(e?: React.MouseEvent | MouseEvent) {
  if (typeof window === "undefined") return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  if (e && e.currentTarget) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
  } else if (e && typeof e.clientX === "number" && (e.clientX !== 0 || e.clientY !== 0)) {
    x = e.clientX;
    y = e.clientY;
  }

  const colors = ["#68B77A", "#9A82D7", "#D7C59A", "#88C999"];
  const particleCount = 12;

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement("div");
    const color = colors[i % colors.length];
    const size = Math.floor(Math.random() * 4) + 3;
    const angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
    const distance = Math.floor(Math.random() * 22) + 16;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    el.className = "micro-confetti-particle";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.backgroundColor = color;
    el.style.borderRadius = "50%";
    el.style.boxShadow = `0 0 6px ${color}`;
    el.style.setProperty("--dx", `${dx}px`);
    el.style.setProperty("--dy", `${dy}px`);

    document.body.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 420);
  }
}

function ArrowUpIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, width: 20, height: 20 }}
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function WordDocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function PdfFileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15h3a1.5 1.5 0 0 0 0-3H9v6" />
    </svg>
  );
}

function EditPenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}



// ── Categorized Topic Database (260+ Unique Topics) ──────────────────────────

const CATEGORIZED_TOPICS: Record<string, string[]> = {
  health: [
    "Thyroid Disease in Dogs",
    "Annual Blood Tests for Dogs",
    "Blood Clot Disorders in Dogs",
    "Pancreatitis in Dogs & Treatment",
    "Kidney Disease Symptoms & Care",
    "Liver Disease in Dogs: Early Signs",
    "Dental Care & Preventing Gum Disease",
    "Chronic Ear Infections in Dogs",
    "Canine Arthritis & Joint Mobility",
    "Managing Hip Dysplasia in Dogs",
    "Cushing's Disease in Canines",
    "Managing Diabetes in Dogs",
    "Heart Disease Symptoms in Senior Dogs",
    "Common Dog Food & Environmental Allergies",
    "Soothing Dry & Itchy Skin in Dogs",
    "Seasonal Allergies & Relief for Dogs",
    "Bladder Stones in Dogs: Prevention",
    "Canine Digestive Disorders & Remedies",
    "Understanding Eye Infections & Cataracts",
    "Glaucoma in Dogs: Early Detection",
    "Canine Flu Symptoms & Prevention",
    "Kennel Cough Treatment & Vaccines",
    "Obesity Risks & Weight Loss for Dogs",
    "Maintaining a Healthy Weight for Canines",
    "Gut Microbiome & Health in Dogs",
    "Immune System Boosting for Dogs",
    "Lyme Disease Prevention & Tick Care",
    "Addison's Disease in Canines Explained",
    "Managing Dog Vomiting & Diarrhea",
    "Signs Your Dog Is in Secret Pain"
  ],
  nutrition: [
    "Best High-Protein Diets for Active Dogs",
    "Dangerous Household Foods Toxic to Dogs",
    "Probiotics for Dog Digestive Health",
    "Senior Dog Nutrition & Caloric Needs",
    "Raw Food vs Kibble: Pros & Cons",
    "Grain-Free Dog Food: Is It Safe?",
    "Homemade Dog Treat Recipes with Pumpkin",
    "Omega-3 Fatty Acids for Shinier Dog Coats",
    "How Much Water Should Your Dog Drink Daily?",
    "Feeding Schedule Tips for Puppies vs Adults",
    "Managing Food Sensitivities in Dogs",
    "Is Peanut Butter Safe for Dogs?",
    "Benefits of Bone Broth for Dog Joints",
    "Choosing the Best Puppy Food for Growth",
    "Fiber-Rich Foods for Dog Digestion",
    "Hydration Tips During Hot Summer Days",
    "Can Dogs Eat Blueberries and Carrots?",
    "Understanding Dog Food Labels & Ingredients",
    "Managing Fussy Eaters & Picky Dogs",
    "Taurine Deficiency & Dog Cardiac Health",
    "Healthy Snacks for Weight Loss in Dogs",
    "Superfoods to Boost Your Dog's Vitality",
    "Calculating Daily Calorie Needs for Dogs",
    "Hypoallergenic Diets for Sensitive Dogs",
    "Essential Vitamins Every Dog Needs"
  ],
  training: [
    "Curing Separation Anxiety in Rescue Dogs",
    "Potty Training a Puppy in 7 Simple Steps",
    "Stopping Excessive Barking at the Door",
    "Leash Training: How to Stop Pulling",
    "Socializing Your Puppy with Other Dogs",
    "Clicker Training Basics for Beginners",
    "Dealing with Resource Guarding in Dogs",
    "Crate Training Guide for Easy Nights",
    "How to Teach Your Dog the Leave It Command",
    "Managing Aggression Towards Strange Dogs",
    "Overcoming Fear of Thunderstorms & Fireworks",
    "Preventing Destructive Chewing at Home",
    "Teaching Your Dog to Sit, Stay, and Come",
    "Understanding Why Dogs Dig Holes & How to Stop It",
    "Biting & Nipping in Puppies: How to Stop It",
    "Submissive Peeing vs Excitement Urination",
    "Mentally Stimulating Puzzles for Bored Dogs",
    "Recall Training: Reliable Off-Leash Recall",
    "Preparing Your Dog for a New Baby",
    "Stopping Jumping Up on Guests",
    "Desensitizing Dogs to Vacuum Cleaner Noise",
    "Boundary Training for Unfenced Yards",
    "Target Training & Touch Cue Basics",
    "Rewarding Good Behavior Effectively",
    "Training a High-Energy Dog to Relax"
  ],
  grooming: [
    "Dog Coat Care & Daily Grooming Tips",
    "How Often Should You Really Bathe Your Dog?",
    "Trimming Dog Nails Without Stress or Pain",
    "Cleaning Your Dog's Ears Safely at Home",
    "Brushing Dog Teeth: Step-by-Step Guide",
    "De-Shedding Techniques for Double-Coated Dogs",
    "Soothing Sensitive Skin After Dog Baths",
    "Tear Stain Removal Remedies for White Fur",
    "Winter Paw Care & De-Icing Salt Protection",
    "Hot Weather Grooming: Should You Shave Your Dog?",
    "Identifying Flea Bites & Tick Prevention",
    "Best Brush Types for Poodles & Curly Coats",
    "Matted Fur Removal Tips Without Cutting Skin",
    "Cleaning Dog Wrinkles & Facial Folds",
    "Protecting Dog Paws from Hot Pavement",
    "Managing Excessive Shedding in Spring & Fall",
    "Natural Shampoos for Dogs with Sensitive Skin",
    "Anal Gland Care & Expressions Explained",
    "DIY Dog Paw Balm Recipes for Dry Pads",
    "Grooming Anxiety: Calming Baths & Blow Drying"
  ],
  puppy: [
    "Puppy Vaccination Schedule Timeline",
    "Essential Puppy Prep Checklist for New Owners",
    "Puppy Teething Survival Guide for Owners",
    "Sleeping Through the Night: Puppy Sleep Tips",
    "How to Crate Train a Puppy Without Crying",
    "Puppy Growth Spurt Stages & Weight Milestones",
    "First Vet Visit: What to Expect & Questions",
    "Puppy Socialization Window (8 to 16 Weeks)",
    "Choosing the Right Harness & Collar for Puppies",
    "Microchipping Your Puppy: What You Need to Know",
    "Preventing Puppy Play Biting & Mouthiness",
    "Transitioning Puppies from Milk to Solid Kibble",
    "Puppy Proofing Your Living Room & Yard",
    "Handling Puppy Energy Spurt Zooms",
    "Establishing a Consistent Puppy Daily Routine"
  ],
  senior: [
    "Caring for Aging Dogs: Senior Mobility Tips",
    "Cognitive Dysfunction Syndrome (Dog Dementia)",
    "Best Orthopedic Beds for Arthritic Dogs",
    "Adjusting Exercise Routines for Elderly Dogs",
    "Eye Care & Vision Loss in Senior Dogs",
    "Hearing Loss in Dogs: Training with Hand Signals",
    "Senior Dog Weight Management & Metabolism",
    "Incontinence Care for Older Dogs",
    "End-of-Life Comfort & Palliative Pet Care",
    "Supplementing Glucosamine & Chondroitin",
    "Recognizing Early Signs of Aging in Canines",
    "Non-Slip Ramps & Rugs for Senior Pets",
    "Dental Care for Senior Dogs with Missing Teeth",
    "Stimulating Mental Health in Aging Dogs",
    "Senior Dog Massage Techniques for Stiffness"
  ],
  safety: [
    "Heatstroke in Dogs: Emergency First Aid",
    "Dehydration Signs & Quick Relief for Dogs",
    "Pet First Aid Kit Essentials Every Owner Needs",
    "Poisonous Plants Common in Home Gardens",
    "What to Do If Your Dog Ingests Chocolate",
    "Car Safety & Harness Restraints for Dogs",
    "Emergency Disaster Prep Checklist for Pets",
    "Rattlesnake & Snake Bite Emergency Protocol",
    "Choking Symptoms in Dogs & Pet CPR Basics",
    "Preventing Dog Escapes & Fence Jumping",
    "Xylitol Danger: Foods Hiding Artificial Sweeteners",
    "Pool Safety & Swimming Lessons for Dogs",
    "Cold Weather Frostbite Protection for Paws",
    "Recognizing Bloat (GDV) Emergency in Large Dogs",
    "Toxic Household Cleaning Products to Avoid"
  ],
  breeds: [
    "Golden Retriever Care Guide & Health Risks",
    "French Bulldog Breathing Issues & Care",
    "German Shepherd Training & Working Line Needs",
    "Labrador Retriever Exercise Requirements",
    "Poodle Hybrids (Goldendoodles, Labradoodles)",
    "Small Dog Syndrome: Training Toy Breeds",
    "High-Energy Working Dog Exercise Strategies",
    "Hypoallergenic Dog Breeds for Allergy Sufferers",
    "Best Apartment Dog Breeds for City Living",
    "Apartment vs House Living for Large Breed Dogs",
    "Corgi Spine & Joint Protection Guide",
    "Beagle Scent Drive & Recall Challenges",
    "Husky Cold Weather Care & Escape Prevention",
    "Dachshund Back Care & IVDD Symptoms",
    "Boxer Dog Cardiac & Heat Sensitivity"
  ],
  lifestyle: [
    "Traveling by Car with Your Dog: Tips & Gear",
    "Flying with Pets: Cabin vs Cargo Rules",
    "Finding a Trusted Dog Walker or Sitter",
    "Boarding Your Dog: What to Look for in Kennels",
    "Hiking with Dogs: Trail Safety & Paw Protection",
    "Beach Days with Dogs: Salt Water & Sun Safety",
    "Camping with Dogs: Gear & Safety Essentials",
    "Preparing Your Dog for Vet Visits",
    "Hotel Etiquette for Traveling Dog Owners",
    "Dog-Friendly Restaurant Outing Tips",
    "Balancing Work and Dog Care Responsibilities",
    "Creating a Dog-Friendly Backyard Haven",
    "Working From Home with a High-Demand Dog",
    "Introducing Your Dog to Swimming",
    "Celebrating Your Dog's Birthday Party Ideas"
  ],
  behavior: [
    "Understanding Dog Body Language & Signals",
    "Tail Wagging Meaning: Emotion & Intent",
    "Why Do Dogs Howl at Night or Music?",
    "Understanding Why Dogs Lean Against You",
    "Why Dogs Tilt Their Heads When You Speak",
    "Dog Licking Behavior: Love, Stress, or Pain?",
    "Recognizing Calming Signals in Stressful Dogs",
    "Why Dogs Zoom Around the House (Zoomies)",
    "Sleeping Positions of Dogs & What They Mean",
    "How Dogs Express Affection & Trust",
    "Deciphering Dog Yawning & Lip Licking",
    "Why Dogs Follow You into the Bathroom",
    "Understanding Dog Dreams & Twitching",
    "Why Dogs Roll in Smelly Grass or Mud",
    "Recognizing Resource Anxiety vs Dominance"
  ]
};

// Fisher-Yates Shuffle algorithm helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Session Engine: Round-Robin Category Rotation + Fisher-Yates Exhaustive Pool Shuffling
class CategorizedTopicEngine {
  private categories: string[];
  private categoryIndex: number = 0;
  private pools: Record<string, string[]> = {};
  private lastSuggested: string = "";

  constructor() {
    this.categories = shuffleArray(Object.keys(CATEGORIZED_TOPICS));
    this.resetAllPools();
  }

  private resetAllPools() {
    this.categories = shuffleArray(Object.keys(CATEGORIZED_TOPICS));
    this.categoryIndex = 0;
    for (const cat of this.categories) {
      this.pools[cat] = shuffleArray(CATEGORIZED_TOPICS[cat]);
    }
  }

  public getNextTopic(): string {
    let attempts = 0;

    while (attempts < this.categories.length) {
      const currentCat = this.categories[this.categoryIndex % this.categories.length];
      this.categoryIndex++;
      const pool = this.pools[currentCat];

      if (pool && pool.length > 0) {
        const topic = pool.pop()!;
        if (topic === this.lastSuggested && pool.length > 0) {
          const altTopic = pool.pop()!;
          pool.push(topic);
          this.lastSuggested = altTopic;
          return altTopic;
        }
        this.lastSuggested = topic;
        return topic;
      }
      attempts++;
    }

    // Exhausted all topics across all categories -> Reshuffle everything using Fisher-Yates
    this.resetAllPools();
    return this.getNextTopic();
  }

  public getBatch(count: number = 5): string[] {
    const batch: string[] = [];
    for (let i = 0; i < count; i++) {
      batch.push(this.getNextTopic());
    }
    return batch;
  }
}

// Persistent session topic engine singleton
const globalTopicEngine = new CategorizedTopicEngine();

const RANDOM_PLACEHOLDERS = [
  "Anal Gland Care & Expressions Explained",
  "Seasonal Shedding & Undercoat Care",
  "Separation Anxiety & Calm Canine Habits",
  "Puppy Teething & Gentle Bite Inhibition",
  "Canine Dental Health & Plaque Removal",
  "Spring Allergy Reactions & Itchy Paw Relief",
  "Raw Food vs Kiln-Dried Kibble Nutrition",
  "Senior Dog Joint Mobility & Arthritis Care",
  "Ear Infection Signs & Safe Cleaning Guide",
  "Car Travel Harness Fitting & Road Trip Safety",
  "Hydration Strategies & Heat Stroke Signs",
  "Managing Canine Pancreatitis Symptoms",
  "Essential Grooming Habits for Double Coats",
  "Understanding Sudden Appetite Loss in Dogs",
  "Preventing Flea & Tick Infestations Naturally"
];

// ── Icons ─────────────────────────────────────────────────────────────────────

function GreenSparklesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#68B77A" aria-hidden="true">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      <path d="M5 3L6 6L9 7L6 8L5 11L4 8L1 7L4 6L5 3Z" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path
        d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"
        fill="rgba(104, 183, 122, 0.28)"
        stroke="#68B77A"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 18h6" stroke="#68B77A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 21h4" stroke="#68B77A" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function RibbonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function MoreHorizontalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CloseXIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}



function PawHeadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M12 12c-2 0-4 1.5-4 3.5 0 2.2 2.2 4.5 4 5.5 1.8-1 4-3.3 4-5.5 0-2-2-3.5-4-3.5z" />
      <circle cx="6.5" cy="9.5" r="2.2" />
      <circle cx="10" cy="5.5" r="2.2" />
      <circle cx="14" cy="5.5" r="2.2" />
      <circle cx="17.5" cy="9.5" r="2.2" />
    </svg>
  );
}

// ── Funky Counter Loading Animation ─────────────────────────────────────────

function FunkyCounterLoader({
  topic,
  isDone,
  onCrossfadeStart,
  onFullyExited,
}: {
  topic: string;
  isDone: boolean;
  onCrossfadeStart: () => void;
  onFullyExited: () => void;
}) {
  const [count, setCount] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [completedText, setCompletedText] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tick counter while not isDone up to 95%. When isDone, tick rapidly to 100%.
  useEffect(() => {
    if (!isDone) {
      const timer = setInterval(() => {
        setCount((prev) => (prev < 95 ? prev + 1 : prev));
      }, 360);
      return () => clearInterval(timer);
    } else {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev < 100) return prev + 1;
          clearInterval(timer);
          return 100;
        });
      }, 25);
      return () => clearInterval(timer);
    }
  }, [isDone]);

  // When progress reaches 100%, hold brief pause (400ms) -> smooth scale/fade exit -> unmount
  useEffect(() => {
    if (count >= 100) {
      setCompletedText("✨ Generation Complete!");

      const pauseTimer = setTimeout(() => {
        setIsExiting(true);
        onCrossfadeStart();

        const exitTimer = setTimeout(() => {
          onFullyExited();
        }, 450);

        return () => clearTimeout(exitTimer);
      }, 400);

      return () => clearTimeout(pauseTimer);
    }
  }, [count, onCrossfadeStart, onFullyExited]);

  // Determine active stage (1: Research, 2: Write, 3: Optimize)
  const currentStage = count <= 35 ? 1 : count <= 75 ? 2 : 3;

  // Dynamic status text matching progress
  const defaultStatusText =
    count <= 20
      ? "Analyzing search intent..."
      : count <= 35
      ? "Scanning veterinary guidelines..."
      : count <= 55
      ? "Building the first draft..."
      : count <= 75
      ? "Drafting clinical FAQs..."
      : count <= 88
      ? "Optimizing SEO keyword density..."
      : "Preparing social variations...";

  const statusText = completedText || defaultStatusText;

  const content = (
    <div
      className={`p3-loader-wrapper ${isExiting ? "p3-loader-exiting" : ""}`}
      aria-busy="true"
      aria-live="polite"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        className={`p3-loader-modal ai-active-glow ${isExiting ? "p3-modal-exiting" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main top content row */}
        <div className="p3-loader-main-row">
          {/* Left section: Document Icon + Writing your blog + Topic */}
          <div className="p3-loader-left">
            <div className="p3-loader-doc-icon paw-loader-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#68B77A" aria-hidden="true">
                <ellipse cx="12" cy="16.2" rx="5.4" ry="4.6" />
                <ellipse cx="5.2" cy="8.8" rx="2.1" ry="2.7" />
                <ellipse cx="10.1" cy="5.4" rx="2" ry="2.6" />
                <ellipse cx="14.7" cy="5.4" rx="2" ry="2.6" />
                <ellipse cx="19" cy="8.8" rx="2.1" ry="2.7" />
              </svg>
            </div>
            <div className="p3-loader-title-wrap">
              <h3 className="p3-loader-title">Writing your blog</h3>
              <p className="p3-loader-topic">{topic || "Pet Care Guide"}</p>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="p3-loader-v-divider" />

          {/* Right section: 3-step rail + status text + progress bar */}
          <div className="p3-loader-right">
            {/* Step rail */}
            <div className="p3-loader-rail">
              <div className={`p3-rail-step ${currentStage >= 1 ? (currentStage > 1 ? "complete" : "active") : ""}`}>
                <span className="p3-rail-badge">
                  {currentStage > 1 ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    "1"
                  )}
                </span>
                <span className="p3-rail-label">Research</span>
              </div>

              <span className={`p3-rail-line ${currentStage >= 2 ? "active" : ""}`} />

              <div className={`p3-rail-step ${currentStage >= 2 ? (currentStage > 2 ? "complete" : "active") : ""}`}>
                <span className="p3-rail-badge">
                  {currentStage > 2 ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    "2"
                  )}
                </span>
                <span className="p3-rail-label">Write</span>
              </div>

              <span className={`p3-rail-line ${currentStage >= 3 ? "active" : ""}`} />

              <div className={`p3-rail-step ${currentStage >= 3 ? "active" : ""}`}>
                <span className="p3-rail-badge">3</span>
                <span className="p3-rail-label">Optimize</span>
              </div>
            </div>

            {/* Status message & Percentage counter */}
            <div className="p3-loader-status-row">
              <span className="p3-loader-status-text">{statusText}</span>
              <span className="p3-loader-percentage">{count}%</span>
            </div>

            {/* Progress Bar Track */}
            <div className="p3-loader-track-bar">
              <div className="p3-loader-bar-fill" style={{ width: `${count}%` }} />
            </div>

            {/* Faint Background Dog */}
            <img src="/sidebar-dog-transparent.png" alt="" className="p3-loader-bg-dog" aria-hidden="true" />
          </div>
        </div>

        {/* Footer info row */}
        <div className="p3-loader-footer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737C82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>This usually takes less than a minute.</span>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}

// ── Concept 3: Full Workspace Skeleton Swap Loader Component ───────────────────
function StudioCanvasSkeleton({
  topic,
  isDone,
}: {
  topic: string;
  isDone: boolean;
}) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!isDone) {
      const timer = setInterval(() => {
        setCount((prev) => (prev < 95 ? prev + 1 : prev));
      }, 360);
      return () => clearInterval(timer);
    } else {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev < 100) return prev + 1;
          clearInterval(timer);
          return 100;
        });
      }, 25);
      return () => clearInterval(timer);
    }
  }, [isDone]);

  const currentStage = count <= 35 ? 1 : count <= 75 ? 2 : 3;

  const defaultStatusText =
    count <= 20
      ? "Analyzing search intent & SEO density..."
      : count <= 35
      ? "Scanning veterinary care guidelines..."
      : count <= 55
      ? "Drafting core editorial section content..."
      : count <= 75
      ? "Generating clinical pet care FAQs..."
      : count <= 88
      ? "Optimizing keyword placement & meta titles..."
      : "Finalizing article & cross-platform excerpts...";

  return (
    <div
      className="p3-workspace text-reveal-entry p3-workspace--expanded"
      style={{
        display: "grid",
        gridTemplateColumns: "calc(60% - 10px) calc(40% - 10px)",
        gap: "20px",
        width: "100%",
        maxWidth: "100%",
        margin: "0",
        padding: "0",
        boxSizing: "border-box",
        alignItems: "start",
      }}
    >
      {/* Left Column (60% Width): Loading Bar + Blog Document Skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", minWidth: 0, boxSizing: "border-box" }}>
          {/* AI Stepper Header Bar (Exclusive to Left Column - Minimal Clean Design) */}
          <div className="p3-skeleton-topbar" style={{ margin: 0, padding: "14px 18px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "none" }}>
            {/* Header Title Row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#059669" }} />
                <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0F172A" }}>
                  AI Editorial Assistant Active
                </span>
                <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "#047857", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "6px", padding: "1px 8px" }}>
                  {topic || "Pet Care Guide"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: "0.76rem", color: "#64748B" }}>Progress</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#059669", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "6px", padding: "1px 8px", fontFamily: "var(--font-mono)" }}>
                  {count}%
                </span>
              </div>
            </div>

            {/* 3-Step Active Stage Stepper Pills */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
              {[
                { step: 1, title: "1. Research Intent" },
                { step: 2, title: "2. Draft Article" },
                { step: 3, title: "3. SEO Optimize" },
              ].map((st, i) => {
                const isActive = currentStage === i + 1;
                const isCompleted = currentStage > i + 1;
                return (
                  <div
                    key={st.step}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "6px",
                      background: isActive ? "#ECFDF5" : isCompleted ? "#F0F9FF" : "#F8FAFC",
                      border: isActive ? "1px solid #A7F3D0" : isCompleted ? "1px solid #BAE6FD" : "1px solid #E2E8F0",
                      color: isActive ? "#047857" : isCompleted ? "#0369A1" : "#64748B",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span>{isCompleted ? "✓" : isActive ? "⚡" : i + 1}</span>
                    <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{st.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Status & Progress Bar Row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: "0.78rem", color: "#475569", fontWeight: 500 }}>{defaultStatusText}</span>
              <span style={{ fontSize: "0.72rem", color: "#64748B" }}>⏱️ ~15s</span>
            </div>

            {/* Minimal Progress Track */}
            <div style={{ width: "100%", height: "5px", background: "#F1F5F9", borderRadius: "9999px", overflow: "hidden", border: "1px solid #E2E8F0" }}>
              <div
                style={{
                  height: "100%",
                  width: `${count}%`,
                  background: "linear-gradient(90deg, #059669 0%, #10B981 100%)",
                  borderRadius: "9999px",
                  transition: "width 0.35s ease-out",
                }}
              />
            </div>
          </div>

          {/* Left Column Blog Canvas Skeleton Card */}
          <div
            className="p3-skeleton-card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "24px",
            }}
          >
            {/* Article Header & Title Skeleton */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="skeleton-shimmer" style={{ width: "110px", height: "16px" }} />
                <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>•</span>
                <div className="skeleton-shimmer" style={{ width: "75px", height: "16px" }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: "80%", height: "30px" }} />
            </div>

            {/* Meta Badges Skeleton */}
            <div style={{ display: "flex", gap: "10px" }}>
              <div className="skeleton-shimmer" style={{ width: "90px", height: "24px", borderRadius: "9999px" }} />
              <div className="skeleton-shimmer" style={{ width: "110px", height: "24px", borderRadius: "9999px" }} />
              <div className="skeleton-shimmer" style={{ width: "80px", height: "24px", borderRadius: "9999px" }} />
            </div>

            {/* Featured Media Cover Image Skeleton */}
            <div className="skeleton-shimmer" style={{ width: "100%", height: "180px", borderRadius: "12px" }} />

            {/* Key Takeaways Box Skeleton */}
            <div style={{ padding: "14px 16px", background: "#F8FAFC", borderRadius: "10px", border: "1.5px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div className="skeleton-shimmer" style={{ width: "130px", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "94%", height: "12px" }} />
              <div className="skeleton-shimmer" style={{ width: "86%", height: "12px" }} />
            </div>

            {/* H2 Subheading & Paragraph Skeletons */}
            <div className="skeleton-shimmer" style={{ width: "45%", height: "22px", marginTop: "4px" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="skeleton-shimmer" style={{ width: "98%", height: "13px" }} />
              <div className="skeleton-shimmer" style={{ width: "92%", height: "13px" }} />
              <div className="skeleton-shimmer" style={{ width: "85%", height: "13px" }} />
              <div className="skeleton-shimmer" style={{ width: "65%", height: "13px" }} />
            </div>

            {/* Keywords Chips Skeleton Row */}
            <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1.5px solid #F1F5F9", display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="skeleton-shimmer" style={{ width: "90px", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "75px", height: "24px", borderRadius: "9999px" }} />
              <div className="skeleton-shimmer" style={{ width: "95px", height: "24px", borderRadius: "9999px" }} />
              <div className="skeleton-shimmer" style={{ width: "80px", height: "24px", borderRadius: "9999px" }} />
            </div>
          </div>
        </div>

        {/* Right Column: Assistant Tools & Meta Skeleton Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", minWidth: 0, boxSizing: "border-box" }}>
          {/* Meta Title Card Skeleton */}
          <div className="p3-skeleton-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="skeleton-shimmer" style={{ width: "45%", height: "16px" }} />
            <div className="skeleton-shimmer" style={{ width: "100%", height: "38px", borderRadius: "8px" }} />
          </div>

          {/* Meta Description Card Skeleton */}
          <div className="p3-skeleton-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="skeleton-shimmer" style={{ width: "55%", height: "16px" }} />
            <div className="skeleton-shimmer" style={{ width: "100%", height: "64px", borderRadius: "8px" }} />
          </div>

          {/* SEO Keywords Card Skeleton */}
          <div className="p3-skeleton-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="skeleton-shimmer" style={{ width: "40%", height: "16px" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <div className="skeleton-shimmer" style={{ width: "70px", height: "26px", borderRadius: "9999px" }} />
              <div className="skeleton-shimmer" style={{ width: "95px", height: "26px", borderRadius: "9999px" }} />
              <div className="skeleton-shimmer" style={{ width: "80px", height: "26px", borderRadius: "9999px" }} />
              <div className="skeleton-shimmer" style={{ width: "110px", height: "26px", borderRadius: "9999px" }} />
            </div>
          </div>

          {/* Social Media Excerpt Skeleton Card */}
          <div className="p3-skeleton-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
              <div className="skeleton-shimmer" style={{ width: "80px", height: "26px", borderRadius: "6px" }} />
              <div className="skeleton-shimmer" style={{ width: "80px", height: "26px", borderRadius: "6px" }} />
            </div>
            <div className="skeleton-shimmer" style={{ width: "96%", height: "13px" }} />
            <div className="skeleton-shimmer" style={{ width: "88%", height: "13px" }} />
            <div className="skeleton-shimmer" style={{ width: "60%", height: "13px" }} />
          </div>
        </div>
    </div>
  );
}

// ── Studio Canvas Editor Workspace ─────────────────────────────────────────────

function StudioCanvasEditor({
  blog,
  onSave,
  onCancel,
}: {
  blog: SeoBlog;
  onSave: (updated: SeoBlog) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<SeoBlog>(() => JSON.parse(JSON.stringify(blog)));
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDraft = (updater: (prev: SeoBlog) => SeoBlog) => {
    setDraft((prev) => {
      const next = updater(prev);
      setIsDirty(true);
      return next;
    });
    setError(null);
  };

  const handleSave = () => {
    if (!draft.title.trim()) {
      setError("Blog title cannot be empty.");
      return;
    }
    onSave(draft);
  };

  const handleExit = () => {
    if (isDirty) {
      if (
        window.confirm(
          "You have unsaved changes in the Studio Canvas. Are you sure you want to discard your edits?"
        )
      ) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const [isPolishingPreset, setIsPolishingPreset] = useState<string | null>(null);

  const handlePolishTone = (preset: "punchier" | "warm" | "stats", e?: React.MouseEvent) => {
    if (e) triggerMicroConfetti(e);
    setIsPolishingPreset(preset);
    setTimeout(() => {
      updateDraft((prev) => {
        const nextIntro = [...prev.intro];
        if (preset === "punchier") {
          if (nextIntro.length > 0) {
            nextIntro[0] = nextIntro[0].replace(/\b(very|extremely|really|basically)\b\s*/gi, "").trim();
          }
        } else if (preset === "warm") {
          if (nextIntro.length > 0 && !nextIntro[0].includes("🐾")) {
            nextIntro[0] = `🐾 As loving pet parents, ${nextIntro[0].toLowerCase()}`;
          }
        } else if (preset === "stats") {
          if (nextIntro.length > 0 && !nextIntro[0].includes("%")) {
            nextIntro[0] += " (Recent veterinary studies show 84% of pet owners notice immediate wellness improvements).";
          }
        }
        return { ...prev, intro: nextIntro };
      });
      setIsPolishingPreset(null);
    }, 400);
  };

  return (
    <div className="p3-canvas-editor">
      {/* Editor Top Bar */}
      <div className="p3-editor-top-bar">
        <div className="p3-editor-status">
          <span className="p3-editor-badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <EditPenIcon />
            Studio Canvas Editor
          </span>
          {isDirty && <span className="p3-dirty-tag">Unsaved Edits</span>}
        </div>
        {error && <div className="p3-editor-error">{error}</div>}
        <div className="p3-editor-actions">
          <button type="button" className="p3-btn p3-btn--ghost" onClick={handleExit}>
            ✕ <span className="p3-btn-label">Cancel</span>
          </button>
          <button type="button" className="p3-btn p3-btn--teal p3-btn--pop" onClick={handleSave} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <CheckIcon /> <span className="p3-btn-label">Save Changes</span>
          </button>
        </div>
      </div>

      {/* AI Quick Tone Polisher Toolbar */}
      <div className="p3-tone-polisher-bar">
        <span className="p3-tone-label">✨ AI Tone Quick-Polish:</span>
        <div className="p3-tone-btn-group">
          <button
            type="button"
            className="p3-tone-btn"
            disabled={!!isPolishingPreset}
            onClick={(e) => handlePolishTone("punchier", e)}
            title="Make intro paragraph punchier & concise"
          >
            {isPolishingPreset === "punchier" ? <span className="p3-spinner p3-spinner--sm" /> : "⚡ Punchier & Concise"}
          </button>
          <button
            type="button"
            className="p3-tone-btn"
            disabled={!!isPolishingPreset}
            onClick={(e) => handlePolishTone("warm", e)}
            title="Add empathetic pet parent warmth"
          >
            {isPolishingPreset === "warm" ? <span className="p3-spinner p3-spinner--sm" /> : "🐾 Warmer Pet Voice"}
          </button>
          <button
            type="button"
            className="p3-tone-btn"
            disabled={!!isPolishingPreset}
            onClick={(e) => handlePolishTone("stats", e)}
            title="Add veterinary statistical data point"
          >
            {isPolishingPreset === "stats" ? <span className="p3-spinner p3-spinner--sm" /> : "📊 Add Statistics"}
          </button>
        </div>
      </div>

      {/* Editor Form */}
      <div className="p3-editor-form">
        {/* Title (H1) */}
        <div className="p3-editor-card">
          <label className="p3-editor-label">Blog Title (H1)</label>
          <input
            type="text"
            className="p3-editor-input p3-editor-title-input"
            value={draft.title}
            onChange={(e) => updateDraft((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Enter blog title..."
          />
        </div>

        {/* Intro Paragraphs */}
        <div className="p3-editor-card">
          <div className="p3-editor-card-header">
            <label className="p3-editor-label">Introduction Paragraphs</label>
            <button
              type="button"
              className="p3-btn-add-sm"
              onClick={() => updateDraft((prev) => ({ ...prev, intro: [...prev.intro, ""] }))}
            >
              + Add Paragraph
            </button>
          </div>
          {draft.intro.map((p, idx) => (
            <div key={idx} className="p3-editor-row">
              <textarea
                className="p3-editor-textarea"
                rows={3}
                value={p}
                onChange={(e) => {
                  const val = e.target.value;
                  updateDraft((prev) => {
                    const nextIntro = [...prev.intro];
                    nextIntro[idx] = val;
                    return { ...prev, intro: nextIntro };
                  });
                }}
                placeholder={`Intro paragraph ${idx + 1}...`}
              />
              {draft.intro.length > 1 && (
                <button
                  type="button"
                  className="p3-btn-del-sm"
                  title="Delete paragraph"
                  onClick={() =>
                    updateDraft((prev) => ({
                      ...prev,
                      intro: prev.intro.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Content Sections (H2) */}
        <div className="p3-editor-card">
          <div className="p3-editor-card-header">
            <label className="p3-editor-label">Main Content Sections (H2)</label>
            <button
              type="button"
              className="p3-btn-add-sm"
              onClick={() =>
                updateDraft((prev) => ({
                  ...prev,
                  sections: [
                    ...prev.sections,
                    { heading: "New Section", paragraphs: [""] },
                  ],
                }))
              }
            >
              + Add Section
            </button>
          </div>

          {draft.sections.map((sec, sIdx) => (
            <div key={sIdx} className="p3-editor-section-box">
              <div className="p3-section-box-header">
                <span className="p3-section-num">Section {sIdx + 1}</span>
                <input
                  type="text"
                  className="p3-editor-input p3-section-heading-input"
                  value={sec.heading}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateDraft((prev) => {
                      const nextSecs = [...prev.sections];
                      nextSecs[sIdx] = { ...nextSecs[sIdx], heading: val };
                      return { ...prev, sections: nextSecs };
                    });
                  }}
                  placeholder="Section Heading (H2)"
                />
                <button
                  type="button"
                  className="p3-btn-del-sm"
                  title="Delete section"
                  onClick={() =>
                    updateDraft((prev) => ({
                      ...prev,
                      sections: prev.sections.filter((_, i) => i !== sIdx),
                    }))
                  }
                >
                  ✕ Remove
                </button>
              </div>

              {/* Paragraphs */}
              <div className="p3-section-box-body">
                <div className="p3-sub-label">Paragraphs</div>
                {(sec.paragraphs ?? [""]).map((p, pIdx) => (
                  <div key={pIdx} className="p3-editor-row">
                    <textarea
                      className="p3-editor-textarea"
                      rows={3}
                      value={p}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((prev) => {
                          const nextSecs = [...prev.sections];
                          const nextParas = [...(nextSecs[sIdx].paragraphs ?? [])];
                          nextParas[pIdx] = val;
                          nextSecs[sIdx] = { ...nextSecs[sIdx], paragraphs: nextParas };
                          return { ...prev, sections: nextSecs };
                        });
                      }}
                      placeholder={`Paragraph ${pIdx + 1}...`}
                    />
                    <button
                      type="button"
                      className="p3-btn-del-sm"
                      onClick={() =>
                        updateDraft((prev) => {
                          const nextSecs = [...prev.sections];
                          const nextParas = (nextSecs[sIdx].paragraphs ?? []).filter(
                            (_, i) => i !== pIdx
                          );
                          nextSecs[sIdx] = { ...nextSecs[sIdx], paragraphs: nextParas };
                          return { ...prev, sections: nextSecs };
                        })
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="p3-btn-add-xs"
                  onClick={() =>
                    updateDraft((prev) => {
                      const nextSecs = [...prev.sections];
                      const nextParas = [...(nextSecs[sIdx].paragraphs ?? []), ""];
                      nextSecs[sIdx] = { ...nextSecs[sIdx], paragraphs: nextParas };
                      return { ...prev, sections: nextSecs };
                    })
                  }
                >
                  + Add Paragraph to Section
                </button>

                {/* Bullets */}
                <div className="p3-sub-label" style={{ marginTop: "14px" }}>
                  Bullet Points (Optional)
                </div>
                {(sec.bullets ?? []).map((b, bIdx) => (
                  <div key={bIdx} className="p3-editor-row">
                    <input
                      type="text"
                      className="p3-editor-input"
                      value={b}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((prev) => {
                          const nextSecs = [...prev.sections];
                          const nextBullets = [...(nextSecs[sIdx].bullets ?? [])];
                          nextBullets[bIdx] = val;
                          nextSecs[sIdx] = { ...nextSecs[sIdx], bullets: nextBullets };
                          return { ...prev, sections: nextSecs };
                        });
                      }}
                      placeholder={`Bullet item ${bIdx + 1}...`}
                    />
                    <button
                      type="button"
                      className="p3-btn-del-sm"
                      onClick={() =>
                        updateDraft((prev) => {
                          const nextSecs = [...prev.sections];
                          const nextBullets = (nextSecs[sIdx].bullets ?? []).filter(
                            (_, i) => i !== bIdx
                          );
                          nextSecs[sIdx] = { ...nextSecs[sIdx], bullets: nextBullets };
                          return { ...prev, sections: nextSecs };
                        })
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="p3-btn-add-xs"
                  onClick={() =>
                    updateDraft((prev) => {
                      const nextSecs = [...prev.sections];
                      const nextBullets = [...(nextSecs[sIdx].bullets ?? []), ""];
                      nextSecs[sIdx] = { ...nextSecs[sIdx], bullets: nextBullets };
                      return { ...prev, sections: nextSecs };
                    })
                  }
                >
                  + Add Bullet Point
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="p3-editor-card">
          <div className="p3-editor-card-header">
            <label className="p3-editor-label">Conclusion Paragraphs</label>
            <button
              type="button"
              className="p3-btn-add-sm"
              onClick={() =>
                updateDraft((prev) => ({
                  ...prev,
                  conclusion: [...(prev.conclusion ?? []), ""],
                }))
              }
            >
              + Add Conclusion Paragraph
            </button>
          </div>
          {(draft.conclusion ?? [""]).map((p, idx) => (
            <div key={idx} className="p3-editor-row">
              <textarea
                className="p3-editor-textarea"
                rows={3}
                value={p}
                onChange={(e) => {
                  const val = e.target.value;
                  updateDraft((prev) => {
                    const nextConc = [...(prev.conclusion ?? [])];
                    nextConc[idx] = val;
                    return { ...prev, conclusion: nextConc };
                  });
                }}
                placeholder={`Conclusion paragraph ${idx + 1}...`}
              />
              <button
                type="button"
                className="p3-btn-del-sm"
                onClick={() =>
                  updateDraft((prev) => ({
                    ...prev,
                    conclusion: (prev.conclusion ?? []).filter((_, i) => i !== idx),
                  }))
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="p3-editor-card">
          <div className="p3-editor-card-header">
            <label className="p3-editor-label">Frequently Asked Questions (FAQs)</label>
            <button
              type="button"
              className="p3-btn-add-sm"
              onClick={() =>
                updateDraft((prev) => ({
                  ...prev,
                  faqs: [...(prev.faqs ?? []), { question: "", answer: "" }],
                }))
              }
            >
              + Add FAQ
            </button>
          </div>

          {(draft.faqs ?? []).map((faq, fIdx) => (
            <div key={fIdx} className="p3-editor-faq-box">
              <div className="p3-faq-box-header">
                <span className="p3-section-num">FAQ {fIdx + 1}</span>
                <input
                  type="text"
                  className="p3-editor-input"
                  value={faq.question}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateDraft((prev) => {
                      const nextFaqs = [...(prev.faqs ?? [])];
                      nextFaqs[fIdx] = { ...nextFaqs[fIdx], question: val };
                      return { ...prev, faqs: nextFaqs };
                    });
                  }}
                  placeholder="Question..."
                />
                <button
                  type="button"
                  className="p3-btn-del-sm"
                  onClick={() =>
                    updateDraft((prev) => ({
                      ...prev,
                      faqs: (prev.faqs ?? []).filter((_, i) => i !== fIdx),
                    }))
                  }
                >
                  ✕ Remove FAQ
                </button>
              </div>
              <textarea
                className="p3-editor-textarea"
                rows={2}
                value={faq.answer}
                onChange={(e) => {
                  const val = e.target.value;
                  updateDraft((prev) => {
                    const nextFaqs = [...(prev.faqs ?? [])];
                    nextFaqs[fIdx] = { ...nextFaqs[fIdx], answer: val };
                    return { ...prev, faqs: nextFaqs };
                  });
                }}
                placeholder="Answer..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Blog content renderer ─────────────────────────────────────────────────────

function BlogRenderer({
  blog,
  highlightedKeyword,
}: {
  blog: SeoBlog;
  highlightedKeyword?: string | null;
}) {
  const renderText = (text: string) => {
    if (!highlightedKeyword || !highlightedKeyword.trim()) return text;
    const kw = highlightedKeyword.trim();
    const regex = new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    if (parts.length === 1) return text;
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === kw.toLowerCase() ? (
            <mark key={i} className="seo-kw-highlight">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="p3-blog-body">
      {blog.intro.map((p, i) => (
        <p key={i} className={i === 0 ? "p3-lead-p" : ""}>
          {renderText(p)}
        </p>
      ))}

      {blog.sections.map((s, sIdx) => (
        <div key={sIdx} className="p3-section">
          <h3 className="p3-h3">
            <PawHeadIcon />
            {renderText(s.heading)}
          </h3>
          {(s.paragraphs ?? []).map((p, pIdx) => (
            <p key={pIdx}>{renderText(p)}</p>
          ))}
          {(s.bullets?.length ?? 0) > 0 && (
            <ul className="p3-list">
              {s.bullets!.map((b, bIdx) => (
                <li key={bIdx}>{renderText(b)}</li>
              ))}
            </ul>
          )}
          {(s.subtopics?.length ?? 0) > 0 &&
            s.subtopics!.map((st, stIdx) => (
              <div key={stIdx} className="p3-subtopic">
                <h5 className="p3-h5">
                  <PawHeadIcon />
                  {renderText(st.subheading)}
                </h5>
                {st.paragraphs.map((p, stPIdx) => (
                  <p key={stPIdx}>{renderText(p)}</p>
                ))}
              </div>
            ))}
        </div>
      ))}

      {blog.vetCta && (
        <div className="p3-quote-card">
          <div className="p3-quote-icon">🩺</div>
          <p className="p3-quote-text">
            Get help from a CuddlyTails AI vet{" "}
            <a
              href="https://onelink.to/gf7wz3"
              target="_blank"
              rel="noopener noreferrer"
              className="p3-vet-link"
            >
              here
            </a>
            .
          </p>
        </div>
      )}

      <h3 className="p3-h3">
        <PawHeadIcon />
        Conclusion
      </h3>
      {blog.conclusion.map((p, i) => (
        <p key={i}>{renderText(p)}</p>
      ))}

      <h3 className="p3-h3">
        <PawHeadIcon />
        Frequently Asked Questions
      </h3>
      <div className="p3-faq-container">
        {blog.faqs.map((f, i) => (
          <details key={i} className="p3-faq-accordion" open={i === 0}>
            <summary className="p3-faq-summary">
              <span className="p3-faq-q">
                {renderText(f.question)}
              </span>
              <span className="p3-faq-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </summary>
            <div className="p3-faq-a">
              <p>{renderText(f.answer)}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// ── Main page component ────────────────────────────────────────────────────────

function HistoryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

export default function Page3({ onBack, isActive }: Page3Props) {
  const {
    topic,
    setTopic,
    blog,
    setBlog,
    posts,
    setPosts,
    metaDescription,
    setMetaDescription,
    activePersona,
    loading,
    error,
    postsLoading,
    postsError,
    generateBlog,
    generateLinkedInPosts,
    resetBlogState,
    blogHistory,
  } = useBlogGeneration();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([
    "Raw Food vs Kibble: Pros & Cons",
    "Dangerous Household Foods Toxic to Dogs",
    "Curing Separation Anxiety in Rescue Dogs",
    "Best High-Protein Diets for Active Dogs",
    "Understanding Dog Body Language & Signals",
  ]);

  useEffect(() => {
    setSuggestions(globalTopicEngine.getBatch(5));
  }, []);

  const shuffleIdeas = () => {
    setSuggestions(globalTopicEngine.getBatch(5));
    setPlaceholderTopic(RANDOM_PLACEHOLDERS[Math.floor(Math.random() * RANDOM_PLACEHOLDERS.length)]);
  };

  const [placeholderTopic, setPlaceholderTopic] = useState(() => {
    return RANDOM_PLACEHOLDERS[Math.floor(Math.random() * RANDOM_PLACEHOLDERS.length)];
  });

  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestTopic = () => {
    const nextTopic = globalTopicEngine.getNextTopic();
    setTopic(nextTopic);
    setPlaceholderTopic(RANDOM_PLACEHOLDERS[Math.floor(Math.random() * RANDOM_PLACEHOLDERS.length)]);

    setIsSuggesting(true);
    setTimeout(() => setIsSuggesting(false), 350);
  };

  const [activeTab, setActiveTab] = useState<keyof LinkedInPosts>("safeBet");
  const [asideTab, setAsideTab] = useState<"social" | "meta">("social");
  const [highlightedKeyword, setHighlightedKeyword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [blogCopied, setBlogCopied] = useState(false);
  const [metaCopied, setMetaCopied] = useState(false);
  const [allPostsCopied, setAllPostsCopied] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: ToastType } | null>(null);

  const triggerToast = (message: string, type: ToastType = "success") => {
    setToastInfo({ message, type });
  };

  // State for smooth loader completion exit & workspace crossfade
  const [loaderMounted, setLoaderMounted] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoaderMounted(true);
      setShowWorkspace(false);
    } else if (blog) {
      setShowWorkspace(true);
      const timer = setTimeout(() => {
        setLoaderMounted(false);
      }, 350);
      return () => clearTimeout(timer);
    } else if (error) {
      setLoaderMounted(false);
      setShowWorkspace(false);
    }
  }, [loading, blog, error]);

  const charMax = 150;

  const calculateWords = (b: SeoBlog): number => {
    const introText = b.intro.join(" ");
    const conclusionText = b.conclusion.join(" ");
    const sectionText = b.sections
      .flatMap((s) => {
        const paragraphs = s.paragraphs ?? [];
        const bullets = s.bullets ?? [];
        const subtopics = (s.subtopics ?? []).flatMap((st) => [st.subheading, ...st.paragraphs]);
        return [s.heading, ...paragraphs, ...bullets, ...subtopics];
      })
      .join(" ");
    const full = `${b.title} ${introText} ${sectionText} ${b.vetCta} ${conclusionText}`;
    return full.trim().split(/\s+/).length;
  };

  const getReadTime = (approxWords: number) => {
    const mins = Math.max(1, Math.ceil(approxWords / 225));
    return `${mins} min read`;
  };

  const calculateChars = (b: SeoBlog): number => {
    return getBlogText(b).length;
  };

  const handleUpdateBlog = (updated: SeoBlog) => {
    const count = calculateWords(updated);
    setBlog({ ...updated, approxWordCount: count });
    setIsEditing(false);
    setIsFocusMode(false);
    triggerToast("✓ Blog changes saved successfully!", "success");
  };

  const generateMetaDescription = (topicInput: string): string => {
    const cleanTopic = topicInput.trim().replace(/\.$/, "");
    const mentionsDog = /dogs?/i.test(cleanTopic);
    const topicPhrase = mentionsDog ? cleanTopic : `${cleanTopic} in dogs`;
    const lowerTopic = topicPhrase.toLowerCase();

    const variations = [
      `Learn about ${lowerTopic}. Discover common symptoms, underlying causes, effective treatment options, and practical vet advice to keep your pet healthy.`,
      `Learn about ${lowerTopic}. Discover key signs to watch for, main causes, practical treatment options, and essential vet care tips to protect your dog.`,
      `Discover essential facts about ${lowerTopic}. Learn common symptoms, underlying causes, treatment options, and when to see your vet to protect your pet.`,
      `Understand ${lowerTopic}. Learn common symptoms to watch for, main causes, treatment options, and practical tips to keep your dog safe and comfortable.`,
      `Learn all about ${lowerTopic}. Discover key symptoms, common causes, treatment options, and expert vet advice to support your pet's health and well-being.`
    ];

    for (const v of variations) {
      if (v.length >= 150 && v.length <= 160) return v;
    }

    let base = variations[0];
    for (const v of variations) {
      if (Math.abs(v.length - 155) < Math.abs(base.length - 155)) {
        base = v;
      }
    }

    if (base.length < 150) {
      const pads = [
        " Read our complete guide.",
        " Read our full guide today.",
        " Read our pet guide.",
        " Read our guide."
      ];
      for (const p of pads) {
        const padded = base.replace(/\.$/, "") + p;
        if (padded.length >= 150 && padded.length <= 160) return padded;
      }
    }

    if (base.length > 160) {
      const trims = [
        base.replace(" to keep your pet healthy.", " for your pet."),
        base.replace(" to protect your dog.", "."),
        base.replace(" to protect your pet.", "."),
        base.replace(" to support your pet's health and well-being.", ".")
      ];
      for (const t of trims) {
        if (t.length >= 150 && t.length <= 160) return t;
      }
    }

    if (base.length > 160) return base.slice(0, 157) + "...";
    return base;
  };

  const [metaOption, setMetaOption] = useState<"opt1" | "opt2">("opt1");
  const [metaDescriptionAlt, setMetaDescriptionAlt] = useState("");

  useEffect(() => {
    if (topic && topic.trim()) {
      const cleanTopic = topic.trim().replace(/\.$/, "");
      const lower = cleanTopic.toLowerCase();
      setMetaDescriptionAlt(
        `Discover expert vet advice on ${lower}. Learn key warning signs, normal health cycles, and practical care tips to keep your pet happy and thriving.`
      );
    }
  }, [topic, blog]);

  const copyMetaDescription = async (e?: React.MouseEvent) => {
    triggerMicroConfetti(e);
    const textToCopy = metaOption === "opt1" ? metaDescription : metaDescriptionAlt;
    if (!textToCopy) return;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    triggerToast("Meta description snippet copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleNewBlog = () => {
    resetBlogState();
  };

  const copyActivePost = async (e?: React.MouseEvent) => {
    triggerMicroConfetti(e);
    if (!posts) return;
    await navigator.clipboard.writeText(posts[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getBlogText = (b: SeoBlog) => {
    const activeMeta = (metaOption === "opt1" ? metaDescription : metaDescriptionAlt) || metaDescription || metaDescriptionAlt || "";
    const sectionBlocks = b.sections
      .map((s) => {
        const paragraphBlock = (s.paragraphs ?? []).join("\n\n");
        const bulletBlock = (s.bullets ?? []).map((item) => `- ${item}`).join("\n");
        const subtopicBlock = (s.subtopics ?? [])
          .map((st) => `##### ${st.subheading}\n\n${st.paragraphs.join("\n\n")}`)
          .join("\n\n");
        return [`### ${s.heading}`, paragraphBlock, bulletBlock, subtopicBlock]
          .filter(Boolean)
          .join("\n\n");
      })
      .join("\n\n");

    const faqBlock = b.faqs.map((f) => `**${f.question}**\n\n${f.answer}`).join("\n\n");
    const metaBlock = activeMeta ? `**Meta Description:** ${activeMeta}` : "";

    return [
      `# ${b.title}`,
      b.intro.join("\n\n"),
      sectionBlocks,
      b.vetCta,
      `### Conclusion`,
      b.conclusion.join("\n\n"),
      `### Frequently Asked Questions`,
      faqBlock,
      metaBlock,
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const formatHtmlParagraphs = (paragraphsInput: any, itemStyle = "font-size: 14px; color: #334155; line-height: 1.75; margin-bottom: 14px; text-align: justify;"): string => {
    if (!paragraphsInput) return "";
    const arr = Array.isArray(paragraphsInput)
      ? paragraphsInput
      : typeof paragraphsInput === "string"
      ? paragraphsInput.split(/\n\n+/)
      : [String(paragraphsInput)];

    return arr
      .map((p) => {
        const str = String(p).trim();
        if (!str) return "";
        if (/^\s*<[a-z1-6]/i.test(str)) {
          return str;
        }
        return `<p style="${itemStyle}">${str}</p>`;
      })
      .filter(Boolean)
      .join("");
  };

  const getBlogHtml = (b: SeoBlog) => {
    const activeMeta = (metaOption === "opt1" ? metaDescription : metaDescriptionAlt) || metaDescription || metaDescriptionAlt || "";
    const introHtml = formatHtmlParagraphs(b.intro, "font-size: 11pt; line-height: 1.6; color: #334155; margin-bottom: 12px;");

    const sectionHtml = (b.sections || [])
      .map((s) => {
        const headingText = String(s.heading || "").replace(/<[^>]*>/g, "").trim();
        const pBlock = formatHtmlParagraphs(s.paragraphs, "font-size: 11pt; line-height: 1.6; color: #334155; margin-bottom: 12px;");
        const bBlock =
          (s.bullets?.length ?? 0) > 0
            ? `<ul style="margin-bottom: 12px; padding-left: 20px; color: #334155;">${s.bullets!.map((item) => `<li style="font-size: 11pt; margin-bottom: 4px;">${item.replace(/<[^>]*>/g, "")}</li>`).join("")}</ul>`
            : "";
        const stBlock = (s.subtopics ?? [])
          .map(
            (st) =>
              `<h3 style="font-size: 13pt; font-weight: bold; color: #16A34A; margin-top: 14px; margin-bottom: 6px;">${st.subheading.replace(/<[^>]*>/g, "")}</h3>${formatHtmlParagraphs(st.paragraphs, "font-size: 11pt; line-height: 1.6; color: #334155; margin-bottom: 12px;")}`
          )
          .join("");

        return `<h2 style="font-size: 15pt; font-weight: bold; color: #166534; margin-top: 20px; margin-bottom: 10px;">${headingText}</h2>${pBlock}${bBlock}${stBlock}`;
      })
      .join("");

    const ctaHtml = `<p style="font-size: 11pt; margin-top: 16px;">Get help from a CuddlyTails AI vet <a href="https://onelink.to/gf7wz3" style="color: #2D8A4E; font-weight: bold; text-decoration: underline;">here</a>.</p>`;

    const conclusionHtml = (b.conclusion?.length ?? 0) > 0
      ? `<h2 style="font-size: 15pt; font-weight: bold; color: #166534; margin-top: 20px; margin-bottom: 10px;">Conclusion</h2>${formatHtmlParagraphs(b.conclusion, "font-size: 11pt; line-height: 1.6; color: #334155; margin-bottom: 12px;")}`
      : "";

    const faqHtml = (b.faqs?.length ?? 0) > 0
      ? `<h2 style="font-size: 15pt; font-weight: bold; color: #166534; margin-top: 20px; margin-bottom: 10px;">Frequently Asked Questions</h2>` +
        b.faqs.map((f) => `<p style="font-size: 11pt; margin-bottom: 4px;"><b>${f.question.replace(/<[^>]*>/g, "")}</b></p><p style="font-size: 11pt; margin-bottom: 12px; color: #334155;">${f.answer.replace(/<[^>]*>/g, "")}</p>`).join("")
      : "";

    const metaHtml = activeMeta
      ? `<p style="font-size: 11pt; margin-top: 16px; color: #64748B;"><b>Meta Description:</b> ${activeMeta.replace(/<[^>]*>/g, "")}</p>`
      : "";

    return `<h1 style="font-size: 20pt; font-weight: bold; color: #0F172A; border-bottom: 2px solid #2D8A4E; padding-bottom: 8px; margin-bottom: 16px;">${(b.title || "").replace(/<[^>]*>/g, "")}</h1>${introHtml}${sectionHtml}${ctaHtml}${conclusionHtml}${faqHtml}${metaHtml}`;
  };

  const exportAsText = (b: SeoBlog, e?: React.MouseEvent) => {
    if (e) triggerMicroConfetti(e);
    const fullText = getBlogText(b);
    const blobUrl = URL.createObjectURL(new Blob([fullText], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${b.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    triggerToast("Downloaded Markdown (.md) file!", "markdown");
  };

  const downloadMarkdown = (b: SeoBlog) => {
    const activeMeta = (metaOption === "opt1" ? metaDescription : metaDescriptionAlt) || metaDescription || metaDescriptionAlt || "";
    let md = `# ${(b.title || "").replace(/<[^>]*>/g, "")}\n\n`;
    (Array.isArray(b.intro) ? b.intro : [b.intro]).forEach((p) => { md += `${String(p).replace(/<[^>]*>/g, "")}\n\n`; });
    (b.sections || []).forEach((s) => {
      md += `## ${(s.heading || "").replace(/<[^>]*>/g, "")}\n\n`;
      const paras = Array.isArray(s.paragraphs) ? s.paragraphs : [s.paragraphs];
      paras.forEach((p) => { if (p) md += `${String(p).replace(/<[^>]*>/g, "")}\n\n`; });
      if (s.bullets) {
        s.bullets.forEach((bullet) => { md += `- ${String(bullet).replace(/<[^>]*>/g, "")}\n`; });
        md += `\n`;
      }
      if (s.subtopics) {
        s.subtopics.forEach((st) => {
          md += `### ${(st.subheading || "").replace(/<[^>]*>/g, "")}\n\n`;
          (st.paragraphs || []).forEach((p) => { md += `${String(p).replace(/<[^>]*>/g, "")}\n\n`; });
        });
      }
    });
    if (b.vetCta) md += `> **Veterinary Advice:** ${String(b.vetCta).replace(/<[^>]*>/g, "")}\n\n`;
    if (b.conclusion) {
      md += `## Conclusion\n\n`;
      (Array.isArray(b.conclusion) ? b.conclusion : [b.conclusion]).forEach((p) => { md += `${String(p).replace(/<[^>]*>/g, "")}\n\n`; });
    }
    if (b.faqs) {
      md += `## Frequently Asked Questions\n\n`;
      b.faqs.forEach((faq) => {
        md += `### ${String(faq.question).replace(/<[^>]*>/g, "")}\n${String(faq.answer).replace(/<[^>]*>/g, "")}\n\n`;
      });
    }
    if (activeMeta) {
      md += `**Meta Description:** ${activeMeta.replace(/<[^>]*>/g, "")}\n\n`;
    }

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = (b.title || "SEO_Blog").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".md";
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast("Downloaded Markdown (.md) file!", "markdown");
  };

  const downloadHtml = (b: SeoBlog) => {
    const fullHtml = getBlogHtml(b);
    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${(b.title || "SEO Blog").replace(/<[^>]*>/g, "")}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; }
    h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    h2 { color: #166534; margin-top: 32px; }
    h3 { color: #15803d; }
    blockquote { background: #f8fafc; border-left: 4px solid #68B77A; padding: 12px 18px; margin: 20px 0; font-style: italic; }
    .faq-item { background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 12px; }
  </style>
</head>
<body>
  ${fullHtml}
</body>
</html>`;

    const blob = new Blob([htmlDocument], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = (b.title || "SEO_Blog").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".html";
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast("Downloaded HTML (.html) file!", "html");
  };

  const exportAsWord = (b: SeoBlog, e?: React.MouseEvent) => {
    triggerMicroConfetti(e);
    const rawTitle = (b.title || "CuddlyTails_SEO_Blog").replace(/<[^>]*>/g, "");
    const filename = `${rawTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}.doc`;
    const wordCount = b.approxWordCount || calculateWords(b) || 1200;

    const introHtml = formatHtmlParagraphs(b.intro, "font-size: 11pt; font-style: italic; line-height: 1.6; color: #334155; margin-bottom: 12pt;");

    const sectionsHtml = (b.sections || []).map((s) => {
      const headingText = String(s.heading || "").replace(/<[^>]*>/g, "");
      const pBlock = formatHtmlParagraphs(s.paragraphs, "font-size: 11pt; line-height: 1.6; color: #111B25; margin-bottom: 10pt; text-align: justify;");
      const bBlock = (s.bullets?.length ?? 0) > 0
        ? `<ul style="margin-bottom: 10pt; padding-left: 18pt;">${s.bullets!.map((item) => `<li style="font-size: 11pt;">${item.replace(/<[^>]*>/g, "")}</li>`).join("")}</ul>`
        : "";
      const stBlock = (s.subtopics ?? [])
        .map((st) => `<h3 style="color: #2D8A4E; font-size: 13pt; margin-top: 12pt; margin-bottom: 4pt;">${st.subheading.replace(/<[^>]*>/g, "")}</h3>${formatHtmlParagraphs(st.paragraphs, "font-size: 11pt; line-height: 1.6; color: #111B25; margin-bottom: 10pt; text-align: justify;")}`)
        .join("");
      return `<h2 style="color: #1B4D3E; font-size: 16pt; margin-top: 18pt; margin-bottom: 6pt; border-bottom: 1px solid #E2E8F0; padding-bottom: 4pt;">${headingText}</h2>${pBlock}${bBlock}${stBlock}`;
    }).join("");

    const ctaHtml = b.vetCta ? `<p style="font-size: 11pt; margin-top: 12pt;"><strong>Veterinary Advice:</strong> ${String(b.vetCta).replace(/<[^>]*>/g, "")}</p>` : "";
    const conclusionHtml = (b.conclusion?.length ?? 0) > 0
      ? `<h2 style="color: #1B4D3E; font-size: 16pt; margin-top: 18pt; margin-bottom: 6pt;">Conclusion</h2>${formatHtmlParagraphs(b.conclusion, "font-size: 11pt; line-height: 1.6; color: #111B25; margin-bottom: 10pt; text-align: justify;")}`
      : "";
    const faqHtml = (b.faqs?.length ?? 0) > 0
      ? `<h2 style="color: #1B4D3E; font-size: 16pt; margin-top: 18pt; margin-bottom: 6pt;">Frequently Asked Questions</h2>${b.faqs.map((faq) => `<div class="faq-item" style="background: #FAFAFA; border-left: 3pt solid #2D8A4E; padding: 8pt 12pt; margin-bottom: 10pt;"><div class="faq-q" style="font-weight: bold; color: #1B4D3E; margin-bottom: 4pt;">Q: ${faq.question.replace(/<[^>]*>/g, "")}</div><div style="font-size: 11pt; color: #334155;">A: ${faq.answer.replace(/<[^>]*>/g, "")}</div></div>`).join("")}`
      : "";

    const wordHtml = [
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>",
      "<head><meta charset='utf-8'>",
      `<title>${rawTitle}</title>`,
      "<style>",
      "body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #111B25; padding: 20px; }",
      "h1 { color: #1B4D3E; font-size: 22pt; margin-bottom: 8pt; border-bottom: 2px solid #2D8A4E; padding-bottom: 6pt; }",
      "h2 { color: #1B4D3E; font-size: 16pt; margin-top: 18pt; margin-bottom: 6pt; }",
      "h3 { color: #2D8A4E; font-size: 13pt; margin-top: 12pt; margin-bottom: 4pt; }",
      "p { margin-bottom: 10pt; text-align: justify; }",
      ".meta-box { background: #F0F7F2; border: 1px solid #2D8A4E; padding: 12pt; border-radius: 6pt; margin-bottom: 16pt; }",
      ".faq-item { background: #FAFAFA; border-left: 3pt solid #2D8A4E; padding: 8pt 12pt; margin-bottom: 10pt; }",
      ".faq-q { font-weight: bold; color: #1B4D3E; margin-bottom: 4pt; }",
      ".footer { font-size: 9pt; color: #737C82; margin-top: 24pt; border-top: 1pt solid #DDD; padding-top: 8pt; text-align: center; }",
      "</style></head><body>",
      `<div class="meta-box"><strong>CuddlyTails SEO Blog Article</strong><br/><strong>Topic Title:</strong> ${rawTitle}<br/><strong>Word Count:</strong> ~${wordCount} words &bull; <strong>Read Time:</strong> ${getReadTime(wordCount)}</div>`,
      `<h1>${rawTitle}</h1>`,
      introHtml,
      sectionsHtml,
      ctaHtml,
      conclusionHtml,
      faqHtml,
      `<div class="footer">Generated by CuddlyTails Content Engine &bull; Confidential & &copy; ${new Date().getFullYear()} CuddlyTails</div>`,
      "</body></html>"
    ].join("\n");

    const blob = new Blob(["\ufeff", wordHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    triggerToast("Downloaded Word (.doc) document!", "word");
  };

  const exportAsPdf = (b: SeoBlog, e?: React.MouseEvent) => {
    triggerMicroConfetti(e);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      triggerToast("Please allow popups to export PDF printout.", "pdf");
      return;
    }

    const rawTitle = (b.title || "CuddlyTails_SEO_Blog").replace(/<[^>]*>/g, "");
    const wordCount = b.approxWordCount || calculateWords(b) || 1200;

    const introHtml = formatHtmlParagraphs(b.intro, "font-size: 14px; color: #334155; font-style: italic; line-height: 1.75; margin-bottom: 16px;");

    const sectionsHtml = (b.sections || []).map((s) => {
      const headingText = String(s.heading || "").replace(/<[^>]*>/g, "");
      const pBlock = formatHtmlParagraphs(s.paragraphs, "font-size: 14px; color: #334155; line-height: 1.75; margin-bottom: 14px; text-align: justify;");
      const bBlock = (s.bullets?.length ?? 0) > 0
        ? `<ul style="margin-bottom: 14px; padding-left: 22px; color: #334155;">${s.bullets!.map((item) => `<li style="font-size: 14px; margin-bottom: 6px; line-height: 1.6;">${item.replace(/<[^>]*>/g, "")}</li>`).join("")}</ul>`
        : "";
      const stBlock = (s.subtopics ?? [])
        .map((st) => `<h3 style="color: #2D8A4E; font-size: 16px; font-weight: 700; margin-top: 18px; margin-bottom: 8px;">${st.subheading.replace(/<[^>]*>/g, "")}</h3>${formatHtmlParagraphs(st.paragraphs, "font-size: 14px; color: #334155; line-height: 1.75; margin-bottom: 14px; text-align: justify;")}`)
        .join("");
      return `<h2 style="color: #1B4D3E; font-size: 19px; font-weight: 700; margin-top: 24px; margin-bottom: 10px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">${headingText}</h2>${pBlock}${bBlock}${stBlock}`;
    }).join("");

    const ctaHtml = b.vetCta ? `<div class="intro-box" style="background: #F0FDF4; border-left: 4px solid #2D8A4E; padding: 14px 18px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #166534;"><strong>Veterinary Advice:</strong> ${String(b.vetCta).replace(/<[^>]*>/g, "")}</div>` : "";
    const conclusionHtml = (b.conclusion?.length ?? 0) > 0
      ? `<h2 style="color: #1B4D3E; font-size: 19px; font-weight: 700; margin-top: 24px; margin-bottom: 10px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">Conclusion</h2>${formatHtmlParagraphs(b.conclusion, "font-size: 14px; color: #334155; line-height: 1.75; margin-bottom: 14px; text-align: justify;")}`
      : "";
    const faqHtml = (b.faqs?.length ?? 0) > 0
      ? `<h2 style="color: #1B4D3E; font-size: 19px; font-weight: 700; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">Frequently Asked Questions</h2>${b.faqs.map((faq) => `<div class="faq-card" style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px 18px; border-radius: 8px; margin-bottom: 12px;"><div class="faq-q" style="font-size: 14px; font-weight: 700; color: #1B4D3E; margin-bottom: 6px;">Q: ${faq.question.replace(/<[^>]*>/g, "")}</div><div class="faq-a" style="font-size: 13.5px; color: #334155; line-height: 1.6;">A: ${faq.answer.replace(/<[^>]*>/g, "")}</div></div>`).join("")}`
      : "";

    const htmlStr = [
      "<!DOCTYPE html>",
      "<html><head>",
      `<title>${rawTitle} - CuddlyTails Printable Document</title>`,
      "<style>",
      "@page { size: A4 portrait; margin: 15mm 18mm; }",
      "@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } h1, h2, h3 { page-break-after: avoid; } .faq-card { page-break-inside: avoid; } }",
      "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; line-height: 1.65; padding: 10px; }",
      ".header-bar { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2D8A4E; padding-bottom: 12px; margin-bottom: 20px; }",
      ".brand-logo { font-size: 20px; font-weight: 800; color: #1B4D3E; letter-spacing: -0.01em; }",
      ".meta-chip { background: #EAF5EC; color: #1B4D3E; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 12px; border: 1px solid rgba(45, 138, 78, 0.25); }",
      "h1 { color: #0F172A; font-size: 24px; font-weight: 800; margin-bottom: 16px; line-height: 1.35; }",
      ".intro-lead { font-size: 15px; color: #334155; font-style: italic; line-height: 1.75; background: #F8FAF9; padding: 16px 20px; border-left: 4px solid #2D8A4E; border-radius: 0 8px 8px 0; margin-bottom: 24px; }",
      "h2 { color: #1B4D3E; font-size: 19px; font-weight: 700; margin-top: 24px; margin-bottom: 10px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; }",
      "h3 { color: #2D8A4E; font-size: 16px; font-weight: 700; margin-top: 18px; margin-bottom: 8px; }",
      "p { font-size: 14px; color: #334155; margin-bottom: 14px; text-align: justify; line-height: 1.75; }",
      ".faq-card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px 18px; border-radius: 8px; margin-bottom: 12px; }",
      ".faq-q { font-size: 14px; font-weight: 700; color: #1B4D3E; margin-bottom: 6px; }",
      ".faq-a { font-size: 13.5px; color: #334155; line-height: 1.6; }",
      ".footer { margin-top: 40px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 12px; }",
      "</style></head><body>",
      `<div class="header-bar"><div class="brand-logo">CuddlyTails SEO Blog</div><div class="meta-chip">~${wordCount} words &bull; ${getReadTime(wordCount)}</div></div>`,
      `<h1>${rawTitle}</h1>`,
      `<div class="intro-lead">${introHtml}</div>`,
      sectionsHtml,
      ctaHtml,
      conclusionHtml,
      faqHtml,
      `<div class="footer">Printed from CuddlyTails SEO & Content Suite &bull; ${new Date().toLocaleDateString()}</div>`,
      "</body></html>"
    ].join("\n");

    printWindow.document.write(htmlStr);
    printWindow.document.close();
    printWindow.onload = () => {
      try { printWindow.print(); } catch {}
    };
    triggerToast("Opened print dialog for PDF export!", "pdf");
  };

  const copyAllLinkedInPosts = async (p: LinkedInPosts, e?: React.MouseEvent) => {
    triggerMicroConfetti(e);
    const combined = `=== OPTION 1: SAFE BET ===\n${p.safeBet}\n\n=== OPTION 2: CLEAN-LABEL ===\n${p.cleanLabel}\n\n=== OPTION 3: MICRO-STORY ===\n${p.microStory}`;
    await navigator.clipboard.writeText(combined);
    triggerToast("All 3 social posts copied to clipboard!", "success");
    setAllPostsCopied(true);
    setTimeout(() => setAllPostsCopied(false), 2000);
  };

  const copyBlogToClipboard = async (b: SeoBlog, e?: React.MouseEvent) => {
    triggerMicroConfetti(e);
    const fullText = getBlogText(b);
    const fullHtml = getBlogHtml(b);

    try {
      if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        const item = new ClipboardItem({
          "text/html": new Blob([fullHtml], { type: "text/html" }),
          "text/plain": new Blob([fullText], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(fullText);
      }
      setBlogCopied(true);
      triggerToast("SEO Blog article copied to clipboard!", "success");
      setTimeout(() => setBlogCopied(false), 1500);
    } catch {
      await navigator.clipboard.writeText(fullText);
      setBlogCopied(true);
      triggerToast("SEO Blog article copied to clipboard!", "success");
      setTimeout(() => setBlogCopied(false), 1500);
    }
  };

  const isCompactWorkspace = Boolean(blog);

  return (
    <div className={`p3-root ${isCompactWorkspace ? "p3-root--compact" : ""}`} style={{ width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      {toastInfo && <Toast message={toastInfo.message} type={toastInfo.type} onClose={() => setToastInfo(null)} />}
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} initialMode="blogs" />

      {/* ── Page header (Collapses smoothly ONLY AFTER blog generation finishes 100%) ── */}
      <div className={`p3-header p3-header-collapsible ${isCompactWorkspace ? "p3-collapsed" : ""}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="p3-header-text">

          <div className="p3-step-chip-wrapper">
            <span className="p3-step-chip">
              <span className="p3-step-chip-dot" />
              <span className="p3-step-chip-text">STEP 3 OF 3</span>
              <span className="p3-step-chip-divider">•</span>
              <span className="p3-step-chip-tag">FINAL STEP</span>
            </span>
          </div>
          <h1 className="p3-heading">SEO Blog Generator</h1>
          <p className="p3-subheading">
            Describe a topic and get a ~1200-word blog with an intro, subheadings,<br />
            and 5 FAQs. Leave this blank to finish without generating a blog.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsHistoryOpen(true)}
          style={{
            background: "rgba(104, 183, 122, 0.12)",
            border: "1px solid rgba(104, 183, 122, 0.3)",
            color: "#68B77A",
            padding: "8px 14px",
            borderRadius: "10px",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            marginTop: "12px",
          }}
        >
          <HistoryIcon /> History ({blogHistory.length})
        </button>
      </div>

      {/* ── Topic input (Pinned Top-Center in Compact Mode) ── */}
      <form
        className={`p3-field ${isCompactWorkspace ? "p3-field--compact" : ""}`}
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading && topic.trim()) {
            generateBlog(topic.trim());
          }
        }}
      >
        <div className="p3-input-bar">
          <span className="p3-input-sparkle"><GreenSparklesIcon /></span>
          
          <input
            id="p3-topic-input"
            type="text"
            autoComplete="off"
            className={`p3-input ${isSuggesting ? "p3-input--highlight" : ""}`}
            placeholder={placeholderTopic}
            value={topic}
            maxLength={charMax}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!loading && topic.trim()) {
                  generateBlog(topic.trim());
                }
              }
            }}
          />

          <span className="p3-input-char-count">{topic.length} / {charMax}</span>
          <span className="p3-input-divider" aria-hidden="true" />

          <button
            type="button"
            className={`p3-input-idea-btn ${isSuggesting ? "p3-idea-pop spin-anim" : ""}`}
            onClick={handleSuggestTopic}
            title="Suggest a new topic idea"
            aria-label="Suggest a topic"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#68B77A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", minWidth: 20, minHeight: 20 }}>
              <path
                d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"
                fill="rgba(104, 183, 122, 0.3)"
              />
              <path d="M9 18h6" />
              <path d="M10 21h4" />
            </svg>
          </button>

          <motion.button
            id="p3-gen-btn"
            type="submit"
            disabled={loading || !topic.trim()}
            title={loading ? "Generating Blog..." : !topic.trim() ? "Type a topic to generate" : blog ? "Regenerate Blog" : "Generate Blog"}
            initial="rest"
            whileHover={(loading || !topic.trim()) ? undefined : "hover"}
            whileTap={(loading || !topic.trim()) ? undefined : { scale: 0.90 }}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: (loading || !topic.trim()) ? "rgba(104, 183, 122, 0.25)" : "linear-gradient(135deg, #68B77A 0%, #4E985E 100%)",
              color: (loading || !topic.trim()) ? "rgba(255, 255, 255, 0.4)" : "#FFFFFF",
              border: "none",
              position: "relative",
              overflow: "hidden",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: (loading || !topic.trim()) ? "not-allowed" : "pointer",
              boxShadow: (loading || !topic.trim()) ? "none" : "0 3px 12px rgba(104, 183, 122, 0.45)",
              transition: "all 0.2s ease",
              flexShrink: 0,
              opacity: (loading || !topic.trim()) ? 0.45 : 1,
              padding: 0,
            }}
          >
            {loading ? (
              <span className="p3-spinner" style={{ width: "18px", height: "18px", color: "#FFFFFF" }} />
            ) : (
              <>
                <motion.div
                  variants={{
                    rest: { y: "0%", opacity: 1 },
                    hover: { y: "-130%", opacity: 0 },
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  <ArrowUpIcon />
                </motion.div>
                <motion.div
                  variants={{
                    rest: { y: "130%", opacity: 0 },
                    hover: { y: "0%", opacity: 1 },
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  <ArrowUpIcon />
                </motion.div>
              </>
            )}
          </motion.button>

          {isCompactWorkspace && (
            <button
              type="button"
              className="p3-new-blog-btn"
              onClick={handleNewBlog}
              title="Start a new blog topic"
            >
              <PlusIcon />
              <span>New Blog</span>
            </button>
          )}
        </div>

        {/* Collapsible Meta Note & Idea Chips */}
        <div className={`p3-chips-collapsible ${isCompactWorkspace ? "p3-collapsed" : ""}`}>
          <div className="p3-field-meta">
            <span>Press Enter to generate</span>
          </div>

          <div className="p3-chips-wrap">
            <div className="p3-chips-header" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="p3-chips-label">IDEAS:</span>
              <button
                type="button"
                onClick={shuffleIdeas}
                title="Shuffle Pet Topic Ideas"
                aria-label="Shuffle Pet Topic Ideas"
                className="p3-shuffle-btn-interactive"
                style={{
                  background: "#C6F6D5",
                  border: "1.5px solid #2D8A4E",
                  color: "#1E6B37",
                  cursor: "pointer",
                  padding: "4px 10px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  borderRadius: "8px",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  boxShadow: "0 2px 6px rgba(45, 138, 78, 0.15)",
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 3 21 3 21 8" />
                  <line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" />
                  <line x1="15" y1="15" x2="21" y2="21" />
                  <line x1="4" y1="4" x2="9" y2="9" />
                </svg>
                <span>Shuffle</span>
              </button>
            </div>
            <div className="p3-chips-list">
              {suggestions.map((chipText) => (
                <button
                  key={chipText}
                  type="button"
                  className={`p3-chip-btn${topic === chipText ? " active" : ""}`}
                  onClick={() => {
                    setTopic(chipText);
                    document.getElementById("p3-topic-input")?.focus();
                  }}
                >
                  {chipText}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* ── Error ────────────────────────────────────────────── */}
      {error && <p className="p3-error">{error}</p>}

      {/* ── Concept 3: Inline Full Workspace Skeleton Swap Loader ── */}
      {loaderMounted && (!blog || loading) && (
        <StudioCanvasSkeleton
          topic={topic}
          isDone={!loading && !!blog}
        />
      )}

      {/* ── Workspace (two-column after generation with smooth crossfade) ──────────── */}
      {blog && (showWorkspace || !loaderMounted) && (
        <div className={`p3-workspace text-reveal-entry p3-workspace--expanded p3-workspace-crossfade ${showWorkspace || !loaderMounted ? "visible" : ""}`}>

          {/* LEFT — Blog preview */}
          <div className="p3-panel">
            <div className="p3-panel-bar">
              <span className="p3-panel-label">
                {blog.title}
              </span>
              <div className="p3-panel-bar-right">
                <div className="p3-action-toolbar">
                  <button
                    id="p3-top-copy-blog-btn"
                    className={`p3-toolbar-btn p3-toolbar-btn--copy ${blogCopied ? "copied-pop" : ""}`}
                    onClick={(e) => copyBlogToClipboard(blog, e)}
                    title={blogCopied ? "Copied to clipboard!" : "Copy formatted blog content"}
                  >
                    {blogCopied ? <CheckIcon /> : <CopyIcon />}
                  </button>

                  <span className="p3-toolbar-sep" />

                  <button
                    id="p3-top-export-btn"
                    className="p3-toolbar-btn p3-toolbar-btn--export"
                    onClick={(e) => exportAsText(blog, e)}
                    title="Export markdown (.md) file"
                  >
                    <ExportIcon />
                  </button>

                  <span className="p3-toolbar-sep" />

                  <button
                    className="p3-toolbar-btn p3-toolbar-btn--focus"
                    onClick={() => setIsFocusMode(true)}
                    title="Open in Studio Canvas"
                  >
                    <ExpandIcon />
                  </button>

                  <span className="p3-toolbar-sep" />

                  <div className="p3-menu-wrapper">
                    <button
                      id="p3-menu-btn"
                      className="p3-toolbar-btn p3-toolbar-btn--menu"
                      onClick={() => setMenuOpen(!menuOpen)}
                      aria-label="More options"
                      title="More actions & exports"
                    >
                      <MoreHorizontalIcon />
                    </button>
                  {menuOpen && (
                    <>
                      <div
                        className="p3-dropdown-backdrop"
                        onClick={() => setMenuOpen(false)}
                      />
                      <div className="p3-dropdown-menu">
                        <button
                          type="button"
                          className="p3-dropdown-item p3-dropdown-item--purple"
                          onClick={() => {
                            setIsEditing(true);
                            setIsFocusMode(true);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="glass-icon-badge glass-icon-badge--sm"><EditPenIcon /></span>
                          <span>Edit Blog in Studio Canvas</span>
                        </button>

                        <button
                          type="button"
                          className="p3-dropdown-item p3-dropdown-item--green"
                          onClick={() => {
                            downloadMarkdown(blog);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="glass-icon-badge glass-icon-badge--sm"><DownloadIcon /></span>
                          <span>Download Markdown (.md)</span>
                        </button>

                        <button
                          type="button"
                          className="p3-dropdown-item p3-dropdown-item--blue"
                          onClick={() => {
                            downloadHtml(blog);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="glass-icon-badge glass-icon-badge--sm"><GlobeIcon /></span>
                          <span>Download HTML (.html)</span>
                        </button>

                        <button
                          type="button"
                          className="p3-dropdown-item p3-dropdown-item--navy"
                          onClick={(e) => {
                            exportAsWord(blog, e);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="glass-icon-badge glass-icon-badge--sm"><WordDocIcon /></span>
                          <span>Download Word (.doc)</span>
                        </button>

                        <button
                          type="button"
                          className="p3-dropdown-item p3-dropdown-item--red"
                          onClick={(e) => {
                            exportAsPdf(blog, e);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="glass-icon-badge glass-icon-badge--sm"><PdfFileIcon /></span>
                          <span>Download PDF / Print</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

            {/* Live SEO Quality Gauge & Metrics */}
            <SeoMeter
              blog={blog}
              metaDescription={metaDescription}
              isActive={isActive}
              highlightedKeyword={highlightedKeyword}
              onSelectKeyword={setHighlightedKeyword}
            />

            <div className="p3-scroll">
              <BlogRenderer blog={blog} highlightedKeyword={highlightedKeyword} />
            </div>
          </div>

          {/* RIGHT — Tabbed Sidebar (Social Engine vs Meta Snippet & Keywords) */}
          <div className="p3-panel p3-panel--aside">
            <div className="p3-panel-bar p3-aside-header-bar">
              <div className="p3-aside-tab-bar">
                <button
                  type="button"
                  className={`p3-aside-tab p3-aside-tab--social ${asideTab === "social" ? "active" : ""}`}
                  onClick={() => setAsideTab("social")}
                >
                  <LinkedInIcon /> Social Engine
                </button>
                <button
                  type="button"
                  className={`p3-aside-tab p3-aside-tab--meta ${asideTab === "meta" ? "active" : ""}`}
                  onClick={() => setAsideTab("meta")}
                >
                  <SearchIcon /> Meta &amp; SEO Keywords
                </button>
              </div>
            </div>

            <div className="p3-aside-tab-body">
              {asideTab === "social" ? (
                <>

                  <button
                    id="p3-gen-posts-btn"
                    className="p3-btn p3-btn--teal p3-btn--full"
                    onClick={generateLinkedInPosts}
                    disabled={postsLoading}
                  >
                    {postsLoading ? <span className="p3-spinner" /> : "+ Generate Social Posts"}
                  </button>

                  <hr className="p3-aside-divider" />
                  <p className="p3-aside-style-label">CONTENT ANGLE</p>

                  <div className="p3-tabs">
                    {TABS.map((tab) => (
                      <button
                        key={tab.key}
                        id={`p3-tab-${tab.key}`}
                        className={`p3-tab p3-tab--${tab.colorClass}${activeTab === tab.key ? " p3-tab--active" : ""}`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {postsError && <p className="p3-error p3-error--sm">{postsError}</p>}

                  {posts && (
                    <>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", marginBottom: 6 }}>
                        <p className="p3-section-label" style={{ margin: 0, padding: 0 }}>PREVIEW</p>
                        <button
                          type="button"
                          className={`p3-btn p3-btn--ghost p3-btn--sm ${copied ? "copied-pop" : ""}`}
                          onClick={(e) => copyActivePost(e)}
                          title="Copy active post text"
                          aria-label="Copy active post text"
                          style={{ width: "26px", height: "26px", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        >
                          {copied ? <CheckIcon /> : <CopyIcon />}
                        </button>
                      </div>
                      <div className="p3-preview">
                        <p className="p3-preview-text">{posts[activeTab]}</p>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="p3-meta-card" style={{ background: "transparent", border: "none", padding: 0, margin: 0, boxShadow: "none" }}>
                  <div className="p3-meta-header" style={{ marginBottom: 10 }}>
                    <div className="p3-meta-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <SearchIcon />
                      <span>Meta Description Snippets</span>
                    </div>
                  </div>

                  {/* Option 1 & Option 2 Side-by-Side Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginBottom: "12px" }}>
                    {/* Option 1 Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent, #68B77A)", margin: 0 }}>
                          Option 1: Search Focus
                        </label>
                        <button
                          type="button"
                          className="p3-btn p3-btn--ghost p3-btn--sm"
                          onClick={async (e) => {
                            triggerMicroConfetti(e);
                            await navigator.clipboard.writeText(metaDescription);
                            triggerToast("Option 1 Meta description copied!", "success");
                          }}
                          title="Copy Option 1 Meta"
                          aria-label="Copy Option 1 Meta"
                          style={{ width: "24px", height: "24px", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <CopyIcon />
                        </button>
                      </div>
                      <textarea
                        className="p3-meta-textarea"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="SEO-friendly meta description (150–160 characters)..."
                        rows={4}
                      />
                      <div className="p3-meta-footer">
                        <span
                          className={`p3-meta-count ${
                            metaDescription.length >= 150 && metaDescription.length <= 160
                              ? "p3-meta-count--optimal"
                              : ""
                          }`}
                        >
                          {metaDescription.length} / 160 chars (Optimal: 150–160)
                        </span>
                      </div>
                    </div>

                    {/* Option 2 Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent, #68B77A)", margin: 0 }}>
                          Option 2: Vet Advice
                        </label>
                        <button
                          type="button"
                          className="p3-btn p3-btn--ghost p3-btn--sm"
                          onClick={async (e) => {
                            triggerMicroConfetti(e);
                            await navigator.clipboard.writeText(metaDescriptionAlt);
                            triggerToast("Option 2 Meta description copied!", "success");
                          }}
                          title="Copy Option 2 Meta"
                          aria-label="Copy Option 2 Meta"
                          style={{ width: "24px", height: "24px", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <CopyIcon />
                        </button>
                      </div>
                      <textarea
                        className="p3-meta-textarea"
                        value={metaDescriptionAlt}
                        onChange={(e) => setMetaDescriptionAlt(e.target.value)}
                        placeholder="Alternative SEO-friendly meta description (150–160 characters)..."
                        rows={4}
                      />
                      <div className="p3-meta-footer">
                        <span
                          className={`p3-meta-count ${
                            metaDescriptionAlt.length >= 150 && metaDescriptionAlt.length <= 160
                              ? "p3-meta-count--optimal"
                              : ""
                          }`}
                        >
                          {metaDescriptionAlt.length} / 160 chars (Optimal: 150–160)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p3-aside-kw-highlighter-block">
                    <hr className="p3-aside-divider" style={{ margin: "14px 0" }} />
                    <p className="p3-aside-style-label" style={{ marginBottom: 8 }}>KEYWORD DENSITY HIGHLIGHTER</p>
                    <p className="p3-aside-desc" style={{ marginBottom: 12 }}>
                      Click any keyword in the SEO meter below to highlight every occurrence in the article text with glowing green pills!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Studio Focus Canvas Modal ───────────────── */}
      {isFocusMode && blog && (
        <div
          className="p3-focus-backdrop"
          onClick={() => {
            if (isEditing) {
              if (
                window.confirm(
                  "You have unsaved changes in the Studio Canvas. Are you sure you want to exit without saving?"
                )
              ) {
                setIsEditing(false);
                setIsFocusMode(false);
              }
            } else {
              setIsFocusMode(false);
            }
          }}
        >
          <div className="p3-focus-modal" onClick={(e) => e.stopPropagation()}>
            <div className="p3-focus-header">
              <div className="p3-focus-left">
                <span className="p3-focus-title-text" title={blog.title}>{blog.title}</span>
                <span className="p3-dash-badge p3-dash-badge--purple">~{blog.approxWordCount} words</span>
                {isEditing && (
                  <span className="p3-dash-badge p3-dash-badge--seo" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <EditPenIcon />
                    Studio Canvas Active
                  </span>
                )}
              </div>
              <div className="p3-focus-actions">
                {!isEditing ? (
                  <div className="p3-action-toolbar">
                    <button
                      className="p3-toolbar-btn p3-toolbar-btn--edit"
                      onClick={() => setIsEditing(true)}
                      title="Edit Blog in Studio Canvas"
                    >
                      <EditPenIcon />
                    </button>

                    <span className="p3-toolbar-sep" />

                    <button
                      className={`p3-toolbar-btn p3-toolbar-btn--copy ${blogCopied ? "copied-pop" : ""}`}
                      onClick={(e) => copyBlogToClipboard(blog, e)}
                      title={blogCopied ? "Copied to clipboard!" : "Copy formatted blog content"}
                    >
                      {blogCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>

                    <span className="p3-toolbar-sep" />

                    <button
                      className="p3-toolbar-btn p3-toolbar-btn--export"
                      onClick={(e) => exportAsText(blog, e)}
                      title="Export markdown (.md) file"
                    >
                      <ExportIcon />
                    </button>

                    <span className="p3-toolbar-sep" />

                    <button
                      className="p3-toolbar-btn p3-toolbar-btn--close"
                      onClick={() => setIsFocusMode(false)}
                      title="Exit Studio Canvas"
                    >
                      <CloseXIcon />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="p3-focus-content">
              {isEditing ? (
                <StudioCanvasEditor
                  blog={blog}
                  onSave={handleUpdateBlog}
                  onCancel={() => {
                    setIsEditing(false);
                    setIsFocusMode(false);
                  }}
                />
              ) : (
                <BlogRenderer blog={blog} />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}