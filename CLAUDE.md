# Jean Kwak Architects — Project Reference

Read this before writing any code.

## Stack
- Next.js 15 App Router, TypeScript, Tailwind CSS
- Sanity CMS (project ID: `cmh6jr2o`, dataset: `production`)
- No Swiper — custom React state sliders only

## Fonts
- `QuadrantText-Regular.woff2` → body text, weight 200, family name `QuadrantText`
- `QuadrantTextMono-Regular.woff2` → labels/counters, weight 400, family name `QuadrantMono`
- Both loaded via @font-face in `app/globals.css`
- No Inter, no system fonts

## Colours
- Background: `#F7F2E9` (all pages)
- Title slide background: `#E8D9C4`
- Text: `#141414`
- Secondary text / nav inactive: `#2B2B2B`
- Hover dimmed: `text-stone-300`

## Typography
- Body: QuadrantText, 18px, weight 200, line-height 1.28
- Labels/counters: QuadrantMono, 14px, weight 400, uppercase, line-height 1.18, letter-spacing 0.03em
- No bold, no heavy weights

## Layout Patterns
- All pages: fullscreen, no traditional nav bar — navigation lives within each page
- Project page: fullscreen slide experience (title slide → image slides → info slide)
- Homepage: fullscreen project slideshow (one project per slide)
- Navigate slides: left/right arrow keys + click left/right halves of screen
- Project index: list with hover thumbnail (image aligns to top of hovered row, fixed right), gap between items 14px
- Information page: fluid multi-column, stacks on mobile

## Sanity Schema
- `project` type has: `title`, `slug`, `description`, `images` (array with `asset`, `caption`, `orientation: landscape|portrait`), `location`, `year`, `builder`, `photography`, `landscape`, `styling`, `indexOrder`
- Landscape images: `object-cover`. Portrait images: `object-contain`
- Queries in `lib/sanity.ts`

## Deployment

Every time you change the Sanity schema, TWO deploys are required:

1. `git push` → Vercel rebuilds the website (automatic)
2. `npx sanity deploy` → updates the client's Sanity Studio at sanity.io

**Never skip step 2.** The client manages content through the hosted studio. If you change the schema without deploying, their studio will be out of sync — missing fields, outdated structure.

Run `npx sanity deploy` from the project root after any schema change.

## Key Rules
- Never use fixed pixel widths for layout — use percentages, flex, grid
- All layouts must be fluid from 320px to 1440px
- Handle null/missing Sanity fields gracefully — never crash on missing data
- No placeholder data — if a field is empty, don't render it
- Commit after each major change
