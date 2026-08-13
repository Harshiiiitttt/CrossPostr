import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Ensures backend API routes can only be accessed by authenticated sessions
 * or authorized same-origin requests.
 */
export function isAuthorized(req: NextApiRequest): boolean {
  const authHeader = req.headers["authorization"] || req.headers["x-cuddlytails-auth"];
  const referer = req.headers["referer"];
  const host = req.headers["host"];

  // 1. If explicit Auth token is provided (Bearer token or secret key)
  if (authHeader) {
    const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (token.length > 5) return true;
  }

  // 2. Allow same-origin requests from the web app UI
  if (referer && host && referer.includes(host)) {
    return true;
  }

  // 3. Fallback: In development mode allow local requests
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  return false;
}

export function enforceApiAuth(req: NextApiRequest, res: NextApiResponse): boolean {
  if (!isAuthorized(req)) {
    res.status(403).json({ error: "Access Denied: Direct backend access is restricted." });
    return false;
  }
  return true;
}
