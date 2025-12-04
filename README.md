# renhale.com

Personal website of Ren Hale, built with [Eleventy](https://www.11ty.dev/) and following IndieWeb principles.

## Development

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run serve
```

Build for production:
```bash
npm run build
```

## Structure

- `_layouts/` - Page templates
- `_includes/` - Reusable partials (header, footer)
- `_data/` - Site data and configuration
- `houseofren/articles/` - Article content (Markdown)
- `houseofren/notes/` - Notes/micro-posts (Markdown)
- `assets/` - Static assets (CSS, images, JS)

## Content

Content is written in Markdown with front matter. Articles and notes are automatically collected and sorted by date.

## IndieWeb Features

- Semantic HTML with microformats (h-entry, h-card)
- RSS feed at `/feed.xml`
- Static HTML, minimal JavaScript
- Webmention support
