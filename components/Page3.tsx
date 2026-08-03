import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { LinkedInPosts, SeoBlog } from "@/lib/types";
import PawLoader from "@/components/PawLoader";
import Toast from "@/components/Toast";

interface Page3Props {
  onBack: () => void;
}

const TABS: Array<{ key: keyof LinkedInPosts; label: string }> = [
  { key: "safeBet", label: "Safe Bet" },
  { key: "cleanLabel", label: "Clean-Label" },
  { key: "microStory", label: "Micro-Story" },
];

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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#68B77A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-7 7c0 3 2 5 3 7h8c1-2 3-4 3-7a7 7 0 0 0-7-7z" />
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

function FunkyCounterLoader({ topic }: { topic: string }) {
  const [count, setCount] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCount((prev) => (prev < 95 ? prev + 1 : prev));
    }, 360);
    return () => clearInterval(timer);
  }, []);

  // Determine active stage (1: Research, 2: Write, 3: Optimize)
  const currentStage = count <= 35 ? 1 : count <= 75 ? 2 : 3;

  // Dynamic status text matching progress
  const statusText =
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

  const content = (
    <div
      className="p3-loader-wrapper"
      aria-busy="true"
      aria-live="polite"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="p3-loader-modal ai-active-glow" onClick={(e) => e.stopPropagation()}>
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

// ── Blog content renderer ─────────────────────────────────────────────────────

function BlogRenderer({
  blog,
  isEditing,
  onUpdateBlog,
}: {
  blog: SeoBlog;
  isEditing?: boolean;
  onUpdateBlog?: (updated: SeoBlog) => void;
}) {
  return (
    <div className="p3-blog-body">
      {isEditing && (
        <div className="p3-edit-banner">
          <span>
            ✏️ <strong>Inline Editing Mode Active</strong> — Click any heading, paragraph, bullet, or FAQ to edit!
          </span>
          <button
            type="button"
            className="p3-btn p3-btn--teal p3-btn--sm"
            onClick={() => onUpdateBlog && onUpdateBlog(blog)}
          >
            Done Editing
          </button>
        </div>
      )}

      {blog.intro.map((p, i) => (
        <p
          key={i}
          className={`${i === 0 ? "p3-lead-p" : ""} ${isEditing ? "p3-editable" : ""}`}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            if (!onUpdateBlog) return;
            const newIntro = [...blog.intro];
            newIntro[i] = e.currentTarget.innerText;
            onUpdateBlog({ ...blog, intro: newIntro });
          }}
        >
          {p}
        </p>
      ))}

      {blog.sections.map((s, sIdx) => (
        <div key={sIdx} className="p3-section">
          <h3
            className={`p3-h3 ${isEditing ? "p3-editable" : ""}`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!onUpdateBlog) return;
              const text = e.currentTarget.innerText.replace(/^🐾\s*/, "");
              const newSections = [...blog.sections];
              newSections[sIdx] = { ...newSections[sIdx], heading: text };
              onUpdateBlog({ ...blog, sections: newSections });
            }}
          >
            <PawHeadIcon />
            {s.heading}
          </h3>
          {(s.paragraphs ?? []).map((p, pIdx) => (
            <p
              key={pIdx}
              className={isEditing ? "p3-editable" : ""}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (!onUpdateBlog) return;
                const newSections = [...blog.sections];
                const newParas = [...(newSections[sIdx].paragraphs ?? [])];
                newParas[pIdx] = e.currentTarget.innerText;
                newSections[sIdx] = { ...newSections[sIdx], paragraphs: newParas };
                onUpdateBlog({ ...blog, sections: newSections });
              }}
            >
              {p}
            </p>
          ))}
          {(s.bullets?.length ?? 0) > 0 && (
            <ul className="p3-list">
              {s.bullets!.map((b, bIdx) => (
                <li
                  key={bIdx}
                  className={isEditing ? "p3-editable" : ""}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!onUpdateBlog) return;
                    const newSections = [...blog.sections];
                    const newBullets = [...(newSections[sIdx].bullets ?? [])];
                    newBullets[bIdx] = e.currentTarget.innerText;
                    newSections[sIdx] = { ...newSections[sIdx], bullets: newBullets };
                    onUpdateBlog({ ...blog, sections: newSections });
                  }}
                >
                  {b}
                </li>
              ))}
            </ul>
          )}
          {(s.subtopics?.length ?? 0) > 0 &&
            s.subtopics!.map((st, stIdx) => (
              <div key={stIdx} className="p3-subtopic">
                <h5
                  className={`p3-h5 ${isEditing ? "p3-editable" : ""}`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!onUpdateBlog) return;
                    const text = e.currentTarget.innerText.replace(/^🐾\s*/, "");
                    const newSections = [...blog.sections];
                    const newSubtopics = [...(newSections[sIdx].subtopics ?? [])];
                    newSubtopics[stIdx] = { ...newSubtopics[stIdx], subheading: text };
                    newSections[sIdx] = { ...newSections[sIdx], subtopics: newSubtopics };
                    onUpdateBlog({ ...blog, sections: newSections });
                  }}
                >
                  <PawHeadIcon />
                  {st.subheading}
                </h5>
                {st.paragraphs.map((p, stPIdx) => (
                  <p
                    key={stPIdx}
                    className={isEditing ? "p3-editable" : ""}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!onUpdateBlog) return;
                      const newSections = [...blog.sections];
                      const newSubtopics = [...(newSections[sIdx].subtopics ?? [])];
                      const newSubParas = [...newSubtopics[stIdx].paragraphs];
                      newSubParas[stPIdx] = e.currentTarget.innerText;
                      newSubtopics[stIdx] = { ...newSubtopics[stIdx], paragraphs: newSubParas };
                      newSections[sIdx] = { ...newSections[sIdx], subtopics: newSubtopics };
                      onUpdateBlog({ ...blog, sections: newSections });
                    }}
                  >
                    {p}
                  </p>
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
        <p
          key={i}
          className={isEditing ? "p3-editable" : ""}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            if (!onUpdateBlog) return;
            const newConc = [...blog.conclusion];
            newConc[i] = e.currentTarget.innerText;
            onUpdateBlog({ ...blog, conclusion: newConc });
          }}
        >
          {p}
        </p>
      ))}

      <h3 className="p3-h3">
        <PawHeadIcon />
        Frequently Asked Questions
      </h3>
      <div className="p3-faq-container">
        {blog.faqs.map((f, i) => (
          <details key={i} className="p3-faq-accordion" open={i === 0}>
            <summary className="p3-faq-summary">
              <p
                className={`p3-faq-q ${isEditing ? "p3-editable" : ""}`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!onUpdateBlog) return;
                  const newFaqs = [...blog.faqs];
                  newFaqs[i] = { ...newFaqs[i], question: e.currentTarget.innerText };
                  onUpdateBlog({ ...blog, faqs: newFaqs });
                }}
              >
                <strong>{f.question}</strong>
              </p>
              <span className="p3-faq-arrow">›</span>
            </summary>
            <div className="p3-faq-content">
              <p
                className={isEditing ? "p3-editable" : ""}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!onUpdateBlog) return;
                  const newFaqs = [...blog.faqs];
                  newFaqs[i] = { ...newFaqs[i], answer: e.currentTarget.innerText };
                  onUpdateBlog({ ...blog, faqs: newFaqs });
                }}
              >
                {f.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// ── Main page component ────────────────────────────────────────────────────────

export default function Page3({ onBack }: Page3Props) {
  // Empty initial state so Page 3 is NOT populated on open!
  const [topic, setTopic] = useState("");
  const [blog, setBlog] = useState<SeoBlog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<string[]>(() => globalTopicEngine.getBatch(5));

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

  const [posts, setPosts] = useState<LinkedInPosts | null>(null);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<keyof LinkedInPosts>("safeBet");
  const [copied, setCopied] = useState(false);
  const [blogCopied, setBlogCopied] = useState(false);
  const [metaDescription, setMetaDescription] = useState("");
  const [metaCopied, setMetaCopied] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

  const copyMetaDescription = async () => {
    if (!metaDescription) return;
    await navigator.clipboard.writeText(metaDescription);
    setMetaCopied(true);
    setTimeout(() => setMetaCopied(false), 1500);
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    setPosts(null);
    setPostsError(null);
    try {
      const res = await fetch("/api/generate-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setBlog(data.blog);
      setMetaDescription(generateMetaDescription(topic));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const generateLinkedInPosts = async () => {
    if (!blog) return;
    setPostsLoading(true);
    setPostsError(null);
    try {
      const res = await fetch("/api/generate-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blog }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setPosts(data.posts);
      setActiveTab("safeBet");
    } catch (err) {
      setPostsError((err as Error).message);
    } finally {
      setPostsLoading(false);
    }
  };

  const copyActivePost = async () => {
    if (!posts) return;
    await navigator.clipboard.writeText(posts[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getBlogText = (b: SeoBlog) => {
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
    return [
      `# ${b.title}`,
      b.intro.join("\n\n"),
      sectionBlocks,
      b.vetCta,
      `### Conclusion`,
      b.conclusion.join("\n\n"),
      `### Frequently Asked Questions`,
      faqBlock,
    ].join("\n\n");
  };

  const getBlogHtml = (b: SeoBlog) => {
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

    return `<h1 style="font-size: 20pt; font-weight: bold;">${b.title}</h1>${introHtml}${sectionHtml}${ctaHtml}${conclusionHtml}${faqHtml}`;
  };

  const exportAsText = (b: SeoBlog) => {
    const fullText = getBlogText(b);
    const blobUrl = URL.createObjectURL(new Blob([fullText], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${b.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  const exportAsWord = (b: SeoBlog) => {
    const fullHtml = getBlogHtml(b);
    const wordDocumentHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${b.title}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; margin: 1in; }
          h1 { font-size: 22pt; font-weight: bold; color: #0f172a; margin-bottom: 12pt; }
          h2 { font-size: 15pt; font-weight: bold; color: #166534; margin-top: 18pt; margin-bottom: 6pt; }
          h3 { font-size: 13pt; font-weight: bold; color: #166534; margin-top: 12pt; margin-bottom: 4pt; }
          p { margin-bottom: 10pt; line-height: 1.6; }
          ul { margin-bottom: 10pt; padding-left: 20pt; }
          li { margin-bottom: 4pt; }
          a { color: #68B77A; font-weight: bold; text-decoration: underline; }
        </style>
      </head>
      <body>
        ${fullHtml}
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + wordDocumentHtml], { type: "application/msword" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${b.title.replace(/\s+/g, "-").toLowerCase()}.doc`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  const exportAsPdf = () => {
    window.print();
  };

  const downloadMarkdown = (b: SeoBlog) => {
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

  const copyAllLinkedInPosts = async (p: LinkedInPosts) => {
    const combined = `=== SAFE BET (Standard Professional) ===\n\n${p.safeBet}\n\n` +
      `========================================\n` +
      `=== CLEAN LABEL (Short & Punchy) ===\n\n${p.cleanLabel}\n\n` +
      `========================================\n` +
      `=== MICRO-STORY (Emotional Narrative) ===\n\n${p.microStory}`;

    await navigator.clipboard.writeText(combined);
    setToastMsg("All 3 LinkedIn posts copied to clipboard!");
  };

  const copyBlogToClipboard = async (b: SeoBlog) => {
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

  return (
    <div className="p3-root">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="p3-header">
        <div className="p3-header-text">
          <span className="p3-step-chip">STEP 3 OF 3</span>
          <h1 className="p3-heading">SEO Blog Generator</h1>
          <p className="p3-subheading">
            Describe a topic and get a ~1200-word blog with an intro, subheadings,<br />
            and 5 FAQs. Leave this blank to finish without generating a blog.
          </p>
        </div>
      </div>

      {/* ── Topic input (Matching Reference Screenshot Pixel-Accurately) ── */}
      <div className="p3-field">
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
              if (e.key === "Enter" && !loading && topic.trim()) generate();
            }}
          />

          <span className="p3-input-char-count">{topic.length} / {charMax}</span>
          <span className="p3-input-divider" aria-hidden="true" />

          <button
            type="button"
            className={`p3-input-idea-btn ${isSuggesting ? "p3-idea-pop" : ""}`}
            onClick={handleSuggestTopic}
            title="Suggest a topic"
            aria-label="Suggest a topic"
          >
            💡
          </button>

          <button
            id="p3-gen-btn"
            className="p3-input-gen-btn"
            onClick={generate}
            disabled={loading || !topic.trim()}
          >
            {loading ? <span className="p3-spinner" /> : <GreenSparklesIcon />}
            {loading ? "Generating…" : "Generate Blog"}
          </button>
        </div>

        {/* Input Meta Note */}
        <div className="p3-field-meta">
          <span>Press Enter to generate</span>
        </div>

        {/* Inspiration Prompt Chips with Paw Icon */}
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
                onClick={() => setTopic(chipText)}
              >
                🐾 {chipText}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────────── */}
      {error && <p className="p3-error">{error}</p>}

      {/* ── Funky Loader Modal when AI is generating blog ── */}
      {loading && <FunkyCounterLoader topic={topic} />}

      {/* ── Workspace (two-column after generation) ──────────── */}
      {!loading && blog && (
        <div className="p3-workspace text-reveal-entry">

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
                  className="p3-btn p3-btn--ghost p3-btn--sm"
                  onClick={() => copyBlogToClipboard(blog)}
                  title="Copy formatted blog content"
                >
                  <CopyIcon />
                  {blogCopied ? "Copied!" : "Copy"}
                </button>
                <button
                  id="p3-top-export-btn"
                  className="p3-btn p3-btn--ghost p3-btn--sm"
                  onClick={() => exportAsText(blog)}
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
                            setIsEditing(!isEditing);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="p3-dropdown-icon">{isEditing ? "✅" : "✏️"}</span>
                          <span>{isEditing ? "Exit Edit Mode" : "Edit Blog Content"}</span>
                        </button>

                        <button
                          type="button"
                          className="p3-dropdown-item"
                          onClick={() => {
                            downloadMarkdown(blog);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="p3-dropdown-icon">📥</span>
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
                          <span className="p3-dropdown-icon">🌐</span>
                          <span>Download HTML (.html)</span>
                        </button>

                        <button
                          type="button"
                          className="p3-dropdown-item"
                          onClick={() => {
                            exportAsWord(blog);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="p3-dropdown-icon">📝</span>
                          <span>Download Word (.doc)</span>
                        </button>

                        <button
                          type="button"
                          className="p3-dropdown-item"
                          onClick={() => {
                            exportAsPdf();
                            setMenuOpen(false);
                          }}
                        >
                          <span className="p3-dropdown-icon">📄</span>
                          <span>Download PDF / Print</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Badges Bar */}
            <div className="p3-dashboard-bar">
              <span className="p3-dash-badge p3-dash-badge--purple">📝 {calculateWords(blog).toLocaleString()} words</span>
              <span className="p3-dash-badge p3-dash-badge--blue">🔤 {calculateChars(blog).toLocaleString()} chars</span>
              <span className="p3-dash-badge p3-dash-badge--cream">⏱️ {getReadTime(calculateWords(blog))}</span>
              <span className="p3-dash-badge p3-dash-badge--seo">🚀 SEO 94/100</span>
            </div>

            <div className="p3-scroll">
              {/* Meta Description Section */}
              <div className="p3-meta-card">
                <div className="p3-meta-header">
                  <div className="p3-meta-title">
                    <span className="p3-meta-icon">🔍</span>
                    <span>SEO Meta Description</span>
                  </div>
                  <div className="p3-meta-header-right">
                    <span
                      className={`p3-meta-count ${
                        metaDescription.length >= 150 && metaDescription.length <= 160
                          ? "p3-meta-count--optimal"
                          : ""
                      }`}
                    >
                      {metaDescription.length} / 160 chars
                    </span>
                    <button
                      type="button"
                      className="p3-btn p3-btn--ghost p3-btn--sm"
                      onClick={copyMetaDescription}
                    >
                      <CopyIcon />
                      {metaCopied ? "Copied!" : "Copy Meta"}
                    </button>
                  </div>
                </div>
                <textarea
                  className="p3-meta-textarea"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO-friendly meta description (150–160 characters)..."
                  rows={3}
                />
                <div className="p3-meta-footer">
                  <span>Target length: 150–160 characters for search engine snippets.</span>
                </div>
              </div>

              <BlogRenderer
                blog={blog}
                isEditing={isEditing}
                onUpdateBlog={handleUpdateBlog}
              />
            </div>

            <div className="p3-panel-actions">
              <button
                id="p3-copy-blog-btn"
                className="p3-btn p3-btn--ghost"
                onClick={() => copyBlogToClipboard(blog)}
              >
                <CopyIcon />
                {blogCopied ? "Copied!" : "Copy"}
              </button>
              <button
                id="p3-export-btn"
                className="p3-btn p3-btn--ghost"
                onClick={() => exportAsText(blog)}
              >
                <ExportIcon />
                Export .md
              </button>
            </div>
          </div>

          {/* RIGHT — LinkedIn posts */}
          <div className="p3-panel p3-panel--aside">
            <div className="p3-panel-bar">
              <span className="p3-panel-label p3-li-title">
                <span className="p3-li-icon"><LinkedInIcon /></span>
                LinkedIn Posts
              </span>
            </div>

            <p className="p3-aside-desc">
              Turn this blog into LinkedIn posts<br />for different content styles.
            </p>

            <button
              id="p3-gen-posts-btn"
              className="p3-btn p3-btn--teal p3-btn--full"
              onClick={generateLinkedInPosts}
              disabled={postsLoading}
            >
              {postsLoading ? <span className="p3-spinner" /> : "+ Generate Posts"}
            </button>

            <hr className="p3-aside-divider" />
            <p className="p3-aside-style-label">CONTENT STYLE</p>

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
                    className="p3-btn p3-btn--ghost p3-btn--full"
                    onClick={copyActivePost}
                    style={{ flex: 1 }}
                  >
                    <CopyIcon />
                    {copied ? "Copied!" : "Copy Active"}
                  </button>
                  <button
                    type="button"
                    className="p3-btn p3-btn--ghost p3-btn--full"
                    onClick={() => copyAllLinkedInPosts(posts)}
                    title="Copy all 3 post variations at once"
                    style={{ flex: 1 }}
                  >
                    📋 Copy All 3
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Studio Focus Canvas Modal ───────────────── */}
      {isFocusMode && blog && (
        <div className="p3-focus-backdrop" onClick={() => setIsFocusMode(false)}>
          <div className="p3-focus-modal" onClick={(e) => e.stopPropagation()}>
            <div className="p3-focus-header">
              <div className="p3-focus-title">
                <RibbonIcon />
                <span>{blog.title}</span>
                <span className="p3-dash-badge p3-dash-badge--purple">~{blog.approxWordCount} words</span>
              </div>
              <div className="p3-focus-actions">
                <button
                  className="p3-btn p3-btn--ghost"
                  onClick={() => copyBlogToClipboard(blog)}
                >
                  <CopyIcon /> {blogCopied ? "Copied!" : "Copy"}
                </button>
                <button
                  className="p3-btn p3-btn--ghost"
                  onClick={() => exportAsText(blog)}
                >
                  <ExportIcon /> Export .md
                </button>
                <button
                  className="p3-btn p3-btn--teal"
                  onClick={() => setIsFocusMode(false)}
                >
                  ✕ Exit Studio
                </button>
              </div>
            </div>
            <div className="p3-focus-content">
              <BlogRenderer blog={blog} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}