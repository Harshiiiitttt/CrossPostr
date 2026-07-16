# Configuration & Credentials

All secrets live in a root `.env` file (never commit it - it's already covered
by the default Next.js `.gitignore`). Copy `.env.example` to `.env` and fill
in the values below.

## 1. Instagram Graph API (`IG_ACCESS_TOKEN`, `IG_BUSINESS_ACCOUNT_ID`)

Scope: only works for Reels published by the account you authorize here.

1. Create a Meta app at https://developers.facebook.com/apps.
2. Add the **Instagram Graph API** product.
3. Convert the target Instagram account to a Professional (Business/Creator)
   account and connect it to a Facebook Page.
4. Under Graph API Explorer, generate a long-lived User Access Token with the
   `instagram_basic`, `instagram_content_publish`, and `pages_show_list`
   permissions, then exchange it for a long-lived token
   (`GET /oauth/access_token?grant_type=fb_exchange_token`).
5. `IG_BUSINESS_ACCOUNT_ID` is your Instagram professional account's numeric
   ID, found via `GET /me/accounts` then `GET /{page-id}?fields=instagram_business_account`.

## 2. Pinterest API (`PINTEREST_ACCESS_TOKEN`)

1. Register an app at https://developers.pinterest.com/apps.
2. Complete OAuth with the `pins:write` and `boards:read` scopes.
3. Store the resulting access token.

## 3. X (Twitter) API v2 (`X_ACCESS_TOKEN`)

1. Apply for API access at https://developer.x.com.
2. Create a Project + App with OAuth 2.0 (User context), scopes `tweet.write`
   and `media.write`.
3. Store the user access token from the OAuth flow.

## 4. YouTube Data API v3 (`YOUTUBE_ACCESS_TOKEN`)

1. Create a project in Google Cloud Console, enable "YouTube Data API v3."
2. Create OAuth 2.0 credentials, complete the consent flow with the
   `https://www.googleapis.com/auth/youtube.upload` scope.
3. Store the resulting access token (refresh as needed - tokens expire).

## 5. Anthropic API (`ANTHROPIC_API_KEY`)

1. Create a key at https://console.anthropic.com/settings/keys.
2. Used by `lib/reviewGenerator.ts` and `lib/blogGenerator.ts`.

## 6. Google Doc access (Page 3)

No extra key needed - the blog generator reads a Google Doc's plain-text
export endpoint, which only works if the doc is shared as **"Anyone with the
link - Viewer."** For private docs, you'd need to add a Google OAuth flow
with the `drive.readonly` scope instead; that's out of scope for this build.

## Storing secrets securely

- Keep all values in `.env` at the project root; never hardcode them in code.
- Add `.env` to `.gitignore` (Next.js does this by default).
- In production, set these as environment variables in your hosting
  provider's dashboard (Vercel, Render, etc.) rather than shipping a `.env`
  file.
- Rotate tokens periodically, especially the long-lived Instagram token.
