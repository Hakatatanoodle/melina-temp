# PetCare Management System Design

## 1. Design Purpose

This document defines the visual and interaction language for PetCare Management System.

The product is a small pet-care management application for pet owners. It is intentionally simple in scope, but it should feel like a coherent consumer product rather than a collection of college-assignment screens.

The design should make the technical requirements almost invisible. Users should experience a warm, trustworthy pet-care product. The underlying authentication, CRUD operations, APIs, and JSON persistence should only reveal themselves when someone inspects or demonstrates the system.

### Core design principle

> **Build a pet-care product first. Let the technical requirements hide underneath it.**

A second principle governs the visual system:

> **Warmth without childishness. Personality without noise. Polish without pretending to be a giant startup.**

---

# 2. Design North Star

## One sentence

**PetCare should feel like a calm, modern companion app that gives the user's pets the visual spotlight and makes everyday care information feel easy to keep track of.**

## Five keywords

**Warm · Calm · Personal · Trustworthy · Refined**

## Five things to avoid

1. Generic SaaS gradients and startup-template aesthetics
2. Childish pet graphics and excessive paw-print decoration
3. Enterprise/admin-dashboard visual language
4. Card-heavy interfaces where every piece of information becomes a rounded box
5. Decorative animation that competes with the product's information

---

# 3. Product Personality

PetCare is not trying to be a veterinary hospital platform, a pet shop, or an enterprise health-management system.

It is a **personal pet companion**.

The product should feel closer to a thoughtful wellness or lifestyle application than to an administrative system.

### Emotional qualities

The interface should communicate:

- **Care:** information about a pet should feel personal rather than bureaucratic.
- **Trust:** health-related information needs clarity and visual restraint.
- **Warmth:** the product should feel alive and friendly.
- **Calm:** the interface should not overwhelm the user with dashboards, dense tables, or constant alerts.
- **Personality:** pets should give the product a reason to have character.

### What it should not feel like

It should not feel:

- overly cute
- clinical
- corporate
- childish
- sterile
- overengineered
- artificially futuristic

---

# 4. Chosen Visual Direction

## Direction: Warm Editorial Companion

The chosen direction combines **editorial warmth, modern consumer-product simplicity, and subtle wellness cues**.

The visual language should feel like a well-designed lifestyle product that happens to organize pet information.

The primary visual anchor is **real pet imagery**, supported by restrained UI and typography rather than decorative graphics.

### Why this direction

A purely playful pet aesthetic risks making the application look childish.

A purely healthcare-oriented aesthetic risks making it feel clinical.

A generic modern SaaS aesthetic risks making it look indistinguishable from thousands of AI-generated dashboards.

The editorial-companion direction sits in the useful middle:

**human enough to feel personal, structured enough to feel trustworthy, and distinctive enough to feel designed.**

---

# 5. Color System

The palette should use warm neutrals as the foundation and a restrained botanical accent as the product's identity color.

## Primary palette

### Warm Ivory

`#F7F4EE`

Primary page background.

Purpose: gives the product warmth and avoids the coldness of pure white.

### Deep Ink

`#232521`

Primary text and high-contrast UI.

Purpose: softer and more sophisticated than pure black.

### Moss

`#6F8467`

Primary brand/action accent.

Purpose: communicates care, nature, health, and calm without becoming a stereotypical green healthcare interface.

### Moss Dark

`#55664F`

Hover/active variant of the primary accent.

### Clay

`#B87859`

Secondary warm accent.

Purpose: adds human warmth and prevents the palette from becoming an all-green wellness interface.

### Sand

`#E8DFD1`

Secondary surface/border tone.

Purpose: creates subtle separation without heavy shadows.

### White

`#FFFFFF`

Used selectively for elevated surfaces and form fields.

---

## Semantic colors

### Success

Use a muted natural green, distinct enough from the main Moss to communicate confirmation.

### Warning

Use a warm amber rather than bright yellow.

### Error

Use a muted red/terracotta rather than aggressive neon red.

Semantic colors should be visible when necessary but should not hijack the product's warm visual identity.

---

# 6. Typography

## Primary typeface

**Manrope**

Use for the main interface.

Why:

- modern without feeling futuristic
- highly readable
- slightly more human than many geometric sans-serifs
- strong at both large headings and dense UI
- available through common web font sources

## Optional display typeface

**DM Serif Display** may be used sparingly for major editorial moments, especially the landing-page hero or a short brand statement.

It should not be used throughout the application.

The combination creates a useful contrast:

**serif for emotional moments, sans-serif for everything people need to operate.**

If the serif starts making the application feel like a magazine rather than a product, remove it.

---

# 7. Typography Hierarchy

## Landing-page hero

Large, confident, but not oversized.

Suggested treatment:

- short headline
- 1–2 lines maximum
- strong contrast
- generous whitespace

