# 🔗 URL Shortener

A URL shortener built as a system design project, designed to avoid collisions and handle read-heavy traffic.

## Features
- **Base62 short codes** generated from an atomic MongoDB counter (no collisions, even under concurrent requests)
- **Redis caching** on the redirect path to cut database reads
- **Rate limiting**: 10 URL creations per minute per IP
- **URL validation**: only http/https links accepted

## Tech Stack
Node.js · Express · MongoDB (Mongoose) · Redis

## API
- `POST /short` with body `{ "url": "https://..." }` returns the short link
- `GET /:code` redirects to the original URL