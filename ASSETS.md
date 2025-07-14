# Asset Organization Guide

## Directory Structure

### /assets/ - Development Assets
Raw, unoptimized assets for development and reference

#### /assets/images/logos/
- **wolthers-logo.svg** - Main company logo (vector format preferred)
- **wolthers-logo.png** - Logo in PNG format (high resolution)
- **wolthers-logo-white.svg** - White version for dark backgrounds
- **wolthers-logo-mark.svg** - Logo mark only (no text)
- **favicon-sources/** - Original favicon files in various sizes

#### /assets/images/icons/
- **car.svg** - Fleet management icon
- **building.svg** - Companies icon  
- **person.svg** - Users icon
- **gear.svg** - Settings icon
- **plus.svg** - Add/create icons
- **calendar.svg** - Calendar related icons
- **map.svg** - Location/map icons
- **email.svg** - Email/communication icons
- **file.svg** - File management icons

#### /assets/images/backgrounds/
- Hero images for landing pages
- Background patterns
- Travel-related imagery

#### /assets/images/examples/
- Screenshots of current system
- UI mockups and wireframes
- Trip itinerary examples
- Before/after comparisons

#### /assets/images/legacy/
- Images from your current system
- Original logos and branding
- Current UI screenshots

### /public/ - Production Assets
Optimized assets served directly by Next.js

#### /public/images/logos/
- Optimized versions of company logos
- Multiple formats (SVG, PNG, WebP)
- Various sizes for different use cases

#### /public/images/icons/
- Optimized UI icons
- Multiple formats and sizes
- Icon sprite sheets

#### /public/favicon/
- favicon.ico
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png
- android-chrome-192x192.png
- android-chrome-512x512.png
- site.webmanifest

### /legacy/assets/ - Current System Assets
- Original assets from your existing system
- Used for reference and migration

## Asset Naming Conventions

### Logos
- wolthers-logo.svg - Main logo
- wolthers-logo-white.svg - White version
- wolthers-logo-dark.svg - Dark version
- wolthers-mark.svg - Logo mark only

### Icons
- Use descriptive names: car-icon.svg, user-icon.svg
- Include size in name if multiple: car-icon-24.svg
- Use consistent naming: [name]-icon-[size].[format]

### Images
- Use descriptive names: hero-background.jpg
- Include dimensions if important: anner-1920x400.jpg
- Use hyphens for spaces: 	rip-example-screenshot.png

## Recommended Formats

### Logos
- **SVG** - Preferred for scalability
- **PNG** - High resolution with transparency
- **WebP** - For web optimization

### Icons
- **SVG** - Vector icons (preferred)
- **PNG** - Raster icons with transparency
- **ICO** - For favicons

### Photos/Screenshots
- **WebP** - Modern format, best compression
- **JPEG** - For photos without transparency
- **PNG** - For screenshots with transparency

## Image Optimization Guidelines

### Logo Requirements
- SVG format for main logo (scalable)
- PNG fallback at 2x resolution minimum
- White and dark versions for different backgrounds
- Transparent backgrounds where appropriate

### Icon Requirements
- 24x24, 32x32, 48x48 pixel sizes minimum
- SVG preferred for scalability
- Consistent style across all icons
- Proper contrast for accessibility

### Favicon Requirements
- 16x16, 32x32 ICO format
- 180x180 PNG for Apple touch icon
- 192x192, 512x512 PNG for Android
- Site manifest for PWA support

## Claude Code Instructions

When using Claude Code, reference assets like this:

`
For the Wolthers logo, use: /images/logos/wolthers-logo.svg
For navigation icons, use: /images/icons/[icon-name].svg
For UI components, reference: /images/ui/[component-image].png
`

## File Size Guidelines

### Logos
- SVG: Keep under 50KB
- PNG: Under 500KB for high-res versions

### Icons
- SVG: Keep under 10KB each
- PNG: Under 50KB each

### Background Images
- JPEG: Under 1MB, optimized for web
- WebP: Under 500KB

### Screenshots/Examples
- PNG: Under 2MB
- Compress for web use

## Next.js Integration

In your Next.js components, reference public assets:

`jsx
// Logo usage
<Image 
  src="/images/logos/wolthers-logo.svg" 
  alt="Wolthers & Associates"
  width={200}
  height={60}
/>

// Icon usage
<Image 
  src="/images/icons/car-icon.svg"
  alt="Fleet Management"
  width={24}
  height={24}
/>
`

## Asset Processing Pipeline

1. **Development**: Store raw assets in /assets/
2. **Optimization**: Process and optimize for web
3. **Production**: Place optimized assets in /public/
4. **Deployment**: Assets served directly by Next.js

## Version Control

### Include in Git:
- /assets/ - All source assets
- /public/ - Optimized production assets
- /legacy/assets/ - Reference assets

### Exclude from Git:
- Large raw image files (> 10MB)
- Temporary processing files
- Generated thumbnails (auto-generated)
