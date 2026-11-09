import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { SeoBlog, LinkedInPosts, PetCareReview, BlogHistoryItem, ReviewHistoryItem } from "@/lib/types";

const STORAGE_KEY = "cuddlytails_p3_blog_state";
const REVIEWS_STORAGE_KEY = "cuddlytails_p2_reviews_state";
const BLOG_HISTORY_KEY = "cuddlytails_blog_history";
const REVIEW_HISTORY_KEY = "cuddlytails_review_history";

export interface BrandPersona {
  id: string;
  name: string;
  icon: string;
  desc: string;
  target: string;
}

export const BRAND_PERSONAS: BrandPersona[] = [
  {
    id: "playful",
    name: "Playful & Caring Pet Parent",
    icon: "🐾",
    desc: "Empathetic, cozy, warm, and friendly tone focusing on pet love, comfort, and joy.",
    target: "Dog Owners & Pet Families",
  },
  {
    id: "vet",
    name: "Authoritative Vet & Health Expert",
    icon: "🩺",
    desc: "Scientific, trustworthy, evidence-backed tone focusing on canine wellness & safety.",
    target: "Vet Care Seekers & Health Enthusiasts",
  },
  {
    id: "eco",
    name: "Clean-Label & Eco-Conscious",
    icon: "🌿",
    desc: "Transparent, natural, holistic tone focusing on organic care & premium ingredients.",
    target: "Holistic Pet Parents & Conscious Buyers",
  },
  {
    id: "active",
    name: "Energetic & Action-Focused",
    icon: "⚡",
    desc: "High-energy, motivating, concise tone focusing on agility, training, and active lifestyle.",
    target: "Active Dog Handlers & Trainers",
  },
];

interface BlogGenerationContextType {
  topic: string;
  setTopic: (t: string) => void;
  blog: SeoBlog | null;
  setBlog: React.Dispatch<React.SetStateAction<SeoBlog | null>>;
  posts: LinkedInPosts | null;
  setPosts: React.Dispatch<React.SetStateAction<LinkedInPosts | null>>;
  metaDescription: string;
  setMetaDescription: React.Dispatch<React.SetStateAction<string>>;
  activePersona: BrandPersona;
  setActivePersona: (p: BrandPersona) => void;
  reviews: PetCareReview[] | null;
  setReviews: React.Dispatch<React.SetStateAction<PetCareReview[] | null>>;
  reviewsLoading: boolean;
  reviewsError: string | null;
  generateReviews: (options?: { serviceType?: string; location?: string; persona?: string; reviewLength?: "detailed" | "short" }) => Promise<void>;
  loading: boolean;
  error: string | null;
  postsLoading: boolean;
  postsError: string | null;
  generateBlog: (topicInput: string) => Promise<void>;
  generateLinkedInPosts: () => Promise<void>;
  resetBlogState: () => void;

  // History state & methods
  blogHistory: BlogHistoryItem[];
  reviewHistory: ReviewHistoryItem[];
  loadBlogFromHistory: (item: BlogHistoryItem) => void;
  deleteBlogHistoryItem: (id: string) => void;
  clearBlogHistory: () => void;
  loadReviewsFromHistory: (item: ReviewHistoryItem) => void;
  deleteReviewHistoryItem: (id: string) => void;
  clearReviewHistory: () => void;
}

const BlogGenerationContext = createContext<BlogGenerationContextType | undefined>(undefined);

