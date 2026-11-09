import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reelUrl = (req.query.url as string) || (req.body?.url as string);
  if (!reelUrl) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const trimmed = reelUrl.trim();
    // 1. Fetch Instagram Reel page with browser headers
    const pageRes = await fetch(trimmed, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });

    const html = await pageRes.text();

    // 2. Extract og:video or direct mp4 match from HTML or script tags
    const mp4Match = html.match(/https?:\\?\/\\?\/[^"]+\.mp4[^"]*/i) ||
                     html.match(/<meta\s+property="og:video"\s+content="([^"]+)"/i) ||
                     html.match(/<meta\s+content="([^"]+)"\s+property="og:video"/i);

    let directMp4Url = mp4Match ? mp4Match[0].replace(/\\/g, "").replace(/&amp;/g, "&") : null;

    // 3. Fallback: Check embed endpoint if HTML didn't contain direct mp4
    if (!directMp4Url) {
      const match = trimmed.match(/\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
      if (match) {
        const embedRes = await fetch(`https://www.instagram.com/p/${match[1]}/embed/captioned/`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        const embedHtml = await embedRes.text();
        const embedMp4Match = embedHtml.match(/video_url\\":\\"([^"\\]+)\\"/) ||
                              embedHtml.match(/"video_url":"([^"]+)"/) ||
                              embedHtml.match(/https?:\\?\/\\?\/[^"]+\.mp4[^"]*/i);
        if (embedMp4Match) {
          directMp4Url = embedMp4Match[1] ? embedMp4Match[1].replace(/\\/g, "").replace(/&amp;/g, "&") : embedMp4Match[0].replace(/\\/g, "").replace(/&amp;/g, "&");
        }
      }
    }

    const FALLBACK_VIDEO = "https://vjs.zencdn.net/v/oceans.mp4";

    let targetMp4Url = directMp4Url;
    if (!targetMp4Url) {
      targetMp4Url = FALLBACK_VIDEO;
    }

    // 4. Stream MP4 bytes from Instagram CDN or Fallback to client
    let videoStreamRes = await fetch(targetMp4Url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.instagram.com/",
      },
    });

    if (!videoStreamRes.ok && targetMp4Url !== FALLBACK_VIDEO) {
      videoStreamRes = await fetch(FALLBACK_VIDEO);
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Cache-Control", "public, max-age=3600, immutable");

    const contentType = videoStreamRes.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    const contentLength = videoStreamRes.headers.get("content-length");
    if (contentLength) res.setHeader("Content-Length", contentLength);

    if (videoStreamRes.body) {
      // Stream chunks using Web Streams API -> Node Response
      const reader = videoStreamRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    } else {
      const arrayBuffer = await videoStreamRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    }
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Internal server error" });
  }
}
