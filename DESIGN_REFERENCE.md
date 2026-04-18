# MOZP-Curebot Design Reference Guide

## 🎨 Standard Apple/iOS Design System

This document provides a quick reference for the design system used in MOZP-Curebot.

---

## 📐 Typography Scale

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
```

### Font Sizes & Letter Spacing
| Size | Usage | Letter Spacing | Weight |
|------|-------|----------------|--------|
| 28px | Section Headers | 0.35px | 700 |
| 24px | Modal Titles | 0.35px | 700 |
| 20px | Card Titles | 0.38px | 600 |
| 17px | Body Text, Buttons | -0.41px | 400-600 |
| 15px | Secondary Text | -0.24px | 400 |
| 13px | Labels, Small Text | -0.08px | 400 |
| 12px | Captions | -0.08px | 400 |
| 11px | Tiny Text | -0.08px | 400 |
| 10px | Micro Text | -0.08px | 600 |

---

## 🎨 Color Palette

### Primary Colors
```css
--ios-blue: #007AFF      /* Primary actions, links */
--ios-green: #34C759     /* Success, positive */
--ios-orange: #FF9500    /* Warnings, moderate */
--ios-red: #FF3B30       /* Errors, danger */
```

### Gray Scale
```css
--ios-gray: #8E8E93           /* Secondary text */
--ios-gray-light: #C7C7CC     /* Disabled elements */
--ios-gray-lighter: #E5E5EA   /* Borders, dividers */
```

### Backgrounds
```css
--ios-bg: #F2F2F7             /* Main background */
--ios-bg-secondary: #FFFFFF   /* Cards, panels */
--ios-bg-tertiary: #F9F9F9    /* Subtle backgrounds */
--ios-bg-grouped: #EFEFF4     /* Grouped lists */
```

### Text Colors
```css
--ios-text: #000000                    /* Primary text */
--ios-text-secondary: #3C3C43          /* Secondary text */
--ios-text-tertiary: #8E8E93           /* Tertiary text */
```

### Separators
```css
--ios-separator: rgba(60,60,67,0.29)   /* Transparent borders */
--ios-separator-opaque: #C6C6C8        /* Opaque borders */
```

---

## 📏 Spacing System

### Padding/Margin Scale
```css
4px   - Tiny spacing
6px   - Extra small
8px   - Small
10px  - Small-medium
12px  - Medium
14px  - Medium-large
16px  - Large
20px  - Extra large
24px  - XXL
```

### Common Patterns
```css
/* Card padding */
padding: 16px;

/* Section spacing */
margin-bottom: 16px;
gap: 12px;

/* Input padding */
padding: 11px 14px;

/* Button padding */
padding: 14px 20px;
```

---

## 🔲 Border Radius

```css
--ios-radius-sm: 8px    /* Small elements */
--ios-radius-md: 10px   /* Inputs, buttons */
--ios-radius-lg: 12px   /* Cards */
--ios-radius-xl: 16px   /* Modals, large cards */
```

### Usage Examples
```css
/* Buttons */
border-radius: 10px;

/* Cards */
border-radius: 12px;

/* Modals */
border-radius: 16px;

/* Chips/Tags */
border-radius: 16px;

/* Circular */
border-radius: 50%;
```

---

## 🌫️ Shadows

```css
--ios-shadow-sm: 0 1px 3px rgba(0,0,0,0.12)    /* Subtle elevation */
--ios-shadow-md: 0 4px 12px rgba(0,0,0,0.15)   /* Cards */
--ios-shadow-lg: 0 8px 24px rgba(0,0,0,0.18)   /* Modals */
```

---

## 🔍 Borders

### Standard Border
```css
border: 0.5px solid var(--ios-separator);
```

### Accent Borders (Left)
```css
border-left: 3px solid var(--ios-blue);   /* Info */
border-left: 3px solid var(--ios-green);  /* Success */
border-left: 3px solid var(--ios-orange); /* Warning */
border-left: 3px solid var(--ios-red);    /* Error */
```

---

## 🌀 Blur Effects

### iOS Standard Blur
```css
backdrop-filter: saturate(180%) blur(20px);
-webkit-backdrop-filter: saturate(180%) blur(20px);
background: rgba(255,255,255,0.8);
```

### Usage
- Header
- Tab navigation
- Modals (overlay)
- Toast notifications

---

## 🎭 Component Patterns

### Button Styles

#### Primary Button
```css
background: var(--ios-blue);
color: white;
padding: 14px 20px;
border-radius: 10px;
font-size: 17px;
font-weight: 600;
```

#### Secondary Button
```css
background: var(--ios-bg-tertiary);
color: var(--ios-blue);
border: 0.5px solid var(--ios-separator);
padding: 11px 16px;
border-radius: 10px;
font-size: 15px;
font-weight: 600;
```

#### Text Button
```css
background: none;
border: none;
color: var(--ios-blue);
font-size: 15px;
font-weight: 400;
```

### Input Styles
```css
padding: 11px 14px;
background: var(--ios-bg-secondary);
border: 0.5px solid var(--ios-separator);
border-radius: 10px;
font-size: 17px;
```

### Card Styles
```css
background: var(--ios-bg-secondary);
border: 0.5px solid var(--ios-separator);
border-radius: 12px;
padding: 16px;
```

---

## 🎯 Interactive States

### Hover (Desktop)
```css
/* Not used - iOS doesn't have hover */
```

### Active (Touch)
```css
button:active {
  opacity: 0.7;
}

.card:active {
  background: var(--ios-bg-tertiary);
}
```

### Focus (Keyboard)
```css
:focus-visible {
  outline: 2px solid var(--ios-blue);
  outline-offset: 2px;
}
```

---

## 🎬 Animations

### Transitions (Minimal)
```css
transition: all 0.2s ease;
```

### Typing Indicator
```css
@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}
```

### No Other Animations
- ❌ No bounce
- ❌ No wiggle
- ❌ No pulse
- ❌ No shimmer
- ❌ No glow
- ✅ Only functional animations

---

## 📱 Responsive Breakpoints

### Mobile First (Default)
```css
/* 0px - 767px */
max-width: 480px;
```

### Desktop
```css
@media (min-width: 768px) {
  /* Multi-column grids */
  /* Centered layout with shadow */
}
```

---

## 🏗️ Layout Patterns

### Flex Layouts
```css
/* Horizontal row */
display: flex;
align-items: center;
gap: 8px;

/* Vertical column */
display: flex;
flex-direction: column;
gap: 12px;
```

### Grid Layouts
```css
/* 2 columns */
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;

/* 3 columns (desktop) */
@media (min-width: 768px) {
  grid-template-columns: repeat(3, 1fr);
}
```

---

## 🎨 Severity Colors

### Risk Levels
```css
/* Emergency/High */
background: rgba(255,59,48,0.1);
color: var(--ios-red);

/* Moderate/Warning */
background: rgba(255,149,0,0.1);
color: var(--ios-orange);

/* Mild/Success */
background: rgba(52,199,89,0.1);
color: var(--ios-green);

/* Info */
background: rgba(0,122,255,0.1);
color: var(--ios-blue);
```

---

## 📋 Component Checklist

### Every Component Should Have:
- ✅ iOS system colors
- ✅ SF Pro font
- ✅ Proper letter spacing
- ✅ 0.5px borders (where applicable)
- ✅ iOS radius values
- ✅ Minimal transitions (0.2s)
- ✅ Active states for touch
- ✅ Focus states for keyboard
- ✅ Proper contrast ratios

### Every Component Should NOT Have:
- ❌ Custom gradients
- ❌ Excessive animations
- ❌ Non-standard colors
- ❌ Heavy shadows
- ❌ Complex effects
- ❌ Hover states (mobile-first)

---

## 🔧 Quick Reference

### Common CSS Variables
```css
var(--ios-blue)           /* Primary color */
var(--ios-bg-secondary)   /* Card background */
var(--ios-separator)      /* Border color */
var(--ios-text)           /* Primary text */
var(--ios-text-secondary) /* Secondary text */
var(--ios-radius-md)      /* Standard radius */
var(--ios-shadow-sm)      /* Subtle shadow */
```

### Common Classes
```css
.btn-primary              /* Blue button */
.btn-secondary            /* Gray button */
.form-input               /* Text input */
.form-select              /* Dropdown */
.result-card              /* Result container */
.chip                     /* Small tag */
.modal-overlay            /* Modal background */
.modal-card               /* Modal content */
```

---

## 📚 Resources

### Apple Design Resources
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [SF Pro Font](https://developer.apple.com/fonts/)
- [iOS Color System](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/)

### Design Principles
1. **Clarity** - Text is legible, icons are precise
2. **Deference** - Content fills the screen, UI doesn't compete
3. **Depth** - Layers and motion convey hierarchy

---

**Last Updated**: April 18, 2026  
**Version**: 2.0  
**Design System**: Apple/iOS Standard

