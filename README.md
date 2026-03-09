# TonyOS

Windows 95-inspired personal portfolio built with React, Vite, Tailwind, Framer Motion, and Zustand.

Live site: [https://tonyos.vercel.app/](https://tonyos.vercel.app/)

## Overview

TonyOS presents portfolio content as a retro desktop operating system:

- draggable desktop icons
- Win95-style window manager and taskbar
- file explorer metaphor for projects and content
- terminal app with portfolio-aware commands
- public Spotify playlist explorer rendered like folders and files

The app is intentionally nostalgic in presentation, but the implementation is modern React.

## Features

- Windows 95 desktop shell with boot sequence
- draggable desktop icons
- resizable, focusable, minimizable, maximizable windows
- taskbar with per-window tabs and icons
- terminal app backed by a custom command parser
- markdown/text/project viewers
- recruiter-friendly traditional portfolio view
- Spotify playlist explorer with cached public playlist data

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand

## Project Structure

```text
src/
  components/
    desktop/      Desktop shell and boot flow
    windows/      Window frame and chrome
    taskbar/      Taskbar and clock
    terminal/     Terminal app
    explorer/     Filesystem explorer
    spotify/      Win95 Spotify playlist explorer UI
    apps/         Portfolio app windows
  data/           Portfolio content and mock filesystem
  store/          Zustand state stores
  types/          Shared TypeScript types
  utils/          Window, terminal, and filesystem helpers
public/
  spotify-playlists.json   Cached Spotify playlist snapshot served to visitors
scripts/
  sync-spotify-playlists.mjs   Exports public playlist snapshot using your user token
```

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Spotify Playlist Explorer

Visitors do not authenticate with Spotify.

Instead, the site reads from a cached snapshot file:

- [public/spotify-playlists.json](/Users/kazuhidelee/Desktop/tonyOS/public/spotify-playlists.json)

That snapshot is generated from your Spotify account by running:

```bash
npm run sync:spotify
```

The sync script:

- fetches your own playlists via your user token
- filters to your public playlists
- fetches playlist tracks
- writes a static JSON snapshot for the frontend

This avoids depending on brittle public Spotify Web API access for anonymous visitors.

## Environment Variables

Create a `.env` file in the repo root.

Required:

```env
SPOTIFY_CLIENT_ID=your_spotify_app_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_app_client_secret
SPOTIFY_USER_ID=your_spotify_user_id
SPOTIFY_REFRESH_TOKEN=your_spotify_user_refresh_token
```

Optional for one-off syncs:

```env
SPOTIFY_ACCESS_TOKEN=temporary_user_access_token
```

Reference template:

- [.env.example](/Users/kazuhidelee/Desktop/tonyOS/.env.example)

## Updating Spotify Data

When your playlists change:

1. refresh the snapshot

```bash
npm run sync:spotify
```

2. redeploy

```bash
vercel deploy --prod --yes
```

## Deployment

This repo is linked to Vercel.

Deploy the current state:

```bash
vercel deploy --prod --yes
```

Current deployment flow:

1. update code or content
2. run `npm run sync:spotify` if playlist data changed
3. run `npm run build` if you want a local verification step
4. deploy with Vercel

## Notes

- `SPOTIFY_ACCESS_TOKEN` is short-lived and should not be relied on long term.
- `SPOTIFY_REFRESH_TOKEN` is the durable value used to generate fresh access tokens for the sync script.
- The frontend never exposes `SPOTIFY_CLIENT_SECRET`.
- Browser visitors only consume static playlist JSON.
