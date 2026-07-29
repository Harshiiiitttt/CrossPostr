import type { NextApiRequest, NextApiResponse } from "next";
import { generateLinkedInPosts } from "@/lib/linkedinGenerator";
import type { LinkedInPosts, SeoBlog } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ posts: LinkedInPosts } | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { blog } = (req.body ?? {}) as { blog?: SeoBlog };
    if (!blog || !blog.title) {
      return res.status(400).json({ error: "Missing blog content to generate posts from." });
    }

    const posts = await generateLinkedInPosts(blog);
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}