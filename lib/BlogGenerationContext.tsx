import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { SeoBlog, LinkedInPosts, PetCareReview } from "@/lib/types";

const STORAGE_KEY = "cuddlytails_p3_blog_state";
const REVIEWS_STORAGE_KEY = "cuddlytails_p2_reviews_state";

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
}

const BlogGenerationContext = createContext<BlogGenerationContextType | undefined>(undefined);

const generateMetaDescriptionHelper = (topicInput: string): string => {
  const cleanTopic = topicInput.trim().replace(/\.$/, "");
  const mentionsDog = /dogs?/i.test(cleanTopic);
  const topicPhrase = mentionsDog ? cleanTopic : `${cleanTopic} in dogs`;
  const lowerTopic = topicPhrase.toLowerCase();

  const variations = [
    `Learn about ${lowerTopic}. Discover common symptoms, underlying causes, effective treatment options, and practical vet advice to keep your pet healthy.`,
    `Learn about ${lowerTopic}. Discover key signs to watch for, main causes, practical treatment options, and essential vet care tips to protect your dog.`,
    `Discover essential facts about ${lowerTopic}. Learn common symptoms, underlying causes, treatment options, and when to see your vet to protect your pet.`,
  ];

  for (const base of variations) {
    if (base.length >= 150 && base.length <= 160) return base;
    const trims = [
      base.replace(" to keep your pet healthy.", " for your pet."),
      base.replace(" to protect your dog.", "."),
      base.replace(" to protect your pet.", "."),
    ];
    for (const t of trims) {
      if (t.length >= 150 && t.length <= 160) return t;
    }
  }

  const defaultBase = variations[0];
  if (defaultBase.length > 160) return defaultBase.slice(0, 157) + "...";
  return defaultBase;
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

  // Hydrate state on client mount
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
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  // Save state to sessionStorage
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