## Dashboard greeting

Large enough to establish personality, but smaller than the landing-page headline.

Example:

> Good morning, Alex.

The greeting should feel human, not like a dashboard title.

## Pet names

Pet names are high-priority UI content and should have stronger visual emphasis than metadata.

Example:

**Bruno**

Dog · Golden Retriever

## Supporting information

Use smaller, calmer typography for:

- breed
- age
- weight
- health metadata
- dates

## Numbers / statistics

Statistics should use medium-to-bold weight with enough breathing room around them.

Avoid making statistics look like financial analytics.

---

# 8. Shape Language

The interface should use **soft geometry with restraint**.

## Corner radius

Primary cards: approximately 18–24px.

Buttons and inputs: approximately 12–14px.

Small badges: pill-shaped only when the content naturally behaves like a tag or status.

The system should not turn every component into a pill.

## Borders

Prefer subtle warm-gray borders over dark outlines.

Use borders primarily to define structure, not as decoration.

## Shadows

Use shadows sparingly.

Preferred approach:

- extremely soft
- low contrast
- large blur
- used only when a surface needs elevation

The product should rely more on **space, contrast, and surface color** than on heavy shadows.

---

# 9. Surfaces

Avoid nested panels wherever possible.

Instead of:

```text
page
  -> card
      -> card
          -> card
```

prefer:

```text
page
  -> section
      -> meaningful components
```

The interface should feel spacious because the content hierarchy is good, not because everything has a box around it.

### Surface hierarchy

1. Page background
2. Elevated surface
3. Featured surface
4. Small interactive surface

The difference between levels should usually come from background tone, border, and spacing before shadow.

---

# 10. Photography Direction

Photography should be the primary visual language for pets.

## Image characteristics

Prefer images with:

- natural light
- quiet or softly textured backgrounds
- clear subject separation
- authentic expressions
- slightly editorial framing
- room for UI overlays when needed

Avoid:

- obvious stock-photo staging
- excessive studio lighting
- cliché pet-calendar poses
- hyper-saturated backgrounds
- cartoon filters

### Hero photography

The landing-page hero may use one strong, emotionally engaging pet photograph rather than a busy collage.

The image should feel like a companion is present, not like a pet-food advertisement.

### Dashboard photography

Pet cards should use consistent image treatment.

Recommended image ratio: roughly 4:3 or 1:1 depending on the final card composition.

Keep the image visually dominant but not so large that metadata becomes secondary.

---

# 11. Iconography

Use a clean, minimal icon set.

Icons should be:

- line-based or lightly filled
- simple
- consistent in stroke weight
- visually subordinate to text

Icons may represent:

- pets
- health
- calendar/events
- profile
- navigation
- add/edit/delete actions

Do not use decorative pet icons everywhere.

A pet does not need a paw print next to every sentence to prove it is a pet product.

---

# 12. Brand Mark and Logo Direction

The product name **PetCare** should have a restrained wordmark.

If an icon is used, it should be abstract or integrated into the typography.

Avoid the obvious:

- paw inside heart
- dog + cat silhouette
- giant paw print
- generic veterinary cross

The identity should still work if the logo icon is removed.

The wordmark should carry most of the brand recognition.

---

# 13. Landing Page Design

The landing page should have a simple narrative:

```text
What is PetCare?
        ↓
Why would I use it?
        ↓
What does it look like?
        ↓
How do I start?
```

## Hero

Primary message:

**Better care. Happier pets.**

Supporting message:

**Keep your pets, health records, and everyday care information organized in one place.**

Primary CTA:

**Get Started**

Secondary CTA:

**Log In**

### Hero composition

Recommended structure:

```text
┌────────────────────────────────────────────────────────────┐
│ PetCare                         Log In   Get Started       │
│                                                            │
│                                                            │
│ Better care.                      Large pet photograph     │
│ Happier pets.                     or product visual        │
│                                                            │
│ Keep your pets...                                         │
│                                                            │
│ [ Get Started ]  [ Log In ]                               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

The hero should be asymmetric rather than a centered marketing template.

## Supporting sections

Keep the landing page relatively short.

Suggested sequence:

1. Hero
2. Simple explanation of how PetCare works
3. Product/dashboard preview
4. A short section highlighting pet and health management
5. Final CTA

Do not create ten marketing sections for a college project.

The landing page should behave like a product introduction, not a startup investor pitch.

---

# 14. Login / Registration Design

Authentication should feel like entering the product rather than leaving it for a generic form page.

## Preferred composition

Use a split or asymmetric layout on desktop:

```text
┌──────────────────────┬──────────────────────────────┐
│                      │                              │
│  Warm pet image /    │       Login form            │
│  brand message       │                              │
│                      │       Email                  │
│  Small editorial     │       Password               │
│  visual treatment    │                              │
│                      │       [ Log In ]              │
│                      │                              │
└──────────────────────┴──────────────────────────────┘
```

On smaller screens the layout becomes a simple single-column form.

## Login content

Keep the form focused.

Recommended hierarchy:

- PetCare mark
- heading
- short supporting line
- email
- password
- primary action
- register link

## Registration

Use the same visual system.

Do not introduce a completely different composition just because it is registration.

The login/register relationship should feel like one system.

---

# 15. Dashboard Design

The dashboard is the most important screen in the application.

Its purpose is not to demonstrate CRUD.

Its purpose is to answer:

> **How are my pets doing, and what can I do next?**

## Overall composition

Recommended structure:

```text
┌───────────────────────────────────────────────────────────────┐
│ PetCare            Dashboard   My Pets   Health   Profile     │
│                                                               │
│ Good morning, Alex.                              + Add Pet    │
│ Here is your pet care at a glance.                           │
│                                                               │
│  2 Pets          5 Health Records          1 Upcoming Event  │
│                                                               │
│ My Pets                                                       │
│                                                               │
│ ┌──────────────────┐   ┌──────────────────┐                  │
│ │    PET IMAGE     │   │    PET IMAGE     │                  │
│ │                  │   │                  │                  │
│ │ Bruno            │   │ Luna             │                  │
│ │ Dog · Golden     │   │ Cat · Persian    │                  │
│ │ Retriever        │   │ Age 2 years      │                  │
│ └──────────────────┘   └──────────────────┘                  │
│                                                               │
│ Upcoming care / recent health activity                       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

This is a structural direction, not a rigid final wireframe.

---

# 16. Dashboard Navigation

Desktop navigation should remain lightweight.

Recommended primary destinations:

- Dashboard
- My Pets
- Health Records
- Profile

Logout should be clearly available but visually secondary.

Avoid a large enterprise sidebar unless the actual screen complexity later demands it.

A compact sidebar or top navigation is preferred.

---

# 17. Dashboard Summary Information

The dashboard may show:

### Pets

Total number of pets.

### Health Records

Total health records across the user's pets.

### Upcoming Event

A vaccination, appointment, or other care event when available.

These should not necessarily appear as three identical cards.

A strong alternative is a mixed composition where one important upcoming-care item receives more visual emphasis and the numerical information remains quieter.

The design should prioritize **useful hierarchy over symmetry**.

---

# 18. Pet Card System

Pet cards are the emotional center of the dashboard.

The selected direction is a **photography-led card with editorial metadata**.

## Structure

```text
┌────────────────────────────────────┐
│                                    │
│            PET IMAGE               │
│                                    │
├────────────────────────────────────┤
│ Bruno                              │
│ Golden Retriever · Dog             │
│                                    │
│ 3 years            28 kg           │
│                                    │
│ Next care: Rabies · Oct 12         │
│                                    │
│ View profile                 ···   │
└────────────────────────────────────┘
```

The exact layout may evolve during implementation, but these priorities should remain:

1. Pet image
2. Pet name
3. Species / breed
4. Useful current information
5. Clear next action

## Pet card actions

Primary interaction:

**View Profile**

Secondary actions:

Edit and Delete may live in an overflow menu rather than occupying equal visual weight.

This prevents the card from visually reading like a CRUD demo.

---

# 19. Pet Card Variants

Three concepts were considered conceptually:

### Concept A: Editorial Portrait

Large image, strong pet name, restrained metadata, minimal controls.

**Best for:** warmth and visual personality.

### Concept B: Information-first Card

Smaller image, denser metadata, visible actions.

**Best for:** utility but more likely to feel like an admin interface.

### Concept C: Soft Companion Card

Large image plus status/care indicator and playful micro-details.

**Best for:** personality, but higher risk of becoming childish.

## Selected concept

**Concept A: Editorial Portrait**

It best matches the product's emotional direction while leaving room for practical information.

Utility can live inside the pet detail page, while the dashboard card remains calm and readable.

---

# 20. Pet Detail Page

The pet detail screen can become more information-dense than the dashboard.

Recommended structure:

```text
← Back to My Pets

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  PET IMAGE        Bruno                                     │
│                   Golden Retriever · 3 years                │
│                   28 kg · Male                              │
│                                                             │
│                   [ Edit Pet ]                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Health & Care
─────────────────────────────────────────────────────────────

Vaccinations
Recent checkups
Medications
Notes

[ + Add Health Record ]
```

The details page is where CRUD operations can become more visible without damaging the dashboard's personality.

---

# 21. Health Record Design

Health records should feel structured but not clinical.

Use clear labels for:

- type
- title
- date
- description
- veterinarian/clinic when available

A timeline-style presentation is preferred over a dense table.

Example:

