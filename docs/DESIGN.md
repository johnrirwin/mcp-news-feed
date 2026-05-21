---
name: Aether Forge
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#89ceff'
  on-tertiary: '#00344d'
  tertiary-container: '#009ada'
  on-tertiary-container: '#002d43'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 84px
    fontWeight: '900'
    lineHeight: 92px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 100px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style

The design system is engineered for a premium, high-octane "cockpit" experience. It targets drone enthusiasts and creators who value precision and technical sophistication. The aesthetic is anchored in **Glassmorphism**, utilizing deep translucent layers to create a sense of depth and focus. 

The emotional response is one of immersion and empowerment. By pairing heavy, editorial-style typography with technical, neon-accented UI elements, the system bridges the gap between high-end lifestyle branding and professional-grade engineering tools. The visual mood is dark, moody, and futuristic, emphasizing high-contrast "glow" states that guide the user's attention through complex data environments.

## Colors

This design system utilizes a "Deep Space" palette. The foundation is a midnight navy background, overlaid with translucent glass surfaces that use subtle alpha transparency to let background content bleed through.

- **Primary & Secondary:** A vibrant Electric Purple to Indigo gradient serves as the high-impact "action" color for primary buttons and active states.
- **Accents:** Neon Cyan is used sparingly for technical indicators and success states, providing a "HUD" (Heads-Up Display) feel.
- **Neutrals:** Slate and Zinc tones are used for text and secondary UI elements to maintain high legibility against the dark background.
- **Glass Surfaces:** Containers use a semi-transparent fill with a 20px to 40px background blur (backdrop-filter) and a 1px "inner glow" border to define edges.

## Typography

The typography strategy relies on the tension between "Heavy Display" and "Technical Utility."

- **Headlines:** Montserrat is used in its heaviest weights (900/Black) for marketing slogans. It should be set with tight letter-spacing and frequently italicized to imply speed and movement.
- **UI & Body:** Inter provides a clean, neutral balance for high-density information, ensuring the cockpit doesn't feel cluttered.
- **Technical Labels:** JetBrains Mono is used for small metadata, button labels, and status indicators to reinforce the engineering/technical narrative of the product.

## Layout & Spacing

The layout follows a **Fluid Grid** model with significant negative space to maintain a premium feel.

- **The Sidebar:** A fixed, minimalist navigation rail (100px) sits on the left, using a glassmorphic blur to separate it from the main content.
- **Safe Zones:** High-level landing sections utilize large vertical gaps (120px+) to allow the eye to rest and to highlight hero imagery.
- **Grid:** A 12-column grid is used for content sections, with cards usually spanning 4 columns on desktop and 12 columns on mobile.
- **Margins:** Generous side margins (64px) ensure content feels centered and cinematic on wide displays.

## Elevation & Depth

Depth is not communicated through traditional drop shadows, but through **Tonal Stacking and Backdrop Blurs**.

1.  **Level 0 (Floor):** The base dark background.
2.  **Level 1 (Surface):** Translucent glass containers (15% white or navy opacity) with `backdrop-filter: blur(24px)`.
3.  **Level 2 (Active):** Hovered cards or active modals. These use a subtle "Outer Glow" effect where the primary accent color (#6366F1) bleeds from behind the container at 10-20% opacity.
4.  **Interaction:** Elements should feel tactile. Hovering over a glass card should increase the border brightness and the intensity of the background blur.

## Shapes

The design system uses a "Rounded" language to soften the technical edge. 
- **Standard UI elements** (Buttons, Inputs) use a 0.5rem (8px) radius.
- **Large containers** (Cards, Feature Blocks) use 1rem (16px) or 1.5rem (24px) to create a friendly, modern "app" feel within the dark environment.
- **Pill shapes** are reserved for secondary tags and badges to differentiate them from actionable buttons.

## Components

### Buttons
- **Primary:** Gradient fill (Electric Purple to Indigo). On hover, add a 15px soft glow of the same color. Text is white, bold, and uppercase.
- **Secondary:** Transparent with a 1px solid border (White @ 20%). On hover, fill with white at 10% opacity.

### Glass Cards
Feature cards are the core of the UI. They must have:
- `background: rgba(255, 255, 255, 0.05)`
- `border: 1px solid rgba(255, 255, 255, 0.1)`
- `backdrop-filter: blur(20px)`
- On hover, the border transitions to the primary gradient and a subtle bottom glow appears.

### Sidebar Navigation
The sidebar is a vertical rail. Icons are "Ghost" style (outline only) when inactive, turning into "Solid" icons with a vertical accent bar on the left when active.

### Inputs & HUD Elements
Form fields should be dark and recessed. Use `JetBrains Mono` for placeholder text to maintain the technical aesthetic. Success/Error states should use neon Cyan and neon Red respectively, utilizing small "Glow" points rather than large block colors.