const generateMetaDescriptionHelper = (topicInput: string): string => {
  const cleanTopic = topicInput
    .trim()
    .replace(/[?.!]+$/, "")
    .replace(/^(what\s+causes|what\s+are\s+the\s+causes\s+of|what\s+is\s+causing|why\s+is\s+my|why\s+does\s+my|how\s+to\s+stop|how\s+to\s+treat|how\s+to\s+fix|how\s+to)\s+/i, "")
    .trim();
  const mentionsDog = /dogs?|pupp(y|ies)/i.test(cleanTopic);
  const topicPhrase = mentionsDog ? cleanTopic : `${cleanTopic} for dogs`;
  const lowerTopic = topicPhrase.toLowerCase();

  const isSafetyOrGear = /car|safety|harness|restraint|seatbelt|travel|crate|leash|collar|gear|carrier|seat/i.test(lowerTopic);

  const candidates = isSafetyOrGear
    ? [
        `Learn about ${lowerTopic}. Discover expert travel safety tips, proper harness fitting guidelines, crash-tested gear advice, and essential road trip care.`,
        `Discover essential facts about ${lowerTopic}. Learn proper harness fitting, travel restraint benefits, crash-tested gear, and safety tips for your pet.`,
        `Learn about ${lowerTopic}. Discover key benefits of pet seatbelts, harness fitting guides, road trip safety tips, and expert pet travel advice.`,
        `Learn about ${lowerTopic}. Discover proper harness fitting, crash-tested restraint tips, and expert road trip safety advice for your dog.`,
      ]
    : [
        `Learn about ${lowerTopic}. Discover practical care tips, routine guidance, essential advice, and expert recommendations to keep your dog happy and healthy.`,
        `Discover essential facts about ${lowerTopic}. Learn key daily care tips, practical owner guidance, and expert recommendations for your pet's well-being.`,
        `Learn about ${lowerTopic}. Discover practical pet care advice, key daily tips, and essential guidance from pet experts to keep your companion thriving.`,
        `Learn about ${lowerTopic}. Discover key causes, symptoms to watch for, practical home care tips, and expert vet guidance for your dog.`,
        `Learn about ${lowerTopic}. Discover common causes, warning signs, safe treatment options, and preventative care tips for your dog.`,
        `Learn about ${lowerTopic}. Discover causes, symptoms, and expert veterinary care tips to keep your dog healthy.`,
      ];

  for (const c of candidates) {
    if (c.length >= 140 && c.length <= 165) return c;
  }

  // Guarantee exact 145-162 char optimal SERP length
  let fallback = candidates[0];
  if (fallback.length > 164) {
    fallback = fallback.slice(0, 161).replace(/\s+\S*$/, "") + ".";
  }
  while (fallback.length < 142) {
    fallback = fallback.replace(/\.$/, " for every pet parent.");
  }
  return fallback;
};

