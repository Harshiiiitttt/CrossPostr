import type { NextApiRequest, NextApiResponse } from "next";
import { generateReviews } from "@/lib/reviewGenerator";
import type { PetCareReview } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ reviews: PetCareReview[] } | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { serviceType, location, persona, reviewLength } = req.body ?? {};
    const reviews = await generateReviews({ serviceType, location, persona, reviewLength });
    res.status(200).json({ reviews });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}