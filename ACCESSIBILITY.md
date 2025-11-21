# WCAG Accessibility Implementation

This document describes the WCAG 2.1 Operable guideline implemented in the VideoConference Platform frontend for Sprint 1.

---

## WCAG 2.1.1 Keyboard (Level A)

**WCAG Principle**: Operable  
**Guideline**: 2.1 Keyboard Accessible  
**Success Criterion**: 2.1.1 Keyboard  
**Level**: A (Minimum level)

### Requirement

"All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes, except where the underlying function requires input that depends on the path of the user's movement and not just the endpoints."

### Implementation

The application ensures that all interactive functionality is accessible via keyboard navigation without requiring mouse interaction or specific timing.

#### 1. Native Keyboard-Accessible Elements

All interactive elements use native HTML elements that are inherently keyboard accessible:

- **Buttons**: All buttons use the native `<button>` element
  - Form submission buttons
  - Toggle buttons (show/hide password)
  - Action buttons (delete, cancel, etc.)
  - All buttons can be activated with `Enter` or `Space` key

- **Links**: All navigation uses React Router `<Link>` components that render as native `<a>` elements
  - Header navigation links
  - Footer links
  - Inline text links
  - All links can be activated with `Enter` key

- **Form Inputs**: All form fields use native `<input>` elements
  - Text inputs
  - Email inputs
  - Password inputs
  - Checkboxes
  - All inputs can be focused and navigated with `Tab` key

**Location**:
- `src/components/Button/Button.tsx` - Renders native `<button>` elements
- `src/components/Input/Input.tsx` - Renders native `<input>` elements
- All pages use React Router `<Link>` components

#### 2. Keyboard Navigation Support

- **Tab Navigation**: Users can navigate through all interactive elements using `Tab` key
- **Shift+Tab**: Reverse navigation is supported
- **Enter/Space**: Activates buttons and links
- **Form Submission**: Forms can be submitted using `Enter` key when focus is on submit button or any form field

**Location**:
- All form components (`Login.tsx`, `Register.tsx`, `EditProfile.tsx`, etc.)
- All interactive pages

#### 3. Visible Focus Indicators

All focusable elements have visible focus indicators to show keyboard users where they are:

- **Focus Styles**: Custom `focus-visible` styles applied to all interactive elements
- **High Contrast**: Focus indicators use high contrast colors (primary color with box-shadow)
- **Clear Visual Feedback**: Focus indicators are clearly visible and distinct from hover states

**Location**:
- `src/styles/_mixins.scss` - `@mixin focus-visible` mixin
- `src/styles/main.scss` - Applied to `a`, `button`, `input`, `textarea`, `select`
- All component SCSS files inherit focus styles

**Code Example**:
```scss
@mixin focus-visible {
  outline: 2px solid $primary-color;
  outline-offset: 2px;
  border-color: $primary-color;
  box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
}

button {
  &:focus-visible {
    @include focus-visible;
  }
}
```

#### 4. Logical Tab Order

The tab order follows a logical sequence that matches the visual layout:

- **Top to Bottom**: Navigation flows from header to main content to footer
- **Left to Right**: Within sections, focus moves left to right
- **Form Fields**: Form inputs follow the visual order (first name → last name → email → password)
- **No Skipped Elements**: All interactive elements are included in tab sequence

**Location**:
- All pages maintain logical DOM order
- Forms use proper field ordering
- `src/components/Header/Header.tsx` - Logical navigation order

#### 5. No Keyboard Traps

- **Modal Dialogs**: Modal dialogs (e.g., delete account confirmation) can be closed with `Escape` key
- **Focus Management**: Focus is properly managed in modals
- **No Infinite Loops**: Tab navigation does not trap users in any section

**Location**:
- `src/pages/Profile/Profile.tsx` - Delete account modal
- Modal backdrop can be clicked to close (also accessible via keyboard)

#### 6. ARIA Labels for Screen Readers

Interactive elements without visible text have descriptive `aria-label` attributes:

- **Icon Buttons**: All icon-only buttons have `aria-label` describing their function
- **Navigation**: Navigation elements have `aria-label` for context
- **Form Controls**: Form inputs are associated with labels using `htmlFor` and `id`

**Location**:
- `src/pages/VideoConference/VideoConference.tsx` - All control buttons have `aria-label`
- `src/pages/Login/Login.tsx` - Password toggle button has `aria-label`
- `src/components/Header/Header.tsx` - Navigation has `aria-label="Main navigation"`
- `src/components/Input/Input.tsx` - Labels use `htmlFor` to associate with inputs

**Code Examples**:
```tsx
// Icon button with aria-label
<button
  type="button"
  aria-label={isMicOn ? 'Silenciar micrófono' : 'Activar micrófono'}
  onClick={() => setIsMicOn(!isMicOn)}
>
  {/* Icon SVG */}
</button>

// Input with associated label
<label htmlFor="email" className="input-label">
  Correo electrónico
</label>
<input id="email" type="email" />
```

#### 7. Role Attributes for Semantic Structure

Semantic HTML and ARIA roles provide context for assistive technologies:

- **Main Content**: All main pages use `role="main"`
- **Navigation**: Header navigation uses `role="navigation"`
- **Banner**: Header uses `role="banner"`
- **Alerts**: Error and success messages use `role="alert"`
- **Dialogs**: Modal dialogs use `role="dialog"` with `aria-labelledby`

**Location**:
- All page components use `role="main"`
- `src/components/Header/Header.tsx` - Uses `role="banner"` and `role="navigation"`
- `src/pages/Profile/Profile.tsx` - Modal uses `role="dialog"`
- All error/success messages use `role="alert"`

**Code Example**:
```tsx
<main className="login" role="main">
  {/* Page content */}
</main>

<nav className="header__nav" role="navigation" aria-label="Main navigation">
  {/* Navigation links */}
</nav>

<div className="profile__modal" role="dialog" aria-labelledby="delete-modal-title">
  <h2 id="delete-modal-title">Eliminar cuenta</h2>
  {/* Modal content */}
</div>
```

#### 8. Disabled State Handling

Disabled interactive elements are properly handled:

- **Visual Indication**: Disabled buttons show reduced opacity and `cursor: not-allowed`
- **Keyboard Prevention**: Disabled buttons cannot be activated via keyboard
- **Form Submission**: Submit buttons are disabled during form submission to prevent duplicate submissions

**Location**:
- `src/styles/main.scss` - Disabled button styles
- All form components disable submit buttons during `isSubmitting` state

**Code Example**:
```tsx
<Button 
  type="submit" 
  disabled={isSubmitting}
>
  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
</Button>
```

### Testing

To verify keyboard accessibility:

1. **Tab Navigation Test**:
   - Open any page
   - Press `Tab` repeatedly
   - Verify all interactive elements receive focus in logical order
   - Verify focus indicators are visible

2. **Keyboard Activation Test**:
   - Focus on a button or link
   - Press `Enter` or `Space`
   - Verify the action is triggered

3. **Form Submission Test**:
   - Fill out a form using only keyboard
   - Navigate between fields with `Tab`
   - Submit form with `Enter` key
   - Verify form submits correctly

4. **Modal Test**:
   - Open delete account modal
   - Verify focus is trapped in modal
   - Press `Escape` to close
   - Verify modal closes and focus returns

### Benefits

- **Universal Access**: Users who cannot use a mouse can fully operate the application
- **Efficiency**: Keyboard navigation is often faster for power users
- **Screen Reader Compatibility**: Proper keyboard support is essential for screen reader users
- **Compliance**: Meets WCAG 2.1 Level A requirements for accessibility
- **Better UX**: Visible focus indicators help all users understand their position in the interface

### Code Locations Summary

| Component | Location | Keyboard Feature |
|-----------|----------|------------------|
| Buttons | `src/components/Button/Button.tsx` | Native `<button>` elements |
| Inputs | `src/components/Input/Input.tsx` | Native `<input>` with labels |
| Focus Styles | `src/styles/_mixins.scss` | `focus-visible` mixin |
| Global Styles | `src/styles/main.scss` | Focus styles for all elements |
| Navigation | `src/components/Header/Header.tsx` | ARIA roles and labels |
| Forms | All form pages | Logical tab order |
| Modals | `src/pages/Profile/Profile.tsx` | Dialog role and keyboard handling |
| Video Controls | `src/pages/VideoConference/VideoConference.tsx` | aria-label on all buttons |

---

## References

- [WCAG 2.1 Success Criterion 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [WCAG 2.1 Guidelines - Operable](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa&technologies=html%2Ccss%2Cjavascript)
- [MDN: Keyboard Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)