```text
2026
│
├── Oct 12
│   Rabies Vaccination
│   Green Valley Clinic
│
├── Aug 20
│   General Checkup
│   Healthy
│
└── Jul 05
    Medication
    Completed
```

This makes the health module feel like a useful pet-care record rather than a database screen.

---

# 22. Empty States

Empty states should be warm and useful.

### No pets

Example direction:

> **Your pet family is looking a little empty.**
> Add your first companion to get started.

CTA:

**Add Your First Pet**

Avoid excessive illustrations.

One subtle visual detail is enough.

### No health records

Example direction:

> **Nothing recorded yet.**
> Keep important care information here so it is easy to find later.

---

# 23. Forms

Forms should be simple and calm.

Inputs should use:

- warm white surfaces
- subtle borders
- clear labels
- clear focus states
- generous vertical spacing

Do not rely on placeholder text as the only field label.

Forms should feel like part of the product, not browser defaults.

---

# 24. Buttons

## Primary

Moss background with light text.

Shape: soft rectangular, not oversized pill.

## Secondary

Warm neutral surface or outlined treatment.

## Destructive

Muted red/terracotta.

Destructive actions should require confirmation when appropriate.

Buttons should have obvious hover/pressed states but no excessive motion.

---

# 25. Motion

Motion should be subtle and useful.

Recommended:

- 150–250ms UI transitions
- gentle card lift on hover
- opacity/position transitions for page entry
- subtle modal transitions
- small success feedback after actions

Avoid:

- cinematic page transitions
- constant floating effects
- parallax everywhere
- decorative bouncing elements
- animated backgrounds

The user should feel the interface responding, not performing.

---

# 26. Responsive Design

The product must work well on desktop and mobile.

## Desktop

Use wide layouts with generous negative space.

Pet cards can form a 2–4 column grid depending on viewport width.

## Tablet

Reduce horizontal density while preserving the visual hierarchy.

## Mobile

Prioritize:

1. greeting
2. important care information
3. pet list
4. primary actions

Use stacked cards.

Navigation may become a compact top bar or mobile navigation pattern.

Do not simply shrink the desktop layout.

Recompose it.

---

# 27. Accessibility

The visual system should maintain:

- strong text contrast
- visible keyboard focus states
- readable font sizes
- clear button states
- non-color-only status indicators
- usable touch targets

Warm colors should never compromise readability.

---

# 28. Visual Hierarchy Rules

When deciding between competing visual treatments, follow this order:

### Level 1: Pet identity

Who is this pet?

### Level 2: Important care information

What matters now?

### Level 3: User action

What can I do next?

### Level 4: Supporting metadata

What additional information is useful?

### Level 5: System controls

Edit, delete, settings, logout, and other secondary operations.

This hierarchy keeps the product centered around the user rather than around the underlying CRUD operations.

---

# 29. Anti-Patterns

Do not introduce these unless a specific product requirement justifies them:

- giant gradient backgrounds
- glassmorphism as the primary visual language
- excessive blur
- huge rounded pills
- endless dashboard cards
- dense data tables on the main dashboard
- oversized icons
- decorative paws on every component
- too many font families
- multiple competing accent colors
- excessive shadows
- animated backgrounds
- stock-photo overload
- overly cute mascots
- generic doctor/medical imagery
- enterprise admin sidebars
- unnecessary charts

---

# 30. Design-to-Code Boundary

The design should guide implementation, but visual complexity must remain proportional to the project.

The product does not need:

- a massive component library
- a complicated design system framework
- complex animation infrastructure
- unnecessary third-party UI dependencies
- a large illustration pipeline

The implementation should be simple enough for the student to understand and explain.

The design should look sophisticated because the decisions are good, not because the implementation is enormous.

---

# 31. Suggested Initial Screen Set

The first design pass should focus on these screens:

1. Landing
2. Login
3. Registration
4. Dashboard
5. Add Pet
6. Pet Detail
7. Edit Pet
8. Health Records
9. Add/Edit Health Record

Do not design every possible future screen before the core experience is validated.

---

# 32. Final Visual Summary

PetCare should look like a **quietly premium companion product**.

It should have enough warmth to feel connected to animals, enough structure to handle health information responsibly, and enough personality to avoid becoming another generic student dashboard.

The visual formula is:

```text
Warm neutral foundation
        +
Restrained moss / clay accents
        +
Strong typography
        +
Real pet photography
        +
Editorial composition
        +
Soft geometry
        +
Minimal but purposeful motion
        =
PetCare
```

The most important visual decision is not the color palette or the card radius.

It is the decision to make **the pet the protagonist**.

The interface should support that story.

---

# 33. Design Principle

> **If a screen looks impressive but makes the pet, the care information, or the user's next action harder to understand, the design is wrong.**

PetCare should never confuse visual polish with visual noise.

The goal is not to make the college project look expensive.

The goal is to make it look **intentional**.