export function BlogGenerationProvider({ children }: { children: ReactNode }) {
  const [topic, setTopic] = useState("");
  const [blog, setBlog] = useState<SeoBlog | null>(null);
  const [posts, setPosts] = useState<LinkedInPosts | null>(null);
  const [metaDescription, setMetaDescription] = useState("");
  const [activePersona, setActivePersona] = useState<BrandPersona>(BRAND_PERSONAS[0]);

  const [reviews, setReviews] = useState<PetCareReview[] | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [blogHistory, setBlogHistory] = useState<BlogHistoryItem[]>([]);
  const [reviewHistory, setReviewHistory] = useState<ReviewHistoryItem[]>([]);

  // Hydrate state & history on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.topic) setTopic(parsed.topic);
          if (parsed.blog) setBlog(parsed.blog);
          if (parsed.posts) setPosts(parsed.posts);
          if (parsed.metaDescription) setMetaDescription(parsed.metaDescription);
          if (parsed.activePersona) {
            const found = BRAND_PERSONAS.find((p) => p.id === parsed.activePersona.id);
            if (found) setActivePersona(found);
          }
          if (parsed.loading) setLoading(Boolean(parsed.loading));
        }

        const savedRev = sessionStorage.getItem(REVIEWS_STORAGE_KEY);
        if (savedRev) {
          const parsedRev = JSON.parse(savedRev);
          if (Array.isArray(parsedRev.reviews)) setReviews(parsedRev.reviews);
        }

        const savedBlogHist = localStorage.getItem(BLOG_HISTORY_KEY);
        if (savedBlogHist) setBlogHistory(JSON.parse(savedBlogHist));

        const savedRevHist = localStorage.getItem(REVIEW_HISTORY_KEY);
        if (savedRevHist) setReviewHistory(JSON.parse(savedRevHist));
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  // Save state to sessionStorage & localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (blog || loading || topic || activePersona) {
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ topic, blog, posts, metaDescription, activePersona, loading })
          );
        }
      } catch (e) {
        /* ignore */
      }
    }
  }, [topic, blog, posts, metaDescription, activePersona, loading]);

  useEffect(() => {
    if (typeof window !== "undefined" && (reviews || reviewsLoading)) {
      try {
        sessionStorage.setItem(
          REVIEWS_STORAGE_KEY,
          JSON.stringify({ reviews, reviewsLoading })
        );
      } catch (e) {
        /* ignore */
      }
    }
  }, [reviews, reviewsLoading]);

  function detectTopicIconType(topic: string = "", title: string = ""): string {
    const text = `${topic} ${title}`.toLowerCase();
    if (text.match(/bone|broth|joint|arthritis|hip|cartilage/)) return "bone";
    if (text.match(/teeth|dental|tooth|breath|gums|plaque/)) return "tooth";
    if (text.match(/eye|vision|swollen|sight|cataract|blind/)) return "eye";
    if (text.match(/car|road|trip|travel|drive|transport|ride|vehicle/)) return "car";
    if (text.match(/train|behavior|bark|leash|puppy|school|command|bite|chew|anxiety|obey/)) return "graduation";
    if (text.match(/food|diet|nutrition|feed|kibble|eat|stomach|digest|recipe|bowl/)) return "bowl";
    if (text.match(/fruit|treat|snack|apple|toxic|safe|vegetable/)) return "apple";
    if (text.match(/bath|groom|wash|shampoo|clean|fur|coat|skin|brush|shedding|scissors/)) return "bath";
    if (text.match(/walk|hike|exercise|run|outdoor|park|activity|footstep/)) return "footstep";
    if (text.match(/health|disease|hereditary|vet|medical|shield|illness|cure|vaccine|sick|doctor|infection|flea|tick|bloat|gdv|emergency/)) return "shield";
    return "paw";
  }

  const saveBlogToHistory = (
    newBlog: SeoBlog,
    activeTopic: string,
    newMeta: string,
    persona: BrandPersona,
    newPosts: LinkedInPosts | null = null
  ) => {
    const newItem: BlogHistoryItem = {
      id: `blog_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      topic: activeTopic,
      blog: newBlog,
      posts: newPosts,
      metaDescription: newMeta,
      persona: { id: persona.id, name: persona.name, icon: persona.icon },
      iconType: detectTopicIconType(activeTopic, newBlog.title),
    };

    setBlogHistory((prev) => {
      const updated = [newItem, ...prev.filter((item) => item.topic !== activeTopic)].slice(0, 20);
      if (typeof window !== "undefined") {
        localStorage.setItem(BLOG_HISTORY_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const saveReviewToHistory = (
    newReviews: PetCareReview[],
    options?: { serviceType?: string; location?: string }
  ) => {
    const newItem: ReviewHistoryItem = {
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      serviceType: options?.serviceType || "Pet Care",
      location: options?.location || "National",
      reviews: newReviews,
    };

    setReviewHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 20);
      if (typeof window !== "undefined") {
        localStorage.setItem(REVIEW_HISTORY_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const generateReviews = async (options?: { serviceType?: string; location?: string; persona?: string; reviewLength?: "detailed" | "short" }) => {
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const res = await fetch("/api/generate-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options ?? {}),
      });
      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await res.json() : null;
      if (!res.ok) {
        throw new Error(data?.error || `Server error (${res.status}). Please try again.`);
      }
      setReviews(data.reviews);
      saveReviewToHistory(data.reviews, options);
    } catch (err) {
      setReviewsError((err as Error).message);
    } finally {
      setReviewsLoading(false);
    }
  };

  const generateBlog = async (topicInput: string) => {
    const activeTopic = topicInput.trim();
    if (!activeTopic) return;

    setLoading(true);
    setError(null);
    setPosts(null);
    setPostsError(null);

    try {
      const res = await fetch("/api/generate-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: activeTopic, persona: activePersona.id }),
      });

      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await res.json() : null;

      if (!res.ok) {
        throw new Error(data?.error || `Server error (${res.status}). Please try again.`);
      }

      const generatedBlog = data.blog;
      const generatedMeta = generateMetaDescriptionHelper(activeTopic);

      setBlog(generatedBlog);
      setMetaDescription(generatedMeta);
      saveBlogToHistory(generatedBlog, activeTopic, generatedMeta, activePersona, null);

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              topic: activeTopic,
              blog: generatedBlog,
              posts: null,
              metaDescription: generatedMeta,
              activePersona,
              loading: false,
            })
          );
        } catch (e) {
          /* ignore */
        }
      }
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
        body: JSON.stringify({ blog, persona: activePersona.id }),
      });

      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await res.json() : null;

      if (!res.ok) {
        throw new Error(data?.error || `Server error (${res.status}). Please try again.`);
      }

      setPosts(data.posts);
      saveBlogToHistory(blog, topic, metaDescription, activePersona, data.posts);
    } catch (err) {
      setPostsError((err as Error).message);
    } finally {
      setPostsLoading(false);
    }
  };

  const resetBlogState = () => {
    setBlog(null);
    setPosts(null);
    setTopic("");
    setMetaDescription("");
    setError(null);
    setLoading(false);
    setPostsError(null);
    setPostsLoading(false);

    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        /* ignore */
      }
    }
  };

  const loadBlogFromHistory = (item: BlogHistoryItem) => {
    if (!item) return;
    if (item.topic) setTopic(item.topic);
    if (item.blog) setBlog(item.blog);
    if (item.posts) setPosts(item.posts);
    if (item.metaDescription) setMetaDescription(item.metaDescription);
    if (item.persona?.id) {
      const foundP = BRAND_PERSONAS.find((p) => p.id === item.persona.id);
      if (foundP) setActivePersona(foundP);
    }
  };

  const deleteBlogHistoryItem = (id: string) => {
    setBlogHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(BLOG_HISTORY_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearBlogHistory = () => {
    setBlogHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(BLOG_HISTORY_KEY);
    }
  };

  const loadReviewsFromHistory = (item: ReviewHistoryItem) => {
    setReviews(item.reviews);
  };

  const deleteReviewHistoryItem = (id: string) => {
    setReviewHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(REVIEW_HISTORY_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearReviewHistory = () => {
    setReviewHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(REVIEW_HISTORY_KEY);
    }
  };

  return (
    <BlogGenerationContext.Provider
      value={{
        topic,
        setTopic,
        blog,
        setBlog,
        posts,
        setPosts,
        metaDescription,
        setMetaDescription,
        activePersona,
        setActivePersona,
        reviews,
        setReviews,
        reviewsLoading,
        reviewsError,
        generateReviews,
        loading,
        error,
        postsLoading,
        postsError,
        generateBlog,
        generateLinkedInPosts,
        resetBlogState,
        blogHistory,
        reviewHistory,
        loadBlogFromHistory,
        deleteBlogHistoryItem,
        clearBlogHistory,
        loadReviewsFromHistory,
        deleteReviewHistoryItem,
        clearReviewHistory,
      }}
    >
      {children}
    </BlogGenerationContext.Provider>
  );
}

export function useBlogGeneration() {
  const context = useContext(BlogGenerationContext);
  if (!context) {
    throw new Error("useBlogGeneration must be used within a BlogGenerationProvider");
  }
  return context;
}
