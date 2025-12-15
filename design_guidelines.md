# Graphlynk Design Guidelines

## Design Approach

**Selected Approach**: Design System with SaaS Dashboard Influence
- Primary inspiration: Linear's clarity + Notion's information density + Modern analytics platforms
- Rationale: Professional SEO/marketing tool requiring data clarity, efficient workflows, and credible presentation
- Key principles: Information hierarchy, scanning efficiency, professional credibility, purposeful minimalism

## Typography System

**Font Families**:
- Primary: Inter (via Google Fonts CDN) - all UI, body text, data
- Monospace: JetBrains Mono - code snippets, API keys, schema markup

**Type Scale**:
- Hero/Landing: text-5xl to text-6xl, font-bold
- Page titles: text-3xl, font-bold
- Section headers: text-2xl, font-semibold
- Card titles: text-lg, font-semibold
- Body text: text-base, font-normal
- Captions/metadata: text-sm, font-medium
- Labels: text-xs, font-medium, uppercase tracking-wide

**Hierarchy Rules**:
- Dashboard titles use bold weights with generous spacing below (mb-8)
- Data labels always uppercase with letter-spacing for scannability
- Numerical data displays use tabular-nums for alignment

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing (within components): 2, 4
- Component internal padding: 4, 6, 8
- Component external margins: 8, 12, 16
- Section spacing: 20, 24
- Page padding: 8 (mobile), 12 (desktop)

**Grid System**:
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Profile links: Single column with full-width items
- Blog posts: grid-cols-1 md:grid-cols-2 gap-8
- Stats/metrics: grid-cols-2 md:grid-cols-4

**Container Strategy**:
- Dashboard content: max-w-7xl mx-auto
- Profile pages: max-w-4xl mx-auto
- Blog content: max-w-3xl mx-auto
- Forms: max-w-md mx-auto

## Component Library

### Navigation
**Header**: 
- Fixed top navigation with border-b
- Height: h-16
- Inner container: max-w-7xl with px-8
- Logo left, navigation center, user menu right
- Mobile: Hamburger menu icon at right

**Dashboard Sidebar** (for future expansion):
- Fixed left sidebar w-64
- Main content area with ml-64 offset
- Navigation items with py-3 px-4, rounded-lg hover states
- Icons from Heroicons (outline style)

### Cards & Containers
**Dashboard Cards**:
- Border with rounded-xl
- Padding: p-6
- Shadow: shadow-sm with hover:shadow-md transition
- Header with icon + title, then content area
- Minimum height: min-h-[200px] for consistency

**Profile Card** (link-in-bio):
- Centered container max-w-2xl
- Avatar: rounded-full w-24 h-24 with ring-4
- Bio section: text-center with mb-8
- Link items: Full-width buttons with rounded-lg, py-4 px-6
- Spacing between links: space-y-3

**Stat Cards**:
- Grid layout with border and rounded-lg
- Large number display: text-4xl font-bold
- Label below: text-sm with reduced opacity
- Icon in top-right corner: w-8 h-8

### Forms & Inputs
**Input Fields**:
- Border with rounded-lg
- Padding: px-4 py-3
- Focus ring: ring-2 with offset
- Labels: text-sm font-medium mb-2
- Helper text: text-xs mt-1

**Buttons**:
- Primary: px-6 py-3 rounded-lg font-semibold
- Secondary: Border variant with same dimensions
- Small: px-4 py-2 text-sm
- Icon buttons: p-2 rounded-lg
- Hover: Transform scale-[1.02] transition

**Form Layouts**:
- Vertical spacing between fields: space-y-6
- Form sections with border-t pt-6 mt-6
- Submit button full-width on mobile, auto on desktop

### Data Display
**Search Results**:
- List with divide-y separator
- Each result: py-4 px-6
- Rank badge: Inline flex with rounded-full px-3 py-1
- Title: text-lg font-semibold, truncate
- URL: text-sm, truncate with max width
- Metadata row: flex justify-between items-center

**Blog Post Cards**:
- Featured image: aspect-[16/9] with rounded-t-xl
- Content padding: p-6
- Title: text-xl font-bold mb-2
- Excerpt: text-sm line-clamp-3
- Footer: flex justify-between with date and read time

**Profile Links Display**:
- Stack vertically with space-y-3
- Each link: Full-width card with flex justify-between
- External link icon on right
- Hover state with subtle transform

### Overlays & Modals
**Modal**:
- Backdrop: Fixed inset with backdrop-blur-sm
- Content: max-w-2xl with rounded-2xl
- Padding: p-8
- Close button: Absolute top-4 right-4

**Toast Notifications**:
- Fixed bottom-4 right-4
- Max-width: max-w-sm
- Padding: px-6 py-4
- Rounded-lg with shadow-lg
- Auto-dismiss animation

## Page-Specific Layouts

### Landing Page
**Hero Section**:
- Full viewport height: min-h-[85vh]
- Center-aligned content: flex flex-col justify-center
- Heading: text-6xl font-bold mb-6
- Subheading: text-xl mb-8 max-w-2xl
- CTA buttons: Flex row gap-4
- Background: Hero image with overlay gradient

**Features Section**:
- Grid: grid-cols-1 md:grid-cols-3 gap-8
- Icon above: w-12 h-12 mb-4
- Each feature card: text-center with p-8
- Padding: py-24

**Pricing Section**:
- Three-column layout: grid-cols-1 md:grid-cols-3
- Featured plan: Scale-105 with enhanced shadow
- Pricing card: p-8 rounded-2xl
- Price display: text-5xl font-bold
- Feature list: space-y-3 with checkmark icons

### Dashboard
**Layout Structure**:
- Grid of action cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Quick stats row above: grid-cols-2 md:grid-cols-4 gap-4 mb-8
- Recent activity feed: Single column on right (future)

**Empty States**:
- Center-aligned with py-16
- Icon: w-16 h-16 mb-4
- Message: text-lg
- CTA button below

### Profile Page (/u/[username])
**Layout**:
- Single column max-w-2xl
- Header section: text-center py-12
- Avatar: mb-4
- Name: text-3xl font-bold
- Bio: text-lg mb-8
- Links section: Full-width with space-y-3
- Schema badges: Flex row gap-2 justify-center

### Blog System
**Editor**:
- Split view: Sidebar left (w-64) with metadata
- Main editor: Remaining space with max-w-4xl
- Toolbar: Sticky top with shadow-sm
- Preview toggle button

**Blog Index**:
- Masonry-style grid: grid-cols-1 md:grid-cols-2 gap-8
- Featured post: Spans 2 columns on desktop

## Icons
Use Heroicons (Outline style) via CDN
- Navigation: 20x20 size
- Cards/Features: 24x24 size  
- Hero sections: 48x48 size

## Images

**Hero Image**: 
- Full-width background image showing abstract data visualization or knowledge graph network
- Apply gradient overlay for text readability
- Buttons on hero have backdrop-blur-md backgrounds

**Profile Avatars**:
- Support custom user uploads
- Fallback to initials with generated background

**Blog Featured Images**:
- Aspect ratio 16:9
- Support for custom uploads per post
- Placeholder: Abstract gradient patterns

**Feature Section Icons**:
- Use illustrated icons or Heroicons at 48x48
- No photographic images in features section

## Animations
Minimal, purposeful animations only:
- Button hover: scale transform
- Card hover: shadow elevation change
- Page transitions: None
- Data loading: Simple spinner, no skeletons
- Success states: Subtle checkmark fade-in