# ELEV8 Renewable Energy — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | `^19.0.0` | UI framework |
| `react-dom` | `^19.0.0` | DOM renderer |
| `gsap` | `^3.12.7` | Animation engine (includes ScrollTrigger, ScrollSmoother plugins) |
| `lucide-react` | `^0.468.0` | Icon library (Sun, Wind, Battery, Zap, Leaf, CheckCircle, Menu, Linkedin, Twitter, Instagram) |
| `tailwindcss` | `^4.0.0` | Utility-first CSS |
| `@tailwindcss/vite` | `^4.0.0` | Tailwind Vite integration |
| `typescript` | `^5.7.0` | Type safety |
| `vite` | `^6.0.0` | Build tool |
| `@vitejs/plugin-react` | `^4.0.0` | React Vite plugin |
| `@types/react` | `^19.0.0` | React type definitions |
| `@types/react-dom` | `^19.0.0` | ReactDOM type definitions |

**Fonts**: Inter and JetBrains Mono loaded via Google Fonts `<link>` in `index.html` (no npm package).

**No Three.js**: Per design.md performance notes, all visual effects use SVG, Canvas 2D, and CSS. No WebGL needed.

---

## Component Inventory

### Layout Components

| Component | Source | Reuse | Notes |
|-----------|--------|-------|-------|
| **Navigation** | Custom | Shared | Fixed top bar. Transparent → blurred background on scroll. Mobile: hamburger → fullscreen overlay. Compact countdown appears after 100vh. |
| **Footer** | Custom | Shared | Minimal centered copyright text. |

### Section Components

| Component | Source | Notes |
|-----------|--------|-------|
| **HeroSection** | Custom | Fullscreen. Contains StarburstSVG (monumental), title, subtitle, CTA. Hosts ambient particle canvas and vignette overlay. |
| **CountdownSection** | Custom | Fullscreen. Live countdown timer, eyebrow label, subtitle. Drifting laser lines background. |
| **SolarVisionSection** | Custom | 55/45 split. Left: solar farm image. Right: text + stats. |
| **WindInfrastructureSection** | Custom | 45/55 split (reversed). Left: text + feature list. Right: wind turbine image. |
| **EcosystemSection** | Custom | Centered layout. Compact StarburstSVG + eyebrow + title + body + 3 info cards. |
| **EmailSignupSection** | Custom | Fullscreen centered. Email form with success state, social links, background glow. |

### Reusable Components

| Component | Source | Used By | Notes |
|-----------|--------|---------|-------|
| **StarburstSVG** | Custom | HeroSection, EcosystemSection | Standalone SVG animation engine. Two size modes (monumental/compact), two intensity modes (full/subtle). CSS @keyframes for all continuous animations; GSAP for entrance only. |
| **AmbientParticles** | Custom | HeroSection, EcosystemSection | Canvas 2D particle system. Lightweight rAF loop. Section-aware particle count via IntersectionObserver. |
| **CountdownTimer** | Custom | CountdownSection, Navigation | Live countdown to 2026-12-31T00:00:00. Mono font display. "WE'RE LIVE" at zero. |
| **InfoCard** | Custom | EcosystemSection (×3) | Glassmorphism card: Glass Surface fill + backdrop-filter blur + Glass Edge border + Glass sheen gradient. |
| **EyebrowLabel** | Custom | All sections | Uppercase caption with wide letter-spacing, Ash color. |

### Hooks

| Hook | Purpose |
|------|---------|
| **useScrollReveal** | IntersectionObserver-based scroll trigger. Applies fade+translateY entrance animation via GSAP. Handles `once: true` (does not reverse). Supports stagger for child elements. Used by all sections. |
| **useCountdown** | Returns days/hours/minutes/seconds from now until target date. 1-second interval. Returns "WE'RE LIVE" object when countdown reaches zero. |

---

## Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| **Starburst entrance (4-phase)** | GSAP timeline | Single timeline: coreOrb scale→0→1, spokes stagger scaleY+opacity, outerRays stagger opacity, then CSS class toggle to start continuous loops | High |
| **Starburst continuous: slowSpin** | CSS @keyframes | `transform: rotate(360deg)` on `<g>` containers, 180s linear infinite. Subtle mode: 360s. | Low |
| **Starburst continuous: spokePulse** | CSS @keyframes | `opacity` + `scaleY` pulse, 2.5s ease-in-out infinite. Staggered via `animation-delay` (N × 0.15s). | Medium |
| **Starburst continuous: outerRayPulse** | CSS @keyframes | `opacity` pulse, 2s ease-in-out infinite. Staggered (N × 0.2s). Counter-rotation on container. | Medium |
| **Starburst continuous: corePulse** | CSS @keyframes | `scale(1→1.15→1)` + `opacity` pulse, 4s ease-in-out infinite. | Low |
| **Starburst continuous: ringPulse** | CSS @keyframes | `opacity` pulse on ring1 (3s) and ring2 (3s, 1.5s offset). | Low |
| **Ambient particles drift** | Canvas 2D + rAF | Custom loop: update position (vx, vy), wrap at boundaries, draw 2px circles. Max 30 particles. IO-managed activation. | Medium |
| **Scroll-triggered reveals (global)** | GSAP + ScrollTrigger | `useScrollReveal` hook: IO at threshold 0.15 triggers GSAP.fromTo opacity+translateY. Stagger children. `once: true`. | Medium |
| **Split-section parallax** | GSAP ScrollSmoother | `data-speed="0.9"` on images, `data-speed="1.1"` on text. Creates natural depth separation on scroll. | Low |
| **Countdown live update** | React state + setInterval | `useCountdown` hook: `setInterval(1000)` updates state. Formatted display with Mono font. | Low |
| **Nav background transition** | CSS transition | Scroll listener (or ScrollTrigger) toggles class. `background` + `backdrop-filter` transition 0.4s. | Low |
| **Mobile menu overlay** | GSAP | Hamburger click triggers fullscreen overlay fade-in + link stagger (0.3s each). | Medium |
| **Section 2 laser lines drift** | CSS @keyframes | 3 horizontal `1px` divs, `translateX` drift 60s linear infinite. Opacity 0.06. | Low |
| **Stat number count-up** | GSAP | `gsap.to` with `snap` plugin or manual tween on scroll-triggered visibility. 0→final over 1.5s. | Medium |
| **Email form success transition** | GSAP | Form fade-out (0.3s), success content fade-in (0.5s). Timeline with `aria-live` announcement. | Low |
| **Hero scroll fade** | GSAP ScrollTrigger | Starburst scales to 0.8 + fades on scroll. Not pinned — natural scroll continues. | Low |
| **Info card glass sheen** | CSS gradient | Static `linear-gradient(135deg, ...)` overlay on each card. No animation. | Low |
| **Section 6 background glow** | CSS | Single `600px` radial gradient div, `filter: blur(100px)`, opacity 0.06. Static. | Low |

---

## State & Logic Plan

### Countdown State
- **Target**: `2026-12-31T00:00:00` (hardcoded constant)
- **Hook**: `useCountdown` manages `setInterval`, cleanup on unmount, returns `{days, hours, minutes, seconds, isLive}`
- **Consumers**: CountdownSection (large display), Navigation (compact readout, appears after 100vh scroll)

### Navigation Scroll State
- **Detection**: ScrollTrigger or scroll event listener at 100vh threshold
- **State**: `isScrolled` boolean
- **Effects**: (1) Toggle nav background transparent→blur, (2) Show/hide compact countdown in nav

### Email Form State
- **States**: `idle` → `submitting` → `success`
- **Transition**: On submit (mock, no backend), GSAP timeline: form fade-out → success content fade-in
- **Accessibility**: `aria-live="polite"` region for success announcement

### Particle System Section Awareness
- **Detection**: IntersectionObserver on HeroSection and EcosystemSection
- **State**: `activeSection: 'hero' | 'ecosystem' | null`
- **Effects**: Controls particle count (20 vs 10) and opacity (0.15 vs 0.08). Canvas loop exits early when `null`.

### Starburst CSS Animation Toggle
- **Mechanism**: GSAP entrance timeline `.add()` callback adds CSS class that enables `animation-play-state: running` (default is `paused`)
- **Why**: Prevents continuous loops from running before entrance completes

---

## Other Key Decisions

### No Three.js / No WebGL
Per design.md performance direction, all effects are SVG, Canvas 2D, or CSS. This avoids a ~150KB dependency and WebGL context overhead. The ambient particles are simple 2D circles — Canvas 2D is more appropriate than Three.js.

### GSAP ScrollSmoother Over Lenis
Design.md specifies ScrollSmoother with `data-speed` and `data-lag` attributes for parallax. ScrollSmoother's `effects: true` handles parallax offsets without manual ScrollTrigger configuration per element. This is more declarative than Lenis + manual ScrollTrigger setup.

### GSAP Plugin Registration
ScrollTrigger and ScrollSmoother are GSAP Club plugins (free as of 2025). Register at app entry point:
```ts
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
```

### Canvas 2D Particle System Over CSS
Ambient particles require continuous random drift with wrap-around behavior. CSS animations cannot easily handle per-particle random velocities and boundary wrapping. Canvas 2D with rAF provides full control in ~30 lines of code.

### Image Strategy
Two photographic images (solar farm, wind turbines) generated as static assets. Consistent post-processing (contrast ↑, saturation ↓, cool tint, grain overlay, crushed blacks) applied at generation time or via CSS `filter` stack. WebP format preferred.

### Tailwind v4 Configuration
All design tokens (colors, typography, spacing) defined as CSS custom properties in `:root` and mapped to Tailwind theme via `@theme` directive in `index.css`. No separate `tailwind.config.js` needed in v4.
