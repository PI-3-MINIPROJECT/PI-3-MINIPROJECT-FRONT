# WCAG Accessibility Implementation

This document describes the WCAG 2.1 guidelines implemented in the VideoConference Platform frontend for Sprint 1, including both Operable and Understandable principles.

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

---

## WCAG 3.3.1 Error Identification (Level A)

**WCAG Principle**: Understandable  
**Guideline**: 3.3 Input Assistance  
**Success Criterion**: 3.3.1 Error Identification  
**Level**: A (Minimum level)

### Requirement

"If an input error is automatically detected, the error is identified and the error is described to the user in text."

### Implementation

The application clearly identifies and describes input errors to users through multiple mechanisms:

#### 1. Inline Error Messages

All form fields display error messages directly below the input when validation fails:

- **Field-Level Errors**: Each input field shows its specific error message
  - Error appears immediately below the problematic field
  - Error message is in text format (not just visual indicators)
  - Error persists until the user corrects the input

- **Error Styling**: Visual indicators combined with text messages
  - Red border on input field when error exists
  - Red error text below the field
  - Clear visual distinction between valid and invalid states

**Location**:
- `src/components/Input/Input.tsx` - Error message display below input
- All form pages display field-level errors

**Code Example**:
```tsx
<Input
  id="email"
  type="email"
  label="Correo electrónico"
  value={email}
  onChange={handleEmailChange}
  error={errors.email}  // Error message displayed below input
  required
/>
// Error renders as: <span className="input-error-message">{error}</span>
```

#### 2. General Error Messages

Forms display general error messages at the top when there are form-wide issues:

- **API Errors**: Errors from backend are displayed prominently
  - General error banner at top of form
  - User-friendly error messages (not technical jargon)
  - Clear indication that action failed

- **Validation Summary**: When multiple fields have errors, general message indicates form needs correction
  - "Por favor corrige los campos marcados antes de continuar"
  - Individual field errors still shown below each field

**Location**:
- `src/pages/Register/Register.tsx` - General error message display
- `src/pages/Login/Login.tsx` - General error message display
- `src/pages/EditProfile/EditProfile.tsx` - General error message display

**Code Example**:
```tsx
{errors.general && (
  <div className="register__error-message" role="alert">
    {errors.general}
  </div>
)}
```

#### 3. Real-Time Error Identification

Errors are identified as soon as they occur, not just on form submission:

- **On Blur Validation**: Errors appear when user leaves a field
  - Immediate feedback when field loses focus
  - User knows about error before submitting form
  - Reduces frustration from submission failures

- **On Change Validation**: Errors clear when user corrects input
  - Error disappears as soon as field becomes valid
  - Positive feedback when error is resolved
  - Encourages user to correct errors immediately

**Location**:
- `src/pages/Register/Register.tsx` - `handleFieldBlur()` function
- `src/pages/EditProfile/EditProfile.tsx` - `handleFieldBlur()` function
- All form pages validate on blur and change

**Code Example**:
```typescript
const handleFieldBlur = (field: RegisterField) => {
  const value = getFieldValue(field);
  updateFieldError(field, validateField(field, value));
};

<Input
  onBlur={() => handleFieldBlur('email')}  // Validates when field loses focus
  onChange={(e) => {
    handleEmailChange(e.target.value);
    // Error clears when user corrects input
  }}
/>
```

#### 4. Specific Error Descriptions

Error messages are specific and actionable, not generic:

- **Email Validation**: "Ingrese un correo electrónico válido" (not just "Invalid")
- **Password Requirements**: "La contraseña debe cumplir con todos los requisitos"
- **Required Fields**: "El correo electrónico es requerido" (not just "Required")
- **Password Match**: "Las contraseñas no coinciden"
- **Age Range**: "La edad debe estar entre 1 y 120"

**Location**:
- `src/pages/Register/Register.tsx` - `validateField()` function with specific messages
- `src/pages/EditProfile/EditProfile.tsx` - `validateField()` function with specific messages
- `src/pages/Login/Login.tsx` - `validateForm()` function with specific messages

**Code Example**:
```typescript
const validateField = (field: RegisterField, value: string): string | undefined => {
  const trimmed = value.trim();
  switch (field) {
    case 'email':
      if (!trimmed) return 'El correo electrónico es requerido';
      if (!emailRegex.test(trimmed)) {
        return 'Ingrese un correo electrónico válido';  // Specific error message
      }
      return undefined;
    case 'password': {
      if (!trimmed) return 'La contraseña es requerida';
      const checks = getPasswordChecks(trimmed);
      if (!Object.values(checks).every(Boolean)) {
        return 'La contraseña debe cumplir con todos los requisitos.';  // Specific message
      }
      return undefined;
    }
    // More specific validations...
  }
};
```

#### 5. ARIA Attributes for Error Announcement

Error messages use ARIA attributes to ensure screen readers announce them:

- **role="alert"**: General error messages use `role="alert"` for immediate announcement
- **aria-live**: Password requirements use `aria-live="polite"` for updates
- **Error Association**: Inputs are associated with error messages through DOM structure

**Location**:
- All error message containers use `role="alert"`
- `src/pages/Register/Register.tsx` - Error messages with ARIA
- `src/pages/EditProfile/EditProfile.tsx` - Error messages with ARIA

**Code Example**:
```tsx
{errors.general && (
  <div className="register__error-message" role="alert">
    {errors.general}
  </div>
)}

<div className="register__password-requirements" aria-live="polite">
  {/* Password requirements that update in real-time */}
</div>
```

#### 6. Error Message Persistence

Errors remain visible until corrected:

- **Error Display**: Error messages stay visible until user fixes the issue
- **No Auto-Dismiss**: Errors don't disappear automatically (unlike success messages)
- **Clear on Correction**: Errors clear immediately when field becomes valid

**Location**:
- All form validation logic maintains error state until correction
- `src/pages/Register/Register.tsx` - Error state management
- `src/pages/EditProfile/EditProfile.tsx` - Error state management

### Testing

To verify error identification:

1. **Form Validation Test**:
   - Submit a form with empty required fields
   - Verify error messages appear below each empty field
   - Verify error messages are in text format (not just visual)

2. **Real-Time Validation Test**:
   - Enter invalid email format
   - Tab away from field (blur event)
   - Verify error message appears immediately
   - Correct the email
   - Verify error message disappears

3. **Specific Error Messages Test**:
   - Enter invalid data in different fields
   - Verify each error message is specific to that field
   - Verify error messages are actionable (tell user what to fix)

4. **Screen Reader Test**:
   - Use screen reader to navigate form
   - Submit form with errors
   - Verify screen reader announces error messages
   - Verify error messages are associated with their fields

### Benefits

- **Clear Communication**: Users understand exactly what went wrong
- **Reduced Frustration**: Specific error messages help users fix issues quickly
- **Accessibility**: Screen readers can announce errors to visually impaired users
- **Better UX**: Real-time validation prevents submission of invalid forms
- **Compliance**: Meets WCAG 2.1 Level A requirements for error identification

### Code Locations Summary

| Component | Location | Error Identification Feature |
|-----------|----------|------------------------------|
| Input Component | `src/components/Input/Input.tsx` | Error message display below input |
| Register Form | `src/pages/Register/Register.tsx` | Field-level and general error messages |
| Login Form | `src/pages/Login/Login.tsx` | Field-level and general error messages |
| Edit Profile Form | `src/pages/EditProfile/EditProfile.tsx` | Field-level and general error messages |
| Create Meeting Form | `src/pages/CreateMeeting/CreateMeeting.tsx` | Field-level and general error messages |
| Validation Functions | All form pages | Specific error message generation |
| Error Handling | `src/utils/auth.ts` | User-friendly error message conversion |

---

## References

### WCAG 2.1.1 Keyboard (Operable)
- [WCAG 2.1 Success Criterion 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [WCAG 2.1 Guidelines - Operable](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa&technologies=html%2Ccss%2Cjavascript)
- [MDN: Keyboard Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)

### WCAG 3.3.1 Error Identification (Understandable)
- [WCAG 2.1 Success Criterion 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html)
- [WCAG 2.1 Guidelines - Understandable](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa&technologies=html%2Ccss%2Cjavascript)
- [MDN: Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [WebAIM: Form Labels](https://webaim.org/techniques/forms/)

