# Escrow Frontend

Next.js frontend for the Soroban milestone escrow smart contract on Stellar.

## Live Contract

| Network | Contract ID |
|---|---|
| Testnet | `CDD5WKK3WT3QVKXMXTJNDIXE4T73FK6GGXDSD6UTJAH6YYZU52SQ4MUH` |

## Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- Stellar SDK
- Freighter Wallet

## Pages

- `/` — Landing page
- `/create` — Create a new escrow job with milestones
- `/dashboard` — View job status and interact with milestones
- `/admin` — Manage whitelisted tokens (admin only)

## Setup

```bash
npm install
cp .env.local.example .env.local  # add your contract ID
npm run dev
```

## Environment Variables

NEXT_PUBLIC_CONTRACT_ID=CDD5WKK3WT3QVKXMXTJNDIXE4T73FK6GGXDSD6UTJAH6YYZU52SQ4MUH

## Backend URL (NEXT_PUBLIC_BACKEND_URL)

The site is served over HTTPS. A remote `http://` backend URL is mixed content and is rejected at Docker build time with:

`ERROR: NEXT_PUBLIC_BACKEND_URL must start with https:// (got "<value>"). Use https://, a localhost URL for local dev, or leave it empty to use same-origin /api.`

Accepted values:

- Empty / unset (recommended in production): same-origin relative `/api` paths; nginx proxies `/api`
- `https://...`
- Loopback for local dev: `http://localhost`, `http://127.0.0.1`, `http://[::1]` (optional port and path)

```bash
# Production (recommended): empty - same-origin /api
docker build -t escrow-frontend \
  --build-arg NEXT_PUBLIC_CONTRACT_ID=CDD5WKK3WT3QVKXMXTJNDIXE4T73FK6GGXDSD6UTJAH6YYZU52SQ4MUH \
  .

# HTTPS backend
docker build -t escrow-frontend \
  --build-arg NEXT_PUBLIC_BACKEND_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_CONTRACT_ID=CDD5WKK3WT3QVKXMXTJNDIXE4T73FK6GGXDSD6UTJAH6YYZU52SQ4MUH \
  .

# Local loopback
docker build -t escrow-frontend \
  --build-arg NEXT_PUBLIC_BACKEND_URL=http://localhost:3001 \
  --build-arg NEXT_PUBLIC_CONTRACT_ID=CDD5WKK3WT3QVKXMXTJNDIXE4T73FK6GGXDSD6UTJAH6YYZU52SQ4MUH \
  .

# Rejected: plain HTTP remote (fails the build)
docker build -t escrow-frontend \
  --build-arg NEXT_PUBLIC_BACKEND_URL=http://example.com \
  --build-arg NEXT_PUBLIC_CONTRACT_ID=CDD5WKK3WT3QVKXMXTJNDIXE4T73FK6GGXDSD6UTJAH6YYZU52SQ4MUH \
  .
```


## Related Repos

- `https://github.com/Goldii-locks/escrow-contract`  — Soroban smart contract
- Update README with latest progress


Design tokens integration for dark mode switcher.
