# Elacare Design System - Component Showcase

## Color Palette

### Primary: Emerald (#064e3b)
```
Emerald 50:   #f0fdf4  (Lightest backgrounds)
Emerald 100:  #dcfce7
Emerald 200:  #bbf7d0
Emerald 300:  #86efac
Emerald 400:  #4ade80
Emerald 500:  #22c55e
Emerald 600:  #16a34a  (Primary button)
Emerald 700:  #15803d
Emerald 800:  #166534
Emerald 900:  #134e4a
Emerald 950:  #064e3b  (Darkest text, brand color)
```

### Status Colors
- **Success**: Green-600 (#16a34a)
- **Warning**: Yellow-500 (#eab308)
- **Danger**: Red-500 (#ef4444)
- **Info**: Blue-500 (#3b82f6)

---

## Components

### 1. Button

#### Variants
```jsx
import { Button } from "@/components/ui/button"

// Default (Primary)
<Button>Click me</Button>

// Secondary
<Button variant="secondary">Secondary</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost
<Button variant="ghost">Ghost</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Link
<Button variant="link">Link</Button>
```

#### Sizes
```jsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

#### States
```jsx
<Button disabled>Disabled</Button>
<Button>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

---

### 2. Input

```jsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="your@email.com"
    className="pl-10"
  />
</div>
```

#### Styling Classes
- **Emerald Focus**: `border-emerald-300 focus:ring-emerald-500`
- **Background**: `bg-emerald-50 text-emerald-950`
- **Placeholder**: `placeholder:text-emerald-400`

---

### 3. Card

```jsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Sensor Reading</CardTitle>
    <CardDescription>Current soil conditions</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
</Card>
```

#### Variants
```jsx
// Basic
<Card className="border-0 shadow-md">...</Card>

// With hover effect
<Card className="hover:shadow-lg transition">...</Card>

// With background color
<Card className="bg-emerald-50">...</Card>
```

---

### 4. Alert

```jsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

// Success
<Alert className="border-emerald-300 bg-emerald-50">
  <CheckCircle className="h-4 w-4 text-emerald-600" />
  <AlertDescription className="text-emerald-800">
    Operation successful!
  </AlertDescription>
</Alert>

// Warning
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>This is a warning</AlertDescription>
</Alert>
```

#### Variants
- `default`: Emerald - for success/info
- `destructive`: Red - for errors/warnings
- Custom: Yellow/Green - for specific use cases

---

### 5. Badge

```jsx
import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Danger</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
```

#### Usage
```jsx
// Status indicator
<Badge variant="default">Active</Badge>

// With value
<Badge>45 mg/kg</Badge>

// Inline with text
<p>Status: <Badge variant="secondary">Optimal</Badge></p>
```

---

## Layout Patterns

### Page Container
```jsx
<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
  <Navbar />
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Content */}
  </div>
</div>
```

### Card Grid
```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### Sensor Card Grid (Dashboard)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  <SensorCard label="Nitrogen" value={45} unit="mg/kg" />
  {/* ... more cards */}
</div>
```

---

## Spacing Guidelines

| Class | Value | Usage |
|-------|-------|-------|
| p-4 | 1rem | Default padding |
| p-6 | 1.5rem | Card padding |
| gap-3 | 0.75rem | Component spacing |
| gap-4 | 1rem | Section spacing |
| mb-4 | 1rem | Bottom margin |
| mt-6 | 1.5rem | Top margin sections |

---

## Icons with Text

### Icon Patterns
```jsx
// Icon with button
<Button>
  <Home className="w-5 h-5 mr-2" />
  Dashboard
</Button>

// Icon in input
<div className="relative">
  <Mail className="absolute left-3 top-3 w-5 h-5 text-emerald-400" />
  <Input className="pl-10" placeholder="Email" />
</div>

// Icon badge
<div className="p-3 bg-emerald-100 rounded-lg">
  <Leaf className="w-8 h-8 text-emerald-600" />
</div>
```

---

## Responsive Design

### Breakpoints
```
sm: ≥640px  (Tablets)
md: ≥768px  (Small laptops)
lg: ≥1024px (Desktops)
```

### Common Patterns
```jsx
// Hidden on mobile
<span className="hidden sm:inline">Dashboard</span>

// Different layout on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Padding adjustments
<div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
```

---

## Animation & Transitions

### Utility Classes
```jsx
// Smooth transitions
<Button className="transition hover:shadow-lg">

// Spinner
<Loader2 className="animate-spin" />

// Hover effects
<Card className="hover:shadow-lg hover:scale-105 transition">
```

---

## Form Patterns

### Login Form
```jsx
<form className="space-y-5">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <div className="relative">
      <Mail className="absolute left-3 top-3 w-5 h-5 text-emerald-400" />
      <Input
        id="email"
        type="email"
        className="pl-10 bg-emerald-50 border-emerald-300"
        placeholder="your@email.com"
      />
    </div>
  </div>
  <Button type="submit" className="w-full">Sign In</Button>
</form>
```

### Validation States
```jsx
// Error state
<Input className="border-red-300 bg-red-50" />

// Success state
<Input className="border-emerald-300 bg-emerald-50" />

// Disabled state
<Input disabled className="opacity-50" />
```

---

## Loading States

### Page Loader
```jsx
<div className="min-h-screen flex items-center justify-center">
  <div className="text-center">
    <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
    <p className="text-emerald-700">Loading...</p>
  </div>
</div>
```

### Button Loader
```jsx
<Button disabled>
  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
  Processing...
</Button>
```

---

## Accessibility Features

### ARIA Labels
```jsx
<Button aria-label="Close menu">
  <X className="w-4 h-4" />
</Button>
```

### Focus States
All interactive elements have focus rings:
```
focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-emerald-500
focus-visible:ring-offset-2
```

### Color Contrast
- Text on background: Minimum 4.5:1 contrast ratio
- Emerald 950 on white: ✅ WCAG AAA compliant
- Emerald 600 on white: ✅ WCAG AA compliant

---

## Dark Mode Support (Future)

When implementing dark mode, use Tailwind's `dark:` prefix:
```jsx
<div className="bg-white dark:bg-emerald-950">
  <p className="text-gray-900 dark:text-emerald-50">Content</p>
</div>
```

---

## Common Patterns

### Success Message
```jsx
<Alert className="border-emerald-300 bg-emerald-50">
  <CheckCircle className="h-4 w-4 text-emerald-600" />
  <AlertDescription className="text-emerald-800">
    {message}
  </AlertDescription>
</Alert>
```

### Error Message
```jsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>{errorMessage}</AlertDescription>
</Alert>
```

### Info Badge
```jsx
<Badge variant="secondary">{value}</Badge>
```

### Action Card
```jsx
<Card className="cursor-pointer hover:shadow-lg transition">
  <CardContent className="pt-6">
    <div className="flex items-center gap-4">
      <Icon className="w-8 h-8 text-emerald-600" />
      <div>
        <h3 className="font-semibold">Title</h3>
        <p className="text-sm text-emerald-600">Description</p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Best Practices

### Do's ✅
- Use Emerald variants for primary actions
- Combine shadows and hovers for interactivity
- Keep spacing consistent with Tailwind scale
- Use semantic HTML with proper ARIA
- Add loading states for async operations
- Use badges for status indicators

### Don'ts ❌
- Don't use bare `<div>` for form fields - wrap in Card/Container
- Don't mix color brands (avoid gray + emerald without purpose)
- Don't skip disabled states on interactive elements
- Don't use vague icon-only buttons without tooltips
- Don't stretch components unnecessarily
- Don't forget focus states on interactive elements

---

## Migration Checklist

When updating components from old styling:
- [ ] Replace `className="bg-agri-green"` with `className="bg-emerald-600"`
- [ ] Replace button `className` with `<Button>` component
- [ ] Replace Alert divs with `<Alert>` component
- [ ] Replace Badge spans with `<Badge>` component
- [ ] Update color strings to use Tailwind classes
- [ ] Test responsive design on mobile
- [ ] Verify focus states work
- [ ] Test with keyboard navigation

---

**Elacare Design System v1.0**
Built with shadcn/ui + Tailwind CSS + Radix UI
Last Updated: 2024
