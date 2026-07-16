# CuddlyTails Content Suite

A 3-step internal tool for repurposing and generating CuddlyTails social content:

1. **Extract, watermark & publish** - pulls Reels from your own authorized Instagram
   account, layers your image + text watermark, and cross-posts to Pinterest,
   Instagram, X, and YouTube.
2. **Review generator** - drafts 4 humanized client reviews for cuddlytails.com.
3. **SEO blog generator** - turns a shared Google Doc's themes into 4 long-form,
   FAQ-ended SEO blog posts.

All 3 steps are optional. Leave any field blank and hit **Next** to skip.

## Setup

1. **Install a package manager** if you don't have one. This project uses `npm`
   (already bundled with Node.js 18+); `pnpm` or `bun` work too, just swap the
   commands below for their equivalents (`pnpm install`, `bun install`, etc).

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install ffmpeg** (used for watermarking). On macOS: `brew install ffmpeg`.
   On Ubuntu/Debian: `sudo apt install ffmpeg ttf-mscorefonts-installer`.

4. **Configure credentials.** Copy the example env file and fill it in - see
   `init.md` for exactly where each key comes from:

   ```bash
   cp .env.example .env
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## How it fits together

```
pages/index.tsx          -> renders <Wizard />
components/Wizard.tsx    -> holds the current step (1-3) and Next/Back handlers
components/Page1.tsx     -> extractor/watermark/publish UI, calls /api/process-page1
components/Page2.tsx     -> review UI, calls /api/generate-reviews
components/Page3.tsx     -> blog UI, calls /api/generate-blogs

lib/extractor.ts   -> pulls Reel video + caption + owner from Instagram Graph API
lib/watermark.ts   -> ffmpeg overlay (image, top-left) + drawtext (text, bottom-left)
lib/publisher.ts   -> formats caption, cross-posts to each selected platform
lib/reviewGenerator.ts -> prompts Claude for 4 service-specific reviews
lib/blogGenerator.ts   -> pulls Google Doc text, prompts Claude for 4 SEO blogs
```

## Important scope note on Page 1

The extractor only works against Reels published by **your own** authorized
Instagram account (via the official Graph API). It does not scrape or download
other creators' videos - reposting someone else's content elsewhere without
their permission would violate Instagram's Terms of Service and copyright law.
If your use case is different from "repost my own published Reels to other
platforms," this tool isn't the right fit for it.
