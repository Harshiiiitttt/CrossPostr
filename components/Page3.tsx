import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import type { LinkedInPosts, SeoBlog } from "@/lib/types";
import PawLoader from "@/components/PawLoader";
import Toast, { type ToastType } from "@/components/Toast";
import SeoMeter from "@/components/SeoMeter";
import HistoryDrawer from "@/components/HistoryDrawer";
import { useBlogGeneration } from "@/lib/BlogGenerationContext";
import { computeSeoScore } from "@/lib/seoCalculator";

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

function FileTextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ScrollTextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <line x1="15" y1="8" x2="9" y2="8" />
      <line x1="15" y1="12" x2="9" y2="12" />
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

function SparkleStarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function PawPrintIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#15803D" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M12 12.8c-3.2 0-5.8 1.4-5.8 3.5 0 2.1 2.6 3.5 5.8 3.5s5.8-1.4 5.8-3.5c0-2.1-2.6-3.5-5.8-3.5z" />
      <circle cx="7" cy="9.2" r="2.2" />
      <circle cx="10.4" cy="6.2" r="2.2" />
      <circle cx="13.6" cy="6.2" r="2.2" />
      <circle cx="17" cy="9.2" r="2.2" />
    </svg>
  );
}

function BarChartSmallIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function CarTopicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <path d="M14 16H9m10 0h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-1.5a2 2 0 0 1-1.6-.8L15 6H9L7.1 9.2A2 2 0 0 1 5.5 10H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="17.5" cy="16.5" r="2.5" />
    </svg>
  );
}

function EyeTopicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HealthShieldIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  );
}

function BoneTopicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <path d="M17 10c.7-.7 1.6-1 2.5-.7 1.2.4 1.8 1.7 1.5 2.9-.3.9-1.1 1.5-2 1.6l-10 4c-.9.3-1.9 0-2.5-.7-1.2-.4-1.8-1.7-1.5-2.9.3-.9 1.1-1.5 2-1.6l10-4z" />
      <circle cx="17.5" cy="8.5" r="2" />
      <circle cx="19.5" cy="11.5" r="2" />
      <circle cx="4.5" cy="15.5" r="2" />
      <circle cx="6.5" cy="12.5" r="2" />
    </svg>
  );
}

function BowlTopicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z" />
      <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

function ToothTopicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <path d="M12 2C8.5 2 6 4.5 6 7c0 3.5 1.5 7.5 3 11 1 2 2 4 3 4s2-2 3-4c1.5-3.5 3-7.5 3-11 0-2.5-2.5-5-6-5z" />
    </svg>
  );
}

function GraduationTopicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function BathTopicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
      <path d="M6 12V5a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function FootstepTopicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1" />
      <path d="M16 8l-4-4-4 4" />
      <line x1="12" y1="4" x2="12" y2="16" />
    </svg>
  );
}

function AppleTopicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <path d="M12 20.5C6.5 20.5 4 16 4 11.5c0-4 3-7.5 7-7.5 1.5 0 2.5.5 3 .5s1.5-.5 3-.5c4 0 7 3.5 7 7.5 0 4.5-2.5 9-8 9z" />
      <path d="M12 4c.5-1.5 2-2.5 3.5-2.5" />
    </svg>
  );
}

function PawTopicBadgeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: "block", margin: "auto", flexShrink: 0 }}>
      <ellipse cx="12" cy="16.2" rx="5.4" ry="4.6" />
      <ellipse cx="5.2" cy="8.8" rx="2.1" ry="2.7" />
      <ellipse cx="10.1" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="14.7" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="19" cy="8.8" rx="2.1" ry="2.7" />
    </svg>
  );
}

function getTopicSvgIcon(topic: string = "", title: string = "", iconType?: string) {
  if (iconType) {
    switch (iconType) {
      case "bone": return <BoneTopicIcon />;
      case "tooth": return <ToothTopicIcon />;
      case "eye": return <EyeTopicIcon />;
      case "car": return <CarTopicIcon />;
      case "graduation": return <GraduationTopicIcon />;
      case "bowl": return <BowlTopicIcon />;
      case "apple": return <AppleTopicIcon />;
      case "bath": return <BathTopicIcon />;
      case "footstep": return <FootstepTopicIcon />;
      case "shield": return <HealthShieldIcon />;
      case "paw": return <PawTopicBadgeIcon />;
    }
  }

  const text = `${topic} ${title}`.toLowerCase();

  // 1. Bone / Broth / Joints / Arthritis
  if (text.match(/bone|broth|joint|arthritis|hip|cartilage/)) {
    return <BoneTopicIcon />;
  }

  // 2. Dental / Teeth / Breath
  if (text.match(/teeth|dental|tooth|breath|gums|plaque/)) {
    return <ToothTopicIcon />;
  }

  // 3. Eyes / Vision / Swollen
  if (text.match(/eye|vision|swollen|sight|cataract|blind/)) {
    return <EyeTopicIcon />;
  }

  // 4. Car / Travel / Road Trip / Transport
  if (text.match(/car|road|trip|travel|drive|transport|ride|vehicle/)) {
    return <CarTopicIcon />;
  }

  // 5. Training / Behavior / Puppy / Leash / Bark
  if (text.match(/train|behavior|bark|leash|puppy|school|command|bite|chew|anxiety|obey/)) {
    return <GraduationTopicIcon />;
  }

  // 6. Food / Nutrition / Diet / Bowl / Kibble / Eat
  if (text.match(/food|diet|nutrition|feed|kibble|eat|stomach|digest|recipe|bowl/)) {
    return <BowlTopicIcon />;
  }

  // 7. Safe Fruits / Treats / Snacks / Apple
  if (text.match(/fruit|treat|snack|apple|toxic|safe|vegetable/)) {
    return <AppleTopicIcon />;
  }

  // 8. Bath / Grooming / Shampoo / Fur / Wash
  if (text.match(/bath|groom|wash|shampoo|clean|fur|coat|skin|brush|shedding|scissors/)) {
    return <BathTopicIcon />;
  }

  // 9. Walking / Hiking / Exercise / Outdoor
  if (text.match(/walk|hike|exercise|run|outdoor|park|activity|footstep/)) {
    return <FootstepTopicIcon />;
  }

  // 10. Medical / Vet / Health / Emergency / Disease / Shield
  if (text.match(/health|disease|hereditary|vet|medical|shield|illness|cure|vaccine|sick|doctor|infection|flea|tick|bloat|gdv|emergency/)) {
    return <HealthShieldIcon />;
  }

  // Default fallback
  return <PawTopicBadgeIcon />;
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-1px", marginRight: "3px" }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function BlogCardItem({
  item,
  onLoadItem,
  onDeleteItem,
}: {
  item: any;
  onLoadItem: (item: any) => void;
  onDeleteItem?: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const seo = computeSeoScore(item.blog, item.metaDescription);
  const topicSvg = getTopicSvgIcon(item.topic, item.blog?.title, item.iconType);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(item.blog?.title || item.topic || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {}
    setMenuOpen(false);
    setConfirmDelete(false);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteItem) {
      onDeleteItem(item.id);
    }
    setMenuOpen(false);
    setConfirmDelete(false);
  };

  return (
    <motion.div
      key={item.id}
      ref={cardRef}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "16px",
        padding: "18px",
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "16px",
        position: "relative",
      }}
    >
      <div>
        {/* Top Badge & Time Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <span
            style={{
              background: seo.total >= 85 ? "#ECFDF5" : seo.total >= 70 ? "#FEF3C7" : "#FEF2F2",
              border: `1px solid ${seo.color}`,
              color: seo.color,
              fontSize: "0.74rem",
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: "999px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {seo.total >= 85 && <StarIcon />}
            SEO {seo.total}%
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", position: "relative" }}>
            <span style={{ fontSize: "0.74rem", color: "#64748B", fontWeight: 600 }}>
              {formatRelativeTime(item.timestamp)}
            </span>

            {/* 3-Dots Context Menu Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
                setConfirmDelete(false);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#64748B",
                fontSize: "1.1rem",
                lineHeight: 1,
                cursor: "pointer",
                padding: "2px 4px",
                borderRadius: "4px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Draft options"
            >
              ⋮
            </button>

            {/* Dropdown Menu with Inline Confirmation */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    zIndex: 50,
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
                    padding: "6px",
                    minWidth: confirmDelete ? "165px" : "140px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {!confirmDelete ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCopy}
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          color: "#0F172A",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <CopyIcon /> {copied ? "Copied" : "Copy Title"}
                      </button>

                      {onDeleteItem && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(true);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            color: "#DC2626",
                            fontSize: "0.76rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <TrashIcon /> Delete Draft
                        </button>
                      )}
                    </>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "2px" }}>
                      <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#991B1B" }}>
                        Delete this draft?
                      </span>

                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(false);
                          }}
                          style={{
                            flex: 1,
                            background: "#F1F5F9",
                            border: "none",
                            borderRadius: "6px",
                            padding: "5px 8px",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: "#475569",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={handleConfirmDelete}
                          style={{
                            flex: 1,
                            background: "#DC2626",
                            border: "none",
                            borderRadius: "6px",
                            padding: "5px 8px",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            color: "#FFFFFF",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Middle Topic SVG Icon + Title & Subtitle */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div
            style={{
              width: "42px",
              minWidth: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#E8F5E9",
              border: "1px solid #C8E6C9",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1B5E20",
              flexShrink: 0,
              overflow: "hidden",
              boxSizing: "border-box",
              padding: 0,
            }}
          >
            {topicSvg}
          </div>

          <div>
            <h5
              style={{
                fontSize: "0.92rem",
                fontWeight: 800,
                color: "#0F172A",
                margin: "0 0 4px 0",
                lineHeight: "1.35",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.blog.title}
            </h5>

            <p
              style={{
                fontSize: "0.78rem",
                color: "#64748B",
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: "1.35",
              }}
            >
              {item.topic}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px dashed #E2E8F0" }}>
        <span style={{ fontSize: "0.78rem", color: "#475569", fontWeight: 700 }}>
          ~{item.blog.approxWordCount} words
        </span>

        <motion.button
          type="button"
          onClick={() => onLoadItem(item)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: "#059669",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            fontSize: "0.82rem",
            fontWeight: 800,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)",
          }}
        >
          <FileTextIcon /> Resume &amp; Edit
        </motion.button>
      </div>
    </motion.div>
  );
}

function RecentGenerationsStrip({
  history,
  onLoadItem,
  onOpenHistory,
  onDeleteItem,
}: {
  history: any[];
  onLoadItem: (item: any) => void;
  onOpenHistory: () => void;
  onDeleteItem?: (id: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    if (!history) return [];
    if (activeCategory === "all") return history;
    return history.filter((item) => {
      const text = `${item.topic} ${item.blog?.title || ""}`.toLowerCase();
      const type = item.iconType || "";
      if (activeCategory === "health") {
        return type === "shield" || type === "eye" || type === "tooth" || text.match(/health|disease|hereditary|vet|medical|eye|teeth|illness|cure|vaccine|sick|doctor|infection|flea|tick/);
      }
      if (activeCategory === "food") {
        return type === "bowl" || type === "bone" || type === "apple" || text.match(/food|diet|nutrition|feed|kibble|eat|stomach|digest|recipe|bone|broth|joint|fruit|treat|snack/);
      }
      if (activeCategory === "travel") {
        return type === "car" || text.match(/car|road|trip|travel|drive|transport|ride|vehicle/);
      }
      if (activeCategory === "training") {
        return type === "graduation" || type === "footstep" || text.match(/train|behavior|bark|leash|puppy|school|command|bite|chew|anxiety|obey|walk|hike|exercise/);
      }
      return true;
    });
  }, [history, activeCategory]);

  if (!history || history.length === 0) {
    return (
      <div className="p3-recent-strip-empty" style={{
        marginTop: "32px",
        padding: "36px 24px",
        background: "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%)",
        border: "1.5px dashed #CBD5E1",
        borderRadius: "18px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: "#ECFDF5",
          border: "1px solid #A7F3D0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#059669",
        }}>
          <HistoryIcon />
        </div>
        <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
          Ready to Craft Your Next SEO Article
        </h4>
        <p style={{ fontSize: "0.86rem", color: "#64748B", margin: 0, maxWidth: "460px", lineHeight: "1.5" }}>
          Pick a topic idea above or type your own prompt to generate an optimized ~1,200-word blog with live Google SEO scoring.
        </p>
      </div>
    );
  }

  const recentItems = filteredItems.slice(0, 4);

  return (
    <div className="p3-recent-strip-container" style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Title Header Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ScrollTextIcon />
          <h4 style={{ fontSize: "0.96rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
            Recent Generations &amp; Saved Drafts
          </h4>
          <span style={{
            background: "#FFF1F2",
            border: "1px solid #FECDD3",
            color: "#E11D48",
            fontSize: "0.72rem",
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: "999px",
          }}>
            {history.length} saved
          </span>
        </div>

        {history.length > 4 && (
          <motion.button
            type="button"
            onClick={onOpenHistory}
            initial="rest"
            whileHover="hover"
            style={{
              background: "transparent",
              border: "none",
              color: "#2563EB",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 6px",
              borderRadius: "6px",
            }}
          >
            <span>View All ({history.length})</span>
            <motion.svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              variants={{
                rest: { x: 0 },
                hover: { x: 4 },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </motion.svg>
          </motion.button>
        )}
      </div>

      {/* 🌟 Topic Category Filter Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {[
          {
            id: "all",
            label: "All",
            count: history.length,
            activeBg: "#059669",
            activeColor: "#FFFFFF",
            inactiveBg: "#F1F5F9",
            inactiveBorder: "#E2E8F0",
            inactiveColor: "#475569",
          },
          {
            id: "health",
            label: "Health & Vet",
            activeBg: "#0D9488",
            activeColor: "#FFFFFF",
            inactiveBg: "#E6FFFA",
            inactiveBorder: "#99F6E4",
            inactiveColor: "#0F766E",
          },
          {
            id: "food",
            label: "Diet & Food",
            activeBg: "#D97706",
            activeColor: "#FFFFFF",
            inactiveBg: "#FEF3C7",
            inactiveBorder: "#FDE68A",
            inactiveColor: "#B45309",
          },
          {
            id: "travel",
            label: "Travel & Trips",
            activeBg: "#2563EB",
            activeColor: "#FFFFFF",
            inactiveBg: "#E0F2FE",
            inactiveBorder: "#BAE6FD",
            inactiveColor: "#0369A1",
          },
          {
            id: "training",
            label: "Training & Care",
            activeBg: "#7C3AED",
            activeColor: "#FFFFFF",
            inactiveBg: "#F3E8FF",
            inactiveBorder: "#DDD6FE",
            inactiveColor: "#6D28D9",
          },
        ].map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              style={{
                background: isActive ? tab.activeBg : tab.inactiveBg,
                color: isActive ? tab.activeColor : tab.inactiveColor,
                border: `1px solid ${isActive ? tab.activeBg : tab.inactiveBorder}`,
                borderRadius: "999px",
                padding: "6px 14px",
                fontSize: "0.78rem",
                fontWeight: isActive ? 800 : 600,
                cursor: "pointer",
                transition: "all 0.18s ease",
                boxShadow: isActive ? `0 2px 8px ${tab.activeBg}40` : "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && <span style={{ marginLeft: "4px", opacity: 0.85 }}>({tab.count})</span>}
            </button>
          );
        })}
      </div>

      {/* History Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "14px",
      }}>
        {recentItems.map((item: any) => (
          <BlogCardItem
            key={item.id}
            item={item}
            onLoadItem={onLoadItem}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </div>
    </div>
  );
}

function StethoscopeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3M19.2 2.3A.3.3 0 1 0 19 2a.3.3 0 0 0 .2.3" />
      <path d="M5 2v4a7 7 0 0 0 14 0V2" />
      <path d="M12 13v3a3 3 0 0 0 3 3h1" />
      <circle cx="19" cy="19" r="2" fill="#2563EB" />
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{
        display: "inline-block",
        verticalAlign: "-2px",
        marginRight: "8px",
        flexShrink: 0,
        color: "#15803D",
      }}
    >
      <path d="M12 12.8c-3.2 0-5.8 1.4-5.8 3.5 0 2.1 2.6 3.5 5.8 3.5s5.8-1.4 5.8-3.5c0-2.1-2.6-3.5-5.8-3.5z" />
      <circle cx="5.4" cy="11.2" r="2.4" />
      <circle cx="9.8" cy="7.8" r="2.4" />
      <circle cx="14.2" cy="7.8" r="2.4" />
      <circle cx="18.6" cy="11.2" r="2.4" />
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
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#15803D" aria-hidden="true" style={{ display: "block" }}>
                <path d="M12 12.8c-3.2 0-5.8 1.4-5.8 3.5 0 2.1 2.6 3.5 5.8 3.5s5.8-1.4 5.8-3.5c0-2.1-2.6-3.5-5.8-3.5z" />
                <circle cx="5.4" cy="11.2" r="2.4" />
                <circle cx="9.8" cy="7.8" r="2.4" />
                <circle cx="14.2" cy="7.8" r="2.4" />
                <circle cx="18.6" cy="11.2" r="2.4" />
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
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isDone) {
      // Rapid organic completion burst to 100% when backend finishes
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          const burst = Math.floor(Math.random() * 4) + 2; // +2, +3, +4, +5
          return Math.min(100, prev + burst);
        });
      }, 18);
      return () => clearInterval(timer);
    } else {
      // Organic randomized progression simulator with soft asymptotic creep (never gets hard-stuck)
      let timeoutId: NodeJS.Timeout;

      const scheduleNextTick = () => {
        // Relaxed pacing that scales gracefully (200ms-480ms early, 480ms-900ms near top)
        const baseDelay = count < 55 ? 200 : count < 85 ? 350 : 550;
        const jitter = Math.floor(Math.random() * 260) + baseDelay;

        timeoutId = setTimeout(() => {
          setCount((prev) => {
            if (prev >= 99) return 99; // Creep up to 99% smoothly

            // Randomized step increments (+0 micro-pause, +1 steady, +2 occasional)
            const rand = Math.random();
            let increment = 1;
            if (prev > 82) {
              // Slower micro-step near the top
              increment = rand > 0.65 ? 1 : 0;
            } else {
              if (rand > 0.88) increment = 2;
              else if (rand < 0.15) increment = 0; // Micro-pause
            }

            return Math.min(99, prev + increment);
          });

          scheduleNextTick();
        }, jitter);
      };

      scheduleNextTick();

      return () => clearTimeout(timeoutId);
    }
  }, [isDone, count > 82]);

  const currentStage = count >= 100 || (isDone && count >= 85) ? 3 : count < 30 ? 1 : count < 70 ? 2 : 3;
  const defaultStatusText =
    count >= 100
      ? "Generation Complete"
      : count < 18
      ? "Parsing search intent & core canine subject..."
      : count < 35
      ? "Structuring 6 H2 headings & Featured Snippet opening..."
      : count < 52
      ? "Drafting veterinary-grade sections & 3 H3 subtopics..."
      : count < 70
      ? "Generating 5 schema-ready FAQs in parallel..."
      : count < 85
      ? "Calibrating 1,450-word budget & keyword density..."
      : count < 96
      ? "Polishing SERP meta description & readability..."
      : "Finalizing Grade A+ SEO article layout...";

  return (
    <div
      className="p3-workspace text-reveal-entry p3-workspace--expanded p3-skeleton-workspace-grid"
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
      {/* ── LEFT COLUMN (60% Width): Minimal Stepper + Realistic Article Skeleton ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", minWidth: 0, boxSizing: "border-box" }}>
        
        {/* Premium AI Stepper Header Bar */}
        <div
          className="p3-skeleton-topbar"
          style={{
            margin: 0,
            padding: "16px 20px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Header Title Row */}
          <div className="p3-skeleton-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div className="p3-skeleton-header-left" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {/* Pulsing Multi-Ring Radar Aura Dot */}
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, flexShrink: 0 }}>
                <motion.span
                  animate={{ scale: [1, 2, 1], opacity: [0.15, 0.5, 0.15] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#10B981",
                  }}
                />
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#059669",
                  }}
                />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#047857", boxShadow: "0 0 10px #10B981", zIndex: 2 }} />
              </div>

              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
                AI Editorial Assistant Active
              </span>

              {/* Topic Badge Pill */}
              <span
                className="p3-skeleton-topic-badge"
                style={{
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  color: "#047857",
                  background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                  border: "1px solid #A7F3D0",
                  borderRadius: "9999px",
                  padding: "3px 11px",
                  boxShadow: "0 1px 3px rgba(5,150,105,0.08)",
                }}
              >
                {topic || "Pet Care Guide"}
              </span>
            </div>

            {/* Progress Percentage Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "#64748B" }}>Progress</span>
              <motion.span
                key={count}
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                style={{
                  fontSize: "0.84rem",
                  fontWeight: 800,
                  color: "#047857",
                  background: "#ECFDF5",
                  border: "1.5px solid #A7F3D0",
                  borderRadius: "8px",
                  padding: "2px 10px",
                  fontFamily: "var(--font-mono)",
                  fontVariantNumeric: "tabular-nums",
                  boxShadow: "0 2px 6px rgba(5, 150, 105, 0.1)",
                }}
              >
                {count}%
              </motion.span>
            </div>
          </div>

          {/* 3-Step Stage Stepper Badges */}
          <div className="p3-skeleton-stepper-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
            {[
              { step: 1, title: "Research Intent" },
              { step: 2, title: "Draft Article" },
              { step: 3, title: "SEO Optimize" },
            ].map((st, i) => {
              const isActive = currentStage === i + 1;
              const isCompleted = currentStage > i + 1;
              return (
                <div
                  key={st.step}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "9px",
                    background: isActive ? "linear-gradient(135deg, #ECFDF5 0%, #E0F2FE 100%)" : isCompleted ? "#F0F9FF" : "#F8FAFC",
                    border: isActive ? "1.5px solid #059669" : isCompleted ? "1.5px solid #BAE6FD" : "1px solid #E2E8F0",
                    color: isActive ? "#047857" : isCompleted ? "#0369A1" : "#64748B",
                    fontSize: "0.76rem",
                    fontWeight: isActive ? 700 : 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: isActive ? "0 2px 10px rgba(5, 150, 105, 0.15)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {isCompleted ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "#0369A1" }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isActive ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "#059669" }}>
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    ) : (
                      `${i + 1}.`
                    )}
                  </span>
                  <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {isActive || isCompleted ? `${i + 1}. ${st.title}` : st.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Status & Timer Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", marginBottom: 8 }}>
            <span style={{ fontSize: "0.78rem", color: "#334155", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
              </svg>
              {defaultStatusText}
            </span>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.7rem", color: "#047857", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "2px 8px", borderRadius: "6px", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 700 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Gemini Flash Cascade
              </span>
              <span style={{ fontSize: "0.72rem", color: "#475569", background: "#F1F5F9", border: "1px solid #E2E8F0", padding: "2px 8px", borderRadius: "6px", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                ~15s
              </span>
            </div>
          </div>

          {/* Glowing Shimmer Multi-Stop Gradient Progress Bar Track */}
          <div style={{ width: "100%", height: "8px", background: "#F1F5F9", borderRadius: "9999px", overflow: "hidden", border: "1px solid #E2E8F0", position: "relative" }}>
            <div
              style={{
                height: "100%",
                width: `${count}%`,
                background: "linear-gradient(90deg, #059669 0%, #10B981 40%, #06B6D4 80%, #3B82F6 100%)",
                borderRadius: "9999px",
                transition: "width 0.35s ease-out",
                boxShadow: "0 0 12px rgba(16, 185, 129, 0.45)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "40%",
                  background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.65) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Realistic Article Document Canvas Skeleton Card */}
        <div
          className="p3-skeleton-card"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "24px",
          }}
        >
          {/* Article Title & Toolbar Header Skeleton */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: "14px" }}>
            <div className="skeleton-shimmer" style={{ width: "72%", height: "24px", borderRadius: "6px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <div className="skeleton-shimmer" style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
              <div className="skeleton-shimmer" style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
              <div className="skeleton-shimmer" style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
            </div>
          </div>

          {/* Live SEO Quality Index Summary Box Skeleton */}
          <div style={{ padding: "16px", background: "#F8FAFC", borderRadius: "12px", border: "1.5px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="skeleton-shimmer" style={{ width: "16px", height: "16px", borderRadius: "4px" }} />
                <div className="skeleton-shimmer" style={{ width: "150px", height: "16px" }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: "110px", height: "14px" }} />
            </div>

            {/* 4 SEO Metrics Badges Grid Skeleton */}
            <div style={{ display: "grid", gridTemplateColumns: "54px 1fr 1fr 1fr", gap: "10px", alignItems: "center" }}>
              <div className="skeleton-shimmer" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
              <div className="skeleton-shimmer" style={{ height: "46px", borderRadius: "10px" }} />
              <div className="skeleton-shimmer" style={{ height: "46px", borderRadius: "10px" }} />
              <div className="skeleton-shimmer" style={{ height: "46px", borderRadius: "10px" }} />
            </div>
          </div>

          {/* Realistic Article Content Flow (Paragraphs + Headings + Lists) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Intro Paragraph Skeletons (Varied natural widths) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="skeleton-shimmer" style={{ width: "98%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "93%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "88%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "95%", height: "14px" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="skeleton-shimmer" style={{ width: "96%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "91%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "78%", height: "14px" }} />
            </div>

            {/* H2 Heading 1 Skeleton */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              <div className="skeleton-shimmer" style={{ width: "16px", height: "16px", borderRadius: "4px" }} />
              <div className="skeleton-shimmer" style={{ width: "58%", height: "20px", borderRadius: "6px" }} />
            </div>

            {/* Paragraph lines under Heading 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="skeleton-shimmer" style={{ width: "99%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "94%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "90%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "82%", height: "14px" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="skeleton-shimmer" style={{ width: "95%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "92%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "76%", height: "14px" }} />
            </div>

            {/* H2 Heading 2 Skeleton */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              <div className="skeleton-shimmer" style={{ width: "16px", height: "16px", borderRadius: "4px" }} />
              <div className="skeleton-shimmer" style={{ width: "52%", height: "20px", borderRadius: "6px" }} />
            </div>

            {/* Paragraph lines under Heading 2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="skeleton-shimmer" style={{ width: "96%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "93%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "89%", height: "14px" }} />
              <div className="skeleton-shimmer" style={{ width: "74%", height: "14px" }} />
            </div>

            {/* H2 Heading 3 Skeleton */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              <div className="skeleton-shimmer" style={{ width: "16px", height: "16px", borderRadius: "4px" }} />
              <div className="skeleton-shimmer" style={{ width: "64%", height: "20px", borderRadius: "6px" }} />
            </div>

            {/* Bullet List Item Skeletons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "#10B981" }}>•</span>
                <div className="skeleton-shimmer" style={{ width: "92%", height: "13px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "#10B981" }}>•</span>
                <div className="skeleton-shimmer" style={{ width: "86%", height: "13px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "#10B981" }}>•</span>
                <div className="skeleton-shimmer" style={{ width: "78%", height: "13px" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN (40% Width): Realistic Social Engine Skeleton ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", minWidth: 0, boxSizing: "border-box" }}>
        
        {/* Top Tab Navigation Skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", background: "#F1F5F9", padding: "4px", borderRadius: "12px" }}>
          <div className="skeleton-shimmer" style={{ height: "36px", borderRadius: "8px", background: "#FFFFFF" }} />
          <div className="skeleton-shimmer" style={{ height: "36px", borderRadius: "8px" }} />
        </div>

        {/* Primary Action Button Skeleton (+ Generate Social Posts) */}
        <div className="skeleton-shimmer" style={{ width: "100%", height: "42px", borderRadius: "10px", background: "linear-gradient(90deg, #059669 0%, #10B981 100%)" }} />

        {/* Content Angle Section Heading & Tag Chips Skeleton */}
        <div className="p3-skeleton-card" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="skeleton-shimmer" style={{ width: "120px", height: "12px" }} />
          <div style={{ display: "flex", gap: "8px" }}>
            <div className="skeleton-shimmer" style={{ width: "75px", height: "28px", borderRadius: "9999px" }} />
            <div className="skeleton-shimmer" style={{ width: "95px", height: "28px", borderRadius: "9999px" }} />
            <div className="skeleton-shimmer" style={{ width: "85px", height: "28px", borderRadius: "9999px" }} />
          </div>
        </div>

        {/* Social Post Content Card 1 Skeleton */}
        <div className="p3-skeleton-card" style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="skeleton-shimmer" style={{ width: "140px", height: "20px", borderRadius: "6px" }} />
            <div className="skeleton-shimmer" style={{ width: "60px", height: "16px", borderRadius: "4px" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="skeleton-shimmer" style={{ width: "98%", height: "13px" }} />
            <div className="skeleton-shimmer" style={{ width: "91%", height: "13px" }} />
            <div className="skeleton-shimmer" style={{ width: "85%", height: "13px" }} />
            <div className="skeleton-shimmer" style={{ width: "62%", height: "13px" }} />
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <div className="skeleton-shimmer" style={{ width: "85px", height: "28px", borderRadius: "6px" }} />
            <div className="skeleton-shimmer" style={{ width: "70px", height: "28px", borderRadius: "6px" }} />
          </div>
        </div>

        {/* Social Post Content Card 2 Skeleton */}
        <div className="p3-skeleton-card" style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="skeleton-shimmer" style={{ width: "160px", height: "20px", borderRadius: "6px" }} />
            <div className="skeleton-shimmer" style={{ width: "60px", height: "16px", borderRadius: "4px" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="skeleton-shimmer" style={{ width: "96%", height: "13px" }} />
            <div className="skeleton-shimmer" style={{ width: "88%", height: "13px" }} />
            <div className="skeleton-shimmer" style={{ width: "92%", height: "13px" }} />
            <div className="skeleton-shimmer" style={{ width: "50%", height: "13px" }} />
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <div className="skeleton-shimmer" style={{ width: "95px", height: "28px", borderRadius: "6px" }} />
          </div>
        </div>

        {/* Social Engine Meta & SEO Tags Skeleton Card */}
        <div className="p3-skeleton-card" style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="skeleton-shimmer" style={{ width: "130px", height: "14px" }} />
          <div className="skeleton-shimmer" style={{ width: "100%", height: "36px", borderRadius: "8px" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
            <div className="skeleton-shimmer" style={{ width: "65px", height: "22px", borderRadius: "9999px" }} />
            <div className="skeleton-shimmer" style={{ width: "80px", height: "22px", borderRadius: "9999px" }} />
            <div className="skeleton-shimmer" style={{ width: "75px", height: "22px", borderRadius: "9999px" }} />
            <div className="skeleton-shimmer" style={{ width: "90px", height: "22px", borderRadius: "9999px" }} />
          </div>
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
  onDiscardRequest,
}: {
  blog: SeoBlog;
  onSave: (updated: SeoBlog) => void;
  onCancel: () => void;
  onDiscardRequest?: () => void;
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
      if (onDiscardRequest) {
        onDiscardRequest();
      } else {
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
        <span className="p3-tone-label" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <SparkleStarIcon /> AI Tone Quick-Polish:
        </span>
        <div className="p3-tone-btn-group">
          <button
            type="button"
            className="p3-tone-btn"
            disabled={!!isPolishingPreset}
            onClick={(e) => handlePolishTone("punchier", e)}
            title="Make intro paragraph punchier & concise"
          >
            {isPolishingPreset === "punchier" ? (
              <span className="p3-spinner p3-spinner--sm" />
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <LightningIcon /> Punchier &amp; Concise
              </span>
            )}
          </button>
          <button
            type="button"
            className="p3-tone-btn"
            disabled={!!isPolishingPreset}
            onClick={(e) => handlePolishTone("warm", e)}
            title="Add empathetic pet parent warmth"
          >
            {isPolishingPreset === "warm" ? (
              <span className="p3-spinner p3-spinner--sm" />
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <PawPrintIcon /> Warmer Pet Voice
              </span>
            )}
          </button>
          <button
            type="button"
            className="p3-tone-btn"
            disabled={!!isPolishingPreset}
            onClick={(e) => handlePolishTone("stats", e)}
            title="Add veterinary statistical data point"
          >
            {isPolishingPreset === "stats" ? (
              <span className="p3-spinner p3-spinner--sm" />
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <BarChartSmallIcon /> Add Statistics
              </span>
            )}
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
  const [schemaCopied, setSchemaCopied] = useState(false);
  const [allFaqsOpen, setAllFaqsOpen] = useState(false);
  const [activeSectionIdx, setActiveSectionIdx] = useState<number | "faqs" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const wordCount = blog.approxWordCount || 1350;
  const readingMinutes = Math.max(4, Math.ceil(wordCount / 220));

  const scrollToSection = (targetId: string, idx: number | "faqs") => {
    setActiveSectionIdx(idx);
    const root = containerRef.current;
    if (!root) return;
    const el = root.querySelector(`[data-toc-id="${targetId}"]`) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const copyFaqSchemaJsonLd = async () => {
    const schemaObj = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (blog.faqs || []).map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };
    const scriptTag = `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
    await navigator.clipboard.writeText(scriptTag);
    setSchemaCopied(true);
    setTimeout(() => setSchemaCopied(false), 2000);
  };

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
    <div ref={containerRef} className="p3-blog-body">
      {/* ── Editorial Metadata & Reading Bar (SVG-only) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          padding: "10px 14px",
          marginBottom: "12px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #F8FAFC 0%, #F0FDF4 100%)",
          border: "1px solid #E2E8F0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.74rem",
              fontWeight: 700,
              color: "#047857",
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              padding: "3px 10px",
              borderRadius: "999px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {readingMinutes} min read
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.74rem",
              fontWeight: 700,
              color: "#0369A1",
              background: "#E0F2FE",
              border: "1px solid #BAE6FD",
              padding: "3px 10px",
              borderRadius: "999px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            {wordCount.toLocaleString()} words
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.74rem",
              fontWeight: 700,
              color: "#6D28D9",
              background: "#F3E8FF",
              border: "1px solid #DDD6FE",
              padding: "3px 10px",
              borderRadius: "999px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            Featured Snippet Ready
          </span>
        </div>

        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#64748B", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          {blog.sections.length} H2 Sections + {blog.faqs.length} FAQs
        </span>
      </div>

      {/* ── Interactive Table of Contents Jump Bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "16px",
          borderBottom: "1px solid #E2E8F0",
          scrollbarWidth: "thin",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#64748B",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
            paddingRight: "4px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Jump to:
        </span>
        {blog.sections.map((s, idx) => {
          const cleanLabel = s.heading.replace(/^\d+\.\s*/, "");
          const shortLabel = cleanLabel.length > 26 ? `${cleanLabel.slice(0, 24)}…` : cleanLabel;
          const isActive = activeSectionIdx === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToSection(`sec-${idx}`, idx)}
              title={s.heading}
              style={{
                flexShrink: 0,
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "0.73rem",
                fontWeight: 600,
                cursor: "pointer",
                border: isActive ? "1px solid #059669" : "1px solid #CBD5E1",
                background: isActive ? "#ECFDF5" : "#FFFFFF",
                color: isActive ? "#047857" : "#334155",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              {idx + 1}. {shortLabel}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => scrollToSection("sec-faqs", "faqs")}
          style={{
            flexShrink: 0,
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "0.73rem",
            fontWeight: 700,
            cursor: "pointer",
            border: activeSectionIdx === "faqs" ? "1px solid #059669" : "1px solid #CBD5E1",
            background: activeSectionIdx === "faqs" ? "#ECFDF5" : "#F8FAFC",
            color: activeSectionIdx === "faqs" ? "#047857" : "#0F172A",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
          }}
        >
          FAQs ({blog.faqs.length})
        </button>
      </div>

      {blog.intro.map((p, i) => (
        <p key={i} className={i === 0 ? "p3-lead-p" : ""}>
          {renderText(p)}
        </p>
      ))}

      {blog.sections.map((s, sIdx) => (
        <div key={sIdx} data-toc-id={`sec-${sIdx}`} className="p3-section" style={{ scrollMarginTop: "16px" }}>
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
          <div className="p3-quote-icon">
            <StethoscopeIcon />
          </div>
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

      <div
        data-toc-id="sec-faqs"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "20px",
          marginBottom: "8px",
          scrollMarginTop: "16px",
        }}
      >
        <h3 className="p3-h3" style={{ margin: 0 }}>
          <PawHeadIcon />
          Frequently Asked Questions
        </h3>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setAllFaqsOpen((prev) => !prev)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              borderRadius: "8px",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#334155",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points={allFaqsOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
            </svg>
            {allFaqsOpen ? "Collapse All" : "Expand All"}
          </button>

          <button
            type="button"
            onClick={copyFaqSchemaJsonLd}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 11px",
              borderRadius: "8px",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
              border: schemaCopied ? "1px solid #166534" : "1px solid #A7F3D0",
              background: schemaCopied ? "#15803D" : "#ECFDF5",
              color: schemaCopied ? "#FFFFFF" : "#047857",
              transition: "all 0.15s ease",
            }}
          >
            {schemaCopied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied JSON-LD!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                Copy FAQ Schema (JSON-LD)
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p3-faq-container">
        {blog.faqs.map((f, i) => (
          <details key={`${i}-${allFaqsOpen}`} className="p3-faq-accordion" open={allFaqsOpen || i === 0}>
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
    loadBlogFromHistory,
    deleteBlogHistoryItem,
  } = useBlogGeneration();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [isTransitioningNewBlog, setIsTransitioningNewBlog] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<"idle" | "expanding" | "revealing">("idle");
  const newBlogBtnRef = useRef<HTMLButtonElement>(null);
  const [circleOrigin, setCircleOrigin] = useState<{ x: number; y: number }>({ x: 800, y: 100 });

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
    if (loading) return;
    const nextTopic = globalTopicEngine.getNextTopic();
    setTopic(nextTopic);
    setPlaceholderTopic(RANDOM_PLACEHOLDERS[Math.floor(Math.random() * RANDOM_PLACEHOLDERS.length)]);

    setIsSuggesting(true);
    setTimeout(() => setIsSuggesting(false), 350);
  };

  const [activeTab, setActiveTab] = useState<keyof LinkedInPosts>("safeBet");
  const [sparkleBurst, setSparkleBurst] = useState(false);

  const handleGenerateSocialPosts = (e: React.MouseEvent) => {
    setSparkleBurst(true);
    setTimeout(() => setSparkleBurst(false), 850);
    triggerMicroConfetti(e);
    generateLinkedInPosts();
  };
  const [asideTab, setAsideTab] = useState<"social" | "meta">("social");
  const [highlightedKeyword, setHighlightedKeyword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [blogCopied, setBlogCopied] = useState(false);
  const [metaCopied, setMetaCopied] = useState(false);
  const [allPostsCopied, setAllPostsCopied] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
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
      if (v.length >= 140 && v.length <= 160) return v;
    }

    let base = variations[0];
    for (const v of variations) {
      if (Math.abs(v.length - 150) < Math.abs(base.length - 150)) {
        base = v;
      }
    }

    if (base.length < 140) {
      const pads = [
        " Read our complete guide.",
        " Read our full guide today.",
        " Read our pet guide.",
        " Read our guide."
      ];
      for (const p of pads) {
        const padded = base.replace(/\.$/, "") + p;
        if (padded.length >= 140 && padded.length <= 160) return padded;
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
        if (t.length >= 140 && t.length <= 160) return t;
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

  const [targetCircleScale, setTargetCircleScale] = useState(100);

  const handleNewBlog = (e?: React.MouseEvent<HTMLElement>) => {
    if (isTransitioningNewBlog) return;

    let originX = 0;
    let originY = 0;

    // Measure exact center coordinates of the + New Blog button element
    const btn = (e && (e.currentTarget || e.target as HTMLElement)) || newBlogBtnRef.current || (typeof document !== "undefined" ? document.querySelector(".p3-new-blog-btn") : null);
    
    if (btn) {
      const rect = btn.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    if (!originX || !originY) {
      const fallbackBtn = typeof document !== "undefined" ? document.querySelector(".p3-new-blog-btn") : null;
      if (fallbackBtn) {
        const rect = fallbackBtn.getBoundingClientRect();
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      } else {
        originX = typeof window !== "undefined" ? window.innerWidth - 120 : 800;
        originY = 80;
      }
    }

    // Calculate maximum distance to the farthest corner of the viewport from (originX, originY)
    const W = typeof window !== "undefined" ? window.innerWidth : 1200;
    const H = typeof window !== "undefined" ? window.innerHeight : 800;

    const distTopLeft = Math.hypot(originX, originY);
    const distTopRight = Math.hypot(W - originX, originY);
    const distBottomLeft = Math.hypot(originX, H - originY);
    const distBottomRight = Math.hypot(W - originX, H - originY);
    const maxRadius = Math.max(distTopLeft, distTopRight, distBottomLeft, distBottomRight);

    // Initial circle diameter is 20px (radius 10px). Calculate target scale to cover farthest corner + 8% margin
    const computedScale = Math.ceil((maxRadius / 10) * 1.08);

    setCircleOrigin({ x: originX, y: originY });
    setTargetCircleScale(computedScale);

    requestAnimationFrame(() => {
      setIsTransitioningNewBlog(true);
      setTransitionPhase("expanding");
    });

    // Phase 1: Smooth 600ms green wave expansion from button center covering 100% of screen
    setTimeout(() => {
      resetBlogState();
      setTransitionPhase("revealing");
    }, 600);

    // Phase 2: Smooth 320ms reveal of the fresh New Blog page (920ms total)
    setTimeout(() => {
      setIsTransitioningNewBlog(false);
      setTransitionPhase("idle");
    }, 920);
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

    const ctaText = b.vetCta || "Get help from a CuddlyTails AI vet [here](https://onelink.to/gf7wz3).";

    return [
      `# ${b.title}`,
      b.intro.join("\n\n"),
      sectionBlocks,
      ctaText,
      `### Conclusion`,
      b.conclusion.join("\n\n"),
      `### Frequently Asked Questions`,
      faqBlock,
      metaBlock,
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const formatHtmlParagraphs = (paragraphsInput: any, itemStyle = "font-size: 11pt; font-weight: normal; color: #000000; text-decoration: none; font-style: normal; line-height: 1.15; margin-top: 0; margin-bottom: 10pt; font-family: Arial, sans-serif;"): string => {
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
    const pStyle = "font-size: 11pt; font-weight: normal; color: #000000; text-decoration: none; font-style: normal; line-height: 1.15; margin-top: 0; margin-bottom: 10pt; font-family: Arial, sans-serif;";
    const h1Style = "font-size: 20pt; font-weight: bold; color: #000000; text-decoration: none; font-style: normal; margin-top: 0; margin-bottom: 12pt; font-family: Arial, sans-serif;";
    const h2Style = "font-size: 15pt; font-weight: bold; color: #000000; text-decoration: none; font-style: normal; margin-top: 16pt; margin-bottom: 8pt; font-family: Arial, sans-serif;";
    const h3Style = "font-size: 13pt; font-weight: bold; color: #000000; text-decoration: none; font-style: normal; margin-top: 12pt; margin-bottom: 6pt; font-family: Arial, sans-serif;";
    const liStyle = "font-size: 11pt; font-weight: normal; color: #000000; text-decoration: none; font-style: normal; margin-bottom: 4pt; font-family: Arial, sans-serif;";

    const introHtml = formatHtmlParagraphs(b.intro, pStyle);

    const sectionHtml = (b.sections || [])
      .map((s) => {
        const headingText = String(s.heading || "").replace(/<[^>]*>/g, "").trim();
        const pBlock = formatHtmlParagraphs(s.paragraphs, pStyle);
        const bBlock =
          (s.bullets?.length ?? 0) > 0
            ? `<ul style="margin-bottom: 10pt; padding-left: 20pt; color: #000000; text-decoration: none; font-style: normal;">${s.bullets!.map((item) => `<li style="${liStyle}">${item.replace(/<[^>]*>/g, "")}</li>`).join("")}</ul>`
            : "";
        const stBlock = (s.subtopics ?? [])
          .map(
            (st) =>
              `<h3 style="${h3Style}">${st.subheading.replace(/<[^>]*>/g, "")}</h3>${formatHtmlParagraphs(st.paragraphs, pStyle)}`
          )
          .join("");

        return `<h2 style="${h2Style}">${headingText}</h2>${pBlock}${bBlock}${stBlock}`;
      })
      .join("");

    const ctaHtml = `<p style="${pStyle}">Get help from a CuddlyTails AI vet <a href="https://onelink.to/gf7wz3" style="color: #2563EB; font-weight: normal; text-decoration: underline; font-style: normal;">here</a>.</p>`;

    const conclusionHtml = (b.conclusion?.length ?? 0) > 0
      ? `<h2 style="${h2Style}">Conclusion</h2>${formatHtmlParagraphs(b.conclusion, pStyle)}`
      : "";

    const faqHtml = (b.faqs?.length ?? 0) > 0
      ? `<h2 style="${h2Style}">Frequently Asked Questions</h2>` +
        b.faqs.map((f) => `<p style="font-size: 11pt; font-weight: bold; color: #000000; text-decoration: none; font-style: normal; margin-top: 8pt; margin-bottom: 3pt; font-family: Arial, sans-serif;">${f.question.replace(/<[^>]*>/g, "")}</p><p style="${pStyle}">${f.answer.replace(/<[^>]*>/g, "")}</p>`).join("")
      : "";

    const metaHtml = activeMeta
      ? `<p style="${pStyle}"><b>Meta Description:</b> ${activeMeta.replace(/<[^>]*>/g, "")}</p>`
      : "";

    return `<div style="font-family: Arial, sans-serif; color: #000000; text-decoration: none; font-style: normal;"><h1 style="${h1Style}">${(b.title || "").replace(/<[^>]*>/g, "")}</h1>${introHtml}${sectionHtml}${ctaHtml}${conclusionHtml}${faqHtml}${metaHtml}</div>`;
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

  const isCompactWorkspace = Boolean(blog || loading || loaderMounted);

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
            background: "#F1F5F9",
            border: "1px solid #CBD5E1",
            color: "#334155",
            padding: "8px 14px",
            borderRadius: "10px",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            lineHeight: 1,
            cursor: "pointer",
            whiteSpace: "nowrap",
            marginTop: "12px",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#E2E8F0";
            e.currentTarget.style.borderColor = "#94A3B8";
            e.currentTarget.style.color = "#0F172A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#F1F5F9";
            e.currentTarget.style.borderColor = "#CBD5E1";
            e.currentTarget.style.color = "#334155";
          }}
        >
          <HistoryIcon />
          <span style={{ display: "inline-block", lineHeight: "1" }}>
            History <strong style={{ color: "#E2776B", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>({blogHistory.length})</strong>
          </span>
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
            disabled={loading}
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

          {/* Interactive Animated Clear Cross Button */}
          <AnimatePresence>
            {topic.length > 0 && !loading && (
              <motion.button
                type="button"
                initial={{ scale: 0, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 90 }}
                whileHover={{ scale: 1.18, rotate: 90, backgroundColor: "#EF4444", color: "#FFFFFF", borderColor: "#EF4444" }}
                whileTap={{ scale: 0.88, rotate: 180 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                onClick={() => {
                  setTopic("");
                  document.getElementById("p3-topic-input")?.focus();
                }}
                title="Clear topic input"
                aria-label="Clear topic input"
                style={{
                  width: "22px",
                  minWidth: "22px",
                  maxWidth: "22px",
                  height: "22px",
                  minHeight: "22px",
                  maxHeight: "22px",
                  aspectRatio: "1 / 1",
                  borderRadius: "50%",
                  border: "1px solid #CBD5E1",
                  background: "#F1F5F9",
                  color: "#64748B",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  marginRight: "4px",
                  padding: 0,
                  boxShadow: "0 1px 3px rgba(15,23,42,0.08)",
                  transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          <span className="p3-input-divider" aria-hidden="true" />

          <button
            type="button"
            className={`p3-input-idea-btn ${isSuggesting ? "p3-idea-pop spin-anim" : ""}`}
            onClick={handleSuggestTopic}
            disabled={loading}
            title={loading ? "Generating Blog..." : "Suggest a new topic idea"}
            aria-label="Suggest a topic"
            style={{
              opacity: loading ? 0.45 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              pointerEvents: loading ? "none" : "auto",
            }}
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
              pointerEvents: loading ? "none" : "auto",
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
              ref={newBlogBtnRef}
              type="button"
              className="p3-new-blog-btn"
              disabled={loading}
              onClick={(e) => !loading && handleNewBlog(e)}
              title={loading ? "Generating Blog..." : "Start a new blog topic"}
              style={{
                opacity: loading ? 0.5 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                pointerEvents: loading ? "none" : "auto",
              }}
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
                disabled={loading}
                title={loading ? "Generating Blog..." : "Shuffle Pet Topic Ideas"}
                aria-label="Shuffle Pet Topic Ideas"
                className="p3-shuffle-btn-interactive"
                style={{
                  background: "#C6F6D5",
                  border: "1.5px solid #2D8A4E",
                  color: "#1E6B37",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.45 : 1,
                  pointerEvents: loading ? "none" : "auto",
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
                  disabled={loading}
                  onClick={() => {
                    if (!loading) {
                      setTopic(chipText);
                      document.getElementById("p3-topic-input")?.focus();
                    }
                  }}
                  style={{
                    opacity: loading ? 0.45 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                    pointerEvents: loading ? "none" : "auto",
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

      {/* ── Initial Empty State Recent Generations Quick-Resume Strip ───── */}
      {!blog && !loading && (
        <RecentGenerationsStrip
          history={blogHistory}
          onLoadItem={(item) => {
            loadBlogFromHistory(item);
            setShowWorkspace(true);
          }}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onDeleteItem={(id) => deleteBlogHistoryItem(id)}
        />
      )}

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

                  <motion.button
                    id="p3-gen-posts-btn"
                    type="button"
                    className="p3-btn p3-btn--full"
                    onClick={handleGenerateSocialPosts}
                    disabled={postsLoading}
                    whileHover={postsLoading ? undefined : { scale: 1.015, y: -1 }}
                    whileTap={postsLoading ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{
                      height: "42px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #2D8A4E 0%, #1E6B37 100%)",
                      color: "#FFFFFF",
                      border: "1px solid #1E6B37",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: postsLoading ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      position: "relative",
                      overflow: "visible",
                      opacity: postsLoading ? 0.82 : 1,
                      boxShadow: postsLoading ? "none" : "0 2px 8px rgba(45, 138, 78, 0.2)",
                      transition: "opacity 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    {sparkleBurst && (
                      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20 }}>
                        {[...Array(12)].map((_, i) => {
                          const angle = (i / 12) * 360;
                          const rad = (angle * Math.PI) / 180;
                          const distance = 42 + (i % 3) * 12;
                          const x = Math.cos(rad) * distance;
                          const y = Math.sin(rad) * distance;
                          const symbols = ["✨", "✦", "❇️", "⭐", "•"];
                          const symbol = symbols[i % symbols.length];
                          return (
                            <motion.span
                              key={i}
                              initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
                              animate={{ opacity: 0, scale: 1.3, x, y }}
                              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                              style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                fontSize: i % 2 === 0 ? "13px" : "9px",
                                color: i % 3 === 0 ? "#34D399" : i % 2 === 0 ? "#10B981" : "#F59E0B",
                                textShadow: "0 0 6px rgba(16, 185, 129, 0.8)",
                                pointerEvents: "none",
                              }}
                            >
                              {symbol}
                            </motion.span>
                          );
                        })}
                      </div>
                    )}

                    {postsLoading ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#FFFFFF", fontWeight: 700 }}>
                        <span className="p3-spinner" style={{ width: "16px", height: "16px", borderColor: "rgba(255, 255, 255, 0.35)", borderTopColor: "#FFFFFF" }} /> Generating Posts...
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
                        Generate Social Posts
                      </span>
                    )}
                  </motion.button>

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
                        placeholder="SEO-friendly meta description (140–160 characters)..."
                        rows={4}
                      />
                      <div className="p3-meta-footer">
                        <span
                          className={`p3-meta-count ${
                            metaDescription.length >= 140 && metaDescription.length <= 160
                              ? "p3-meta-count--optimal"
                              : ""
                          }`}
                        >
                          {metaDescription.length} / 160 chars (Optimal: 140–160)
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
                        placeholder="Alternative SEO-friendly meta description (140–160 characters)..."
                        rows={4}
                      />
                      <div className="p3-meta-footer">
                        <span
                          className={`p3-meta-count ${
                            metaDescriptionAlt.length >= 140 && metaDescriptionAlt.length <= 160
                              ? "p3-meta-count--optimal"
                              : ""
                          }`}
                        >
                          {metaDescriptionAlt.length} / 160 chars (Optimal: 140–160)
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
      {isMounted && createPortal(
        <AnimatePresence>
          {isFocusMode && blog && (
            <motion.div
              key="studio-focus-modal"
              className="p3-focus-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => {
                if (isEditing) {
                  setShowUnsavedConfirm(true);
                } else {
                  setIsFocusMode(false);
                }
              }}
            >
              <motion.div
                className="p3-focus-modal"
                initial={{ scale: 0.82, opacity: 0, y: 35, borderRadius: "24px" }}
                animate={{ scale: 1, opacity: 1, y: 0, borderRadius: "14px" }}
                exit={{ scale: 0.88, opacity: 0, y: 25 }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
              >
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
                      onDiscardRequest={() => setShowUnsavedConfirm(true)}
                    />
                  ) : (
                    <BlogRenderer blog={blog} />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Custom Branded Unsaved Changes Confirmation Modal ── */}
      {showUnsavedConfirm && isMounted && createPortal(
        <AnimatePresence>
          <motion.div
            key="unsaved-confirm-overlay"
            className="p3-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              zIndex: 99999999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={() => setShowUnsavedConfirm(false)}
          >
            <motion.div
              className="p3-unsaved-dialog"
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "440px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "#FEF2F2",
                  border: "1px solid #FECDD3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#DC2626",
                  flexShrink: 0
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", margin: "0 0 4px 0" }}>
                    Unsaved Studio Changes
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0, lineHeight: "1.5" }}>
                    You have unsaved changes in the Studio Canvas. Are you sure you want to exit without saving?
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowUnsavedConfirm(false)}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "10px",
                    background: "#F8FAFC",
                    border: "1px solid #CBD5E1",
                    color: "#334155",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUnsavedConfirm(false);
                    setIsEditing(false);
                    setIsFocusMode(false);
                  }}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "0.84rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(239, 68, 68, 0.35)",
                  }}
                >
                  Discard Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* ── Dynamic Green Circular Wave Page Transition Overlay (+ New Blog) ── */}
      {isTransitioningNewBlog && typeof document !== "undefined" && createPortal(
        <motion.div
          key="p3-circular-wipe-overlay"
          style={{
            position: "fixed",
            left: `${circleOrigin.x}px`,
            top: `${circleOrigin.y}px`,
            width: "20px",
            height: "20px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "#2D8A4E", // Existing green accent color
            zIndex: 9999999,
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
          initial={{ scale: 1, opacity: 1 }}
          animate={
            transitionPhase === "expanding"
              ? { scale: targetCircleScale, opacity: 1 }
              : { scale: targetCircleScale, opacity: 0 }
          }
          transition={{
            duration: transitionPhase === "expanding" ? 0.6 : 0.32,
            ease: [0.4, 0, 0.2, 1],
          }}
        />,
        document.body
      )}

    </div>
  );
}