import type { NextApiRequest, NextApiResponse } from "next";
import { generateBlog } from "@/lib/blogGenerator";
import type { SeoBlog } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ blog: SeoBlog } | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { topic } = req.body as { topic: string };
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: "Please provide a blog topic." });
  }
  try {
    const blog = await generateBlog(topic);
    res.status(200).json({ blog });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
