import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { LinkedInPosts, SeoBlog } from "@/lib/types";
import PawLoader from "@/components/PawLoader";
import Toast from "@/components/Toast";
import SeoMeter from "@/components/SeoMeter";
import HistoryDrawer from "@/components/HistoryDrawer";
import { useBlogGeneration } from "@/lib/BlogGenerationContext";

interface Page3Props {
  onBack: () => void;
  isActive?: boolean;
}

const TABS: Array<{ key: keyof LinkedInPosts; label: string }> = [
  { key: "safeBet", label: "Safe Bet" },
  { key: "cleanLabel", label: "Clean-Label" },
  { key: "microStory", label: "Micro-Story" },
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="15,3 21,3 21,9" />
      <polyline points="9,21 3,21 3,15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function PawHeadIcon() {
  return (
    <span className="p3-paw-prefix" aria-hidden="true">
      🐾
    </span>
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
            <span className="glass-icon-badge glass-icon-badge--sm"><EditPenIcon /></span>
            Studio Canvas Editor
          </span>
          {isDirty && <span className="p3-dirty-tag">Unsaved Edits</span>}
        </div>
        {error && <div className="p3-editor-error">{error}</div>}
        <div className="p3-editor-actions">
          <button type="button" className="p3-btn p3-btn--ghost" onClick={handleExit}>
            Cancel
          </button>
          <button type="button" className="p3-btn p3-btn--teal p3-btn--pop" onClick={handleSave} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <CheckIcon /> Save Changes
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
              <p className="p3-faq-q">
                <strong>{renderText(f.question)}</strong>
              </p>
              <span className="p3-faq-arrow">›</span>
            </summary>
            <p className="p3-faq-a">{renderText(f.answer)}</p>
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
  };

  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestTopic = () => {
    const nextTopic = globalTopicEngine.getNextTopic();
    setTopic(nextTopic);

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
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // State for smooth loader completion exit & workspace crossfade
  const [loaderMounted, setLoaderMounted] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoaderMounted(true);
      setShowWorkspace(false);
    } else if (error) {
      setLoaderMounted(false);
    }
  }, [loading, error]);

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

  const calculateChars = (b: SeoBlog): number => {
    return getBlogText(b).length;
  };

  const handleUpdateBlog = (updated: SeoBlog) => {
    const count = calculateWords(updated);
    setBlog({ ...updated, approxWordCount: count });
    setIsEditing(false);
    setIsFocusMode(false);
    setToastMsg("✓ Blog changes saved successfully!");
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
    setToastMsg("Meta description snippet copied to clipboard!");
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

  const getBlogHtml = (b: SeoBlog) => {
    const activeMeta = (metaOption === "opt1" ? metaDescription : metaDescriptionAlt) || metaDescription || metaDescriptionAlt || "";
    const introHtml = b.intro.map((p) => `<p style="font-size: 11pt;">${p}</p>`).join("");

    const sectionHtml = b.sections
      .map((s) => {
        const pBlock = (s.paragraphs ?? []).map((p) => `<p style="font-size: 11pt;">${p}</p>`).join("");
        const bBlock =
          (s.bullets?.length ?? 0) > 0
            ? `<ul>${s.bullets!.map((item) => `<li style="font-size: 11pt;">${item}</li>`).join("")}</ul>`
            : "";
        const stBlock = (s.subtopics ?? [])
          .map(
            (st) =>
              `<h3 style="font-size: 13pt; font-weight: bold;">${st.subheading}</h3>${st.paragraphs
                .map((p) => `<p style="font-size: 11pt;">${p}</p>`)
                .join("")}`
          )
          .join("");

        return `<h2 style="font-size: 15pt; font-weight: bold;">${s.heading}</h2>${pBlock}${bBlock}${stBlock}`;
      })
      .join("");

    const ctaHtml = `<p style="font-size: 11pt;">Get help from a CuddlyTails AI vet <a href="https://onelink.to/gf7wz3" style="color: #68B77A; font-weight: bold; text-decoration: underline;">here</a>.</p>`;

    const conclusionHtml = `<h2 style="font-size: 15pt; font-weight: bold;">Conclusion</h2>${b.conclusion.map((p) => `<p style="font-size: 11pt;">${p}</p>`).join("")}`;

    const faqHtml =
      `<h2 style="font-size: 15pt; font-weight: bold;">Frequently Asked Questions</h2>` +
      b.faqs.map((f) => `<p style="font-size: 11pt;"><b>${f.question}</b></p><p style="font-size: 11pt;">${f.answer}</p>`).join("");

    const metaHtml = activeMeta
      ? `<p style="font-size: 11pt; margin-top: 16px;"><b>Meta Description:</b> ${activeMeta}</p>`
      : "";

    return `<h1 style="font-size: 20pt; font-weight: bold;">${b.title}</h1>${introHtml}${sectionHtml}${ctaHtml}${conclusionHtml}${faqHtml}${metaHtml}`;
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
  };





  const downloadMarkdown = (b: SeoBlog) => {
    const activeMeta = (metaOption === "opt1" ? metaDescription : metaDescriptionAlt) || metaDescription || metaDescriptionAlt || "";
    let md = `# ${b.title}\n\n`;
    b.intro.forEach((p) => { md += `${p}\n\n`; });
    b.sections.forEach((s) => {
      md += `## ${s.heading}\n\n`;
      if (s.paragraphs) s.paragraphs.forEach((p) => { md += `${p}\n\n`; });
      if (s.bullets) {
        s.bullets.forEach((bullet) => { md += `- ${bullet}\n`; });
        md += `\n`;
      }
      if (s.subtopics) {
        s.subtopics.forEach((st) => {
          md += `### ${st.subheading}\n\n`;
          st.paragraphs.forEach((p) => { md += `${p}\n\n`; });
        });
      }
    });
    if (b.vetCta) md += `> **Veterinary Advice:** ${b.vetCta}\n\n`;
    if (b.conclusion) {
      md += `## Conclusion\n\n`;
      b.conclusion.forEach((p) => { md += `${p}\n\n`; });
    }
    if (b.faqs) {
      md += `## Frequently Asked Questions\n\n`;
      b.faqs.forEach((faq) => {
        md += `### ${faq.question}\n${faq.answer}\n\n`;
      });
    }
    if (activeMeta) {
      md += `**Meta Description:** ${activeMeta}\n\n`;
    }

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = (b.title || "SEO_Blog").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".md";
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setToastMsg("Downloaded Markdown (.md) file!");
  };

  const downloadHtml = (b: SeoBlog) => {
    const fullHtml = getBlogHtml(b);
    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${b.title}</title>
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
    setToastMsg("Downloaded HTML (.html) file!");
  };

  const exportAsWord = (b: SeoBlog, e?: React.MouseEvent) => {
    triggerMicroConfetti(e);
    const title = b.title || "CuddlyTails_SEO_Blog";
    const filename = `${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.doc`;
    const wordCount = b.approxWordCount || calculateWords(b) || 1200;

    const introHtml = Array.isArray(b.intro)
      ? b.intro.map((p) => `<p><em>${p}</em></p>`).join("")
      : (b.intro || (b as any).introduction ? `<p><em>${b.intro || (b as any).introduction}</em></p>` : "");

    const sectionsHtml = (b.sections || []).map((s) => {
      const pBlock = (s.paragraphs ?? []).map((p) => `<p>${p}</p>`).join("");
      const bBlock = (s.bullets?.length ?? 0) > 0
        ? `<ul>${s.bullets!.map((item) => `<li>${item}</li>`).join("")}</ul>`
        : "";
      const stBlock = (s.subtopics ?? [])
        .map((st) => `<h3>${st.subheading}</h3>${(st.paragraphs ?? []).map((p) => `<p>${p}</p>`).join("")}`)
        .join("");
      return `<h2>${s.heading}</h2>${pBlock}${bBlock}${stBlock}`;
    }).join("");

    const ctaHtml = b.vetCta ? `<p><strong>Veterinary Advice:</strong> ${b.vetCta}</p>` : "";
    const conclusionHtml = (b.conclusion?.length ?? 0) > 0
      ? `<h2>Conclusion</h2>${b.conclusion.map((p) => `<p>${p}</p>`).join("")}`
      : "";
    const faqHtml = (b.faqs?.length ?? 0) > 0
      ? `<h2>Frequently Asked Questions (FAQs)</h2>${b.faqs.map((faq) => `<div class="faq-item"><div class="faq-q">Q: ${faq.question}</div><div>A: ${faq.answer}</div></div>`).join("")}`
      : "";

    const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #111B25; padding: 20px; }
          h1 { color: #1B4D3E; font-size: 22pt; margin-bottom: 8pt; border-bottom: 2px solid #68B77A; padding-bottom: 6pt; }
          h2 { color: #1B4D3E; font-size: 16pt; margin-top: 18pt; margin-bottom: 6pt; }
          h3 { color: #1B4D3E; font-size: 13pt; margin-top: 12pt; margin-bottom: 4pt; }
          p { margin-bottom: 10pt; text-align: justify; }
          .meta-box { background: #F0F7F2; border: 1px solid #68B77A; padding: 12pt; border-radius: 6pt; margin-bottom: 16pt; }
          .faq-item { background: #FAFAFA; border-left: 3pt solid #68B77A; padding: 8pt 12pt; margin-bottom: 10pt; }
          .faq-q { font-weight: bold; color: #1B4D3E; margin-bottom: 4pt; }
          .footer { font-size: 9pt; color: #737C82; margin-top: 24pt; border-top: 1pt solid #DDD; padding-top: 8pt; text-align: center; }
        </style>
      </head>
      <body>
        <div class="meta-box">
          <strong>🐾 CuddlyTails SEO Blog Article</strong><br/>
          <strong>Topic Title:</strong> ${title}<br/>
          <strong>Word Count:</strong> ~${wordCount} words &bull; <strong>Read Time:</strong> ${getReadTime(wordCount)}
        </div>

        <h1>${title}</h1>
        ${introHtml}
        ${sectionsHtml}
        ${ctaHtml}
        ${conclusionHtml}
        ${faqHtml}

        <div class="footer">
          Generated by CuddlyTails Content Engine &bull; Confidential & &copy; ${new Date().getFullYear()} CuddlyTails
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", wordHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToastMsg("Downloaded Word (.doc) document!");
  };

  const exportAsPdf = (b: SeoBlog, e?: React.MouseEvent) => {
    triggerMicroConfetti(e);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setToastMsg("Please allow popups to export PDF printout.");
      return;
    }

    const title = b.title || "CuddlyTails_SEO_Blog";
    const wordCount = b.approxWordCount || calculateWords(b) || 1200;

    const introHtml = Array.isArray(b.intro)
      ? b.intro.map((p) => `<p>${p}</p>`).join("")
      : (b.intro || (b as any).introduction ? `<p>${b.intro || (b as any).introduction}</p>` : "");

    const sectionsHtml = (b.sections || []).map((s) => {
      const pBlock = (s.paragraphs ?? []).map((p) => `<p>${p}</p>`).join("");
      const bBlock = (s.bullets?.length ?? 0) > 0
        ? `<ul>${s.bullets!.map((item) => `<li>${item}</li>`).join("")}</ul>`
        : "";
      const stBlock = (s.subtopics ?? [])
        .map((st) => `<h3>${st.subheading}</h3>${(st.paragraphs ?? []).map((p) => `<p>${p}</p>`).join("")}`)
        .join("");
      return `<h2>${s.heading}</h2>${pBlock}${bBlock}${stBlock}`;
    }).join("");

    const ctaHtml = b.vetCta ? `<div class="intro"><strong>Veterinary Advice:</strong> ${b.vetCta}</div>` : "";
    const conclusionHtml = (b.conclusion?.length ?? 0) > 0
      ? `<h2>Conclusion</h2>${b.conclusion.map((p) => `<p>${p}</p>`).join("")}`
      : "";
    const faqHtml = (b.faqs?.length ?? 0) > 0
      ? `<h2>Frequently Asked Questions</h2>${b.faqs.map((faq) => `<div class="faq-card"><div class="faq-q">Q: ${faq.question}</div><div class="faq-a">A: ${faq.answer}</div></div>`).join("")}`
      : "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - CuddlyTails Printable Document</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111B25; line-height: 1.6; padding: 10px; }
          .header-bar { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #68B77A; padding-bottom: 12px; margin-bottom: 20px; }
          .brand-logo { font-size: 20px; font-weight: bold; color: #1B4D3E; }
          .meta-chip { background: #EAF5EC; color: #1B4D3E; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 12px; }
          h1 { color: #111B25; font-size: 24px; margin-bottom: 14px; }
          .intro { font-size: 15px; color: #3A4750; font-style: italic; line-height: 1.7; background: #F8FAF9; padding: 14px; border-left: 4px solid #68B77A; margin-bottom: 24px; }
          h2 { color: #1B4D3E; font-size: 18px; margin-top: 24px; margin-bottom: 10px; border-bottom: 1px solid #E5E9EB; padding-bottom: 4px; }
          h3 { color: #15803d; font-size: 15px; margin-top: 16px; margin-bottom: 8px; }
          p { font-size: 14px; color: #232C33; margin-bottom: 14px; text-align: justify; }
          .faq-card { background: #FAFAFA; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; }
          .faq-q { font-size: 14px; font-weight: bold; color: #1B4D3E; margin-bottom: 6px; }
          .faq-a { font-size: 13.5px; color: #334155; }
          .footer { margin-top: 40px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header-bar">
          <div class="brand-logo">🐾 CuddlyTails SEO Blog</div>
          <div class="meta-chip">~${wordCount} words &bull; ${getReadTime(wordCount)}</div>
        </div>

        <h1>${title}</h1>
        <div class="intro">${introHtml}</div>
        ${sectionsHtml}
        ${ctaHtml}
        ${conclusionHtml}
        ${faqHtml}

        <div class="footer">
          Printed from CuddlyTails SEO & Content Suite &bull; ${new Date().toLocaleDateString()}
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
    setToastMsg("Opened print dialog for PDF export!");
  };

  const copyAllLinkedInPosts = async (p: LinkedInPosts, e?: React.MouseEvent) => {
    triggerMicroConfetti(e);
    const combined = `=== OPTION 1: SAFE BET ===\n${p.safeBet}\n\n=== OPTION 2: CLEAN-LABEL ===\n${p.cleanLabel}\n\n=== OPTION 3: MICRO-STORY ===\n${p.microStory}`;
    await navigator.clipboard.writeText(combined);
    setToastMsg("All 3 social posts copied to clipboard!");
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
      setToastMsg("SEO Blog article copied to clipboard!");
      setTimeout(() => setBlogCopied(false), 1500);
    } catch {
      await navigator.clipboard.writeText(fullText);
      setBlogCopied(true);
      setToastMsg("SEO Blog article copied to clipboard!");
      setTimeout(() => setBlogCopied(false), 1500);
    }
  };

  const getReadTime = (approxWords: number) => {
    const mins = Math.max(1, Math.ceil(approxWords / 225));
    return `${mins} min read`;
  };

  const isCompactWorkspace = Boolean(blog);

  return (
    <div className={`p3-root ${isCompactWorkspace ? "p3-root--compact" : ""}`}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} initialMode="blogs" />

      {/* ── Page header (Collapses smoothly ONLY AFTER blog generation finishes 100%) ── */}
      <div className={`p3-header p3-header-collapsible ${isCompactWorkspace ? "p3-collapsed" : ""}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="p3-header-text">
          <div className="p3-brand-persona-badge">
            <span className="p3-persona-dot" />
            <span className="p3-persona-icon">{activePersona.icon}</span>
            <span className="p3-persona-label">ACTIVE BRAND PERSONA:</span>
            <span className="p3-persona-value">{activePersona.name}</span>
            <span className="p3-persona-sep">•</span>
            <span className="p3-persona-target">{activePersona.target}</span>
          </div>
          <br />
          <span className="p3-step-chip">STEP 3 OF 3</span>
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
            generateBlog(topic);
          }
        }}
      >
        <div className="p3-input-bar">
          <span className="p3-input-sparkle"><GreenSparklesIcon /></span>
          
          <input
            id="p3-topic-input"
            type="text"
            className={`p3-input ${isSuggesting ? "p3-input--highlight" : ""}`}
            placeholder="Joint care for large breed dogs"
            value={topic}
            maxLength={charMax}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!loading && topic.trim()) {
                  generateBlog(topic);
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

          <button
            id="p3-gen-btn"
            type="submit"
            className="p3-input-gen-btn"
            disabled={loading || !topic.trim()}
          >
            {loading ? <span className="p3-spinner" /> : <GreenSparklesIcon />}
            {loading ? "Generating…" : blog ? "Regenerate" : "Generate Blog"}
          </button>

          {isCompactWorkspace && (
            <button
              type="button"
              className="p3-btn p3-btn--ghost p3-btn--sm"
              onClick={handleNewBlog}
              title="Start a new blog topic"
              style={{ height: "42px", marginLeft: "4px" }}
            >
              New Blog
            </button>
          )}
        </div>

        {/* Collapsible Meta Note & Idea Chips */}
        <div className={`p3-chips-collapsible ${isCompactWorkspace ? "p3-collapsed" : ""}`}>
          <div className="p3-field-meta">
            <span>Press Enter to generate</span>
          </div>

          <div className="p3-chips-wrap">
            <div className="p3-chips-header">
              <span className="p3-chips-label">IDEAS:</span>
              <button
                type="button"
                className="p3-shuffle-btn"
                onClick={shuffleIdeas}
                title="Shuffle new topic ideas"
              >
                🔀 Shuffle ideas
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
                  🐾 {chipText}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* ── Error ────────────────────────────────────────────── */}
      {error && <p className="p3-error">{error}</p>}

      {/* ── Funky Loader Modal when AI is generating blog ── */}
      {loaderMounted && (
        <FunkyCounterLoader
          topic={topic}
          isDone={!loading && !!blog}
          onCrossfadeStart={() => setShowWorkspace(true)}
          onFullyExited={() => setLoaderMounted(false)}
        />
      )}

      {/* ── Workspace (two-column after generation with smooth crossfade) ──────────── */}
      {blog && (showWorkspace || !loaderMounted) && (
        <div className={`p3-workspace text-reveal-entry p3-workspace--expanded p3-workspace-crossfade ${showWorkspace || !loaderMounted ? "visible" : ""}`}>

          {/* LEFT — Blog preview */}
          <div className="p3-panel">
            <div className="p3-panel-bar">
              <span className="p3-panel-label">
                <span className="p3-ribbon-badge"><RibbonIcon /></span>
                {blog.title}
              </span>
              <div className="p3-panel-bar-right">
                <button
                  id="p3-top-copy-blog-btn"
                  className={`p3-btn p3-btn--ghost p3-btn--sm ${blogCopied ? "copied-pop" : ""}`}
                  onClick={(e) => copyBlogToClipboard(blog, e)}
                  title="Copy formatted blog content"
                >
                  {blogCopied ? <CheckIcon /> : <CopyIcon />}
                  {blogCopied ? "Copied!" : "Copy"}
                </button>
                <button
                  id="p3-top-export-btn"
                  className="p3-btn p3-btn--ghost p3-btn--sm"
                  onClick={(e) => exportAsText(blog, e)}
                  title="Export markdown (.md) file"
                >
                  <ExportIcon />
                  Export .md
                </button>
                <button
                  className="p3-focus-toggle-btn"
                  onClick={() => setIsFocusMode(true)}
                  title="Expand to Full Studio Canvas"
                >
                  <ExpandIcon /> Open in Studio Canvas
                </button>
                
                <div className="p3-menu-wrapper">
                  <button
                    id="p3-menu-btn"
                    className="p3-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="More options"
                    title="More actions & exports"
                  >
                    ⋯
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
                          className="p3-dropdown-item"
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
                          className="p3-dropdown-item"
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
                          className="p3-dropdown-item"
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
                          className="p3-dropdown-item"
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
                          className="p3-dropdown-item"
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

            <div className="p3-panel-actions">
              <button
                id="p3-edit-blog-btn"
                className="p3-btn p3-btn--teal"
                onClick={() => {
                  setIsEditing(true);
                  setIsFocusMode(true);
                }}
              >
                ✏️ Edit Blog in Studio
              </button>
              <button
                id="p3-copy-blog-btn"
                className={`p3-btn p3-btn--ghost ${blogCopied ? "copied-pop" : ""}`}
                onClick={(e) => copyBlogToClipboard(blog, e)}
              >
                {blogCopied ? <CheckIcon /> : <CopyIcon />}
                {blogCopied ? "Copied!" : "Copy"}
              </button>
              <button
                id="p3-export-btn"
                className="p3-btn p3-btn--ghost"
                onClick={(e) => exportAsText(blog, e)}
              >
                <ExportIcon />
                Export .md
              </button>
            </div>
          </div>

          {/* RIGHT — Tabbed Sidebar (Social Engine vs Meta Snippet & Keywords) */}
          <div className="p3-panel p3-panel--aside">
            <div className="p3-panel-bar p3-aside-header-bar">
              <div className="p3-aside-tab-bar">
                <button
                  type="button"
                  className={`p3-aside-tab ${asideTab === "social" ? "active" : ""}`}
                  onClick={() => setAsideTab("social")}
                >
                  <LinkedInIcon /> Social Engine
                </button>
                <button
                  type="button"
                  className={`p3-aside-tab ${asideTab === "meta" ? "active" : ""}`}
                  onClick={() => setAsideTab("meta")}
                >
                  <SearchIcon /> Meta & SEO Keywords
                </button>
              </div>
            </div>

            <div className="p3-aside-tab-body">
              {asideTab === "social" ? (
                <>
                  <p className="p3-aside-desc">
                    Turn this blog into multi-channel social posts for LinkedIn, Instagram, and X.
                  </p>

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
                        className={`p3-tab${activeTab === tab.key ? " p3-tab--active" : ""}`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {postsError && <p className="p3-error p3-error--sm">{postsError}</p>}

                  {posts && (
                    <>
                      <p className="p3-section-label">PREVIEW</p>
                      <div className="p3-preview">
                        <p className="p3-preview-text">{posts[activeTab]}</p>
                      </div>

                      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                        <button
                          id="p3-copy-post-btn"
                          className={`p3-btn p3-btn--ghost p3-btn--full ${copied ? "copied-pop" : ""}`}
                          onClick={(e) => copyActivePost(e)}
                          style={{ flex: 1 }}
                        >
                          {copied ? <CheckIcon /> : <CopyIcon />}
                          {copied ? "Copied!" : "Copy Active"}
                        </button>
                        <button
                          type="button"
                          className={`p3-btn p3-btn--ghost p3-btn--full ${allPostsCopied ? "copied-pop" : ""}`}
                          onClick={(e) => copyAllLinkedInPosts(posts, e)}
                          title="Copy all 3 post variations at once"
                          style={{ flex: 1 }}
                        >
                          {allPostsCopied ? <CheckIcon /> : <CopyIcon />}
                          {allPostsCopied ? " Copied All!" : " Copy All 3"}
                        </button>
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
                    <button
                      type="button"
                      className={`p3-btn p3-btn--ghost p3-btn--sm ${metaCopied ? "copied-pop" : ""}`}
                      onClick={(e) => copyMetaDescription(e)}
                    >
                      {metaCopied ? <CheckIcon /> : <CopyIcon />}
                      {metaCopied ? "Copied!" : "Copy Active Meta"}
                    </button>
                  </div>

                  {/* Option 1 vs Option 2 Sub-tabs */}
                  <div className="p3-tabs" style={{ marginBottom: 10 }}>
                    <button
                      type="button"
                      className={`p3-tab ${metaOption === "opt1" ? "p3-tab--active" : ""}`}
                      onClick={() => setMetaOption("opt1")}
                    >
                      Option 1 (Search Focus)
                    </button>
                    <button
                      type="button"
                      className={`p3-tab ${metaOption === "opt2" ? "p3-tab--active" : ""}`}
                      onClick={() => setMetaOption("opt2")}
                    >
                      Option 2 (Vet Advice)
                    </button>
                  </div>

                  {metaOption === "opt1" ? (
                    <>
                      <textarea
                        className="p3-meta-textarea"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="SEO-friendly meta description (150–160 characters)..."
                        rows={4}
                      />
                      <div className="p3-meta-footer" style={{ marginTop: 6, marginBottom: 12 }}>
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
                    </>
                  ) : (
                    <>
                      <textarea
                        className="p3-meta-textarea"
                        value={metaDescriptionAlt}
                        onChange={(e) => setMetaDescriptionAlt(e.target.value)}
                        placeholder="Alternative SEO-friendly meta description (150–160 characters)..."
                        rows={4}
                      />
                      <div className="p3-meta-footer" style={{ marginTop: 6, marginBottom: 12 }}>
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
                    </>
                  )}

                  <hr className="p3-aside-divider" style={{ margin: "14px 0" }} />
                  <p className="p3-aside-style-label" style={{ marginBottom: 8 }}>KEYWORD DENSITY HIGHLIGHTER</p>
                  <p className="p3-aside-desc" style={{ marginBottom: 12 }}>
                    Click any keyword in the SEO meter below to highlight every occurrence in the article text with glowing green pills!
                  </p>
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
                <RibbonIcon />
                <span className="p3-focus-title-text" title={blog.title}>{blog.title}</span>
                <span className="p3-dash-badge p3-dash-badge--purple">~{blog.approxWordCount} words</span>
                {isEditing && (
                  <span className="p3-dash-badge p3-dash-badge--seo" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span className="glass-icon-badge glass-icon-badge--sm"><EditPenIcon /></span>
                    Studio Canvas Active
                  </span>
                )}
              </div>
              <div className="p3-focus-actions">
                {!isEditing ? (
                  <>
                    <button
                      className="p3-btn p3-btn--teal"
                      onClick={() => setIsEditing(true)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      <span className="glass-icon-badge glass-icon-badge--sm"><EditPenIcon /></span>
                      Edit Blog
                    </button>
                    <button
                      className={`p3-btn p3-btn--ghost ${blogCopied ? "copied-pop" : ""}`}
                      onClick={(e) => copyBlogToClipboard(blog, e)}
                    >
                      {blogCopied ? <CheckIcon /> : <CopyIcon />} {blogCopied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      className="p3-btn p3-btn--ghost"
                      onClick={(e) => exportAsText(blog, e)}
                    >
                      <ExportIcon /> Export .md
                    </button>
                    <button
                      className="p3-btn p3-btn--ghost"
                      onClick={() => setIsFocusMode(false)}
                    >
                      ✕ Exit Studio
                    </button>
                  </>
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