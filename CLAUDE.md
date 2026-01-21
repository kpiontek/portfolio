# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - Start local development server
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally

## Deployment

This site deploys to Cloudflare Pages. The wrangler.jsonc configures:
- Assets directory: `./dist`
- Framework: Vite

Deploy by pushing to the main branch or using the Cloudflare Pages dashboard.

## Architecture

This is a React + Vite single-page application for a personal portfolio.

**Single Component Pattern:** The entire UI lives in `src/Portfolio.jsx` - a monolithic component containing all sections (Navigation, Hero, About, Work, Contact, Footer), styling, and data. This is intentional for a small portfolio site.

**Styling Approach:** All CSS is inline using React style objects. Keyframe animations are defined in a `<style>` tag within the component. No external CSS files or UI libraries.

**Data:** Skills and projects are defined as static arrays within Portfolio.jsx and rendered via `.map()`.

**Entry Point:** `src/main.jsx` bootstraps the React app into `index.html`.
