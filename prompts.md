## To use libaries for icons and animations
```
Update my React project codebase to use Framer Motion for scroll-based and other animations, React Hot Toast for notifications wherever appropriate, and replace all icon usage with React Icons. Refactor the existing code files accordingly.
```

## Color Theme and Branding Guidelines

Based on the existing styles and the common use of blue as a primary color (similar to many tech/store logos), the following theme is adopted for consistency:

**Primary Color (Branding & CTAs):**
- Tailwind CSS: `blue-600` (Hex: `#2563EB`)
- Variations: `blue-500`, `blue-700` for hover/active states.
- Usage: Logos, primary buttons, active links, important icons.

**Secondary Colors (Text & Backgrounds):**
- Text:
  - Main Text: `gray-800` (Hex: `#1F2937`)
  - Subdued Text: `gray-600` (Hex: `#4B5563`), `gray-700` (Hex: `#374151`)
  - Light Text (on dark backgrounds): `gray-200`, `gray-300`, `gray-400`
- Backgrounds:
  - Main Page Background: `gray-50` (Hex: `#F9FAFB`)
  - Component Backgrounds (Cards, Modals): `white` (Hex: `#FFFFFF`)
  - Footer/Dark Sections: `gray-800` (Hex: `#1F2937`), `gray-900` (Hex: `#111827`)

**Accent Colors:**
- Notifications/Alerts: `red-500` (Hex: `#EF4444`) for cart item count, errors.
- Success: `green-500` (Hex: `#22C55E`) for success toasts.
- Warning/Info: `yellow-500` (Hex: `#EAB308`) or `blue-400`.

**Neutral Colors:**
- Borders: `gray-200` (Hex: `#E5E7EB`), `gray-300` (Hex: `#D1D5DB`)
- Icons: Generally inherit text color or use a specific color for emphasis (e.g., primary blue).

**Font Scheme:**
- Use Tailwind CSS default sans-serif font stack for a modern and clean look.
  - `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`

**General Styling Principles:**
- **Spacing:** Utilize Tailwind's spacing scale for consistent padding and margins.
- **Rounded Corners:** Apply subtle rounded corners (`rounded-md`, `rounded-lg`) to elements like buttons, cards, and inputs for a softer look.
- **Shadows:** Use `shadow-sm`, `shadow-md`, `shadow-lg` for depth on cards and elevated elements.
- **Interactivity:** Ensure clear hover and focus states for all interactive elements, typically by slightly darkening or lightening the background/border or scaling the element.

This theme aims for a clean, modern, and trustworthy aesthetic, aligning with the "Anand Mobiles" concept.