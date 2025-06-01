# Public Assets

This directory contains static files that will be served directly by the web server.

## Directory Structure

```
public/
├── favicon.ico    # Website favicon
├── robots.txt     # Search engine instructions
├── sitemap.xml    # Sitemap for search engines
├── images/        # Static images
├── videos/        # Local video files (if self-hosting)
└── assets/        # Other static assets (fonts, downloads, etc.)
```

## Usage Guidelines

1. **Favicon**
   - Should be in multiple sizes (16x16, 32x32, 192x192, 512x512)
   - Include both .ico and .png versions

2. **robots.txt**
   - Controls search engine crawling
   - Should be configured before launch

3. **sitemap.xml**
   - Helps with SEO
   - Should be generated dynamically in production

4. **Images**
   - Optimize all images before adding
   - Use appropriate formats:
     - JPG for photos
     - PNG for graphics with transparency
     - SVG for icons and logos
     - WebP for modern browsers

5. **Videos**
   - Consider using a CDN for better performance
   - Include multiple formats for compatibility:
     - MP4 (H.264)
     - WebM (VP9)
     - Ogg (Theora)

## Best Practices

- Keep file names lowercase with hyphens
- Optimize all assets for web
- Include proper alt text for images
- Use responsive images with srcset
- Set appropriate cache headers
- Consider using a CDN in production
