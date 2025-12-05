# Usability Heuristics Implementation

This document describes the seven Nielsen's Usability Heuristics implemented in the VideoConference Platform frontend.

---

## Heuristic 1: Visibility of System Status

**Nielsen's Principle**: "The system should always keep users informed about what is going on, through appropriate feedback within reasonable time."

### Implementation

The application provides clear and immediate feedback about the system's current state through multiple mechanisms:

#### 1. Loading States
- **Authentication Loading**: When the app initializes, `AuthContext` shows a loading state (`isLoading`) while checking authentication status
- **Profile Loading**: Profile and EditProfile pages display "Cargando perfil..." or "Cargando datos del perfil..." while fetching user data
- **Form Submission States**: All forms show loading indicators during submission:
  - Login: Button text changes to "Iniciando sesión..." with `disabled` state
  - Register: Button text changes to "Registrando..." with `disabled` state
  - Forgot Password: Button text changes to "Enviando..." with `disabled` state
  - Create Meeting: Button text changes to "Creando..." with `disabled` state
  - Edit Profile: Form is disabled during submission

**Location**: 
- `src/contexts/AuthContext.tsx` - `isLoading` state
- `src/pages/Profile/Profile.tsx` - Loading message
- `src/pages/EditProfile/EditProfile.tsx` - Loading message
- All form components use `isSubmitting` state

#### 2. Success Messages
- **Registration Success**: After successful registration, user is redirected to login with success message
- **Login Success**: After successful login, user is redirected to dashboard with "Bienvenido de vuelta!" message
- **Profile Update**: EditProfile shows success message after successful update
- **Auto-dismiss**: Success messages automatically disappear after 5 seconds

**Location**:
- `src/pages/Login/Login.tsx` - Success message from registration
- `src/pages/Dashboard/Dashboard.tsx` - Welcome message after login
- `src/pages/EditProfile/EditProfile.tsx` - Success message after update

#### 3. Error Messages
- **Form Validation Errors**: Real-time validation errors appear below each input field
- **General Errors**: General error messages displayed at the top of forms
- **API Errors**: User-friendly error messages from backend are displayed
- **Error Recovery**: Errors clear automatically when user corrects the input

**Location**:
- All form pages (`Login.tsx`, `Register.tsx`, `EditProfile.tsx`, etc.)
- `src/utils/auth.ts` - `handleAuthError()` function converts technical errors to user-friendly messages

#### 4. Visual Feedback
- **Button States**: Buttons show disabled state during operations
- **Input Validation**: Input fields show error states with red borders and error messages
- **Password Strength**: Real-time visual checklist for password requirements in registration and profile edit

**Location**:
- `src/components/Input/Input.tsx` - Error state styling
- `src/pages/Register/Register.tsx` - Password strength checklist
- `src/pages/EditProfile/EditProfile.tsx` - Password strength checklist

### Code Examples

```typescript
// Loading state example from AuthContext
const [isLoading, setIsLoading] = useState(true);

// Form submission state example
const [isSubmitting, setIsSubmitting] = useState(false);
<Button disabled={isSubmitting}>
  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
</Button>

// Success message example
{welcomeMessage && (
  <div className="dashboard__welcome-message" role="alert">
    {welcomeMessage}
  </div>
)}
```

### Benefits
- Users always know when the system is processing their request
- Prevents duplicate submissions by disabling buttons during operations
- Reduces user anxiety by providing clear feedback
- Improves perceived performance through immediate visual feedback

---

## Heuristic 2: Error Prevention

**Nielsen's Principle**: "Even better than good error messages is a careful design which prevents a problem from occurring in the first place."

### Implementation

The application prevents errors through proactive validation, input constraints, and user guidance:

#### 1. Real-time Form Validation
- **Field-level Validation**: Each input field validates on `onChange` and `onBlur` events
- **Immediate Feedback**: Errors appear as soon as user leaves a field or corrects input
- **Prevents Invalid Submission**: Form cannot be submitted until all validations pass

**Location**:
- `src/pages/Register/Register.tsx` - `validateField()` function
- `src/pages/EditProfile/EditProfile.tsx` - `validateField()` function
- `src/pages/Login/Login.tsx` - `validateForm()` function

#### 2. Input Constraints
- **Email Format Validation**: Email fields use regex validation to ensure proper format
- **Password Strength Requirements**: Password must meet specific criteria (length, uppercase, lowercase, number, special character)
- **Age Range Validation**: Age must be between 1 and 120
- **Numeric Input Sanitization**: Age field automatically removes non-numeric characters
- **Character Limits**: Name fields have minimum and maximum length constraints

**Location**:
- `src/pages/Register/Register.tsx` - `sanitizeNumericInput()`, `getPasswordChecks()`
- `src/pages/EditProfile/EditProfile.tsx` - Similar validation functions

#### 3. Password Confirmation
- **Match Validation**: Confirm password field validates that it matches the new password
- **Real-time Comparison**: Validation occurs as user types
- **Visual Feedback**: Error message appears immediately if passwords don't match

**Location**:
- `src/pages/Register/Register.tsx` - `confirmPassword` validation
- `src/pages/EditProfile/EditProfile.tsx` - `confirmPassword` validation

#### 4. Required Field Indication
- **Visual Markers**: Required fields are marked with `required` attribute and asterisk (*) in labels
- **Prevents Empty Submission**: Form validation checks all required fields before submission
- **Clear Requirements**: Password requirements are displayed as a checklist

**Location**:
- All form components use `required` attribute
- `src/components/Input/Input.tsx` - Required field styling

#### 5. Confirmation Dialogs
- **Destructive Actions**: Account deletion requires explicit confirmation via modal
- **Prevents Accidental Actions**: User must click "Eliminar definitivamente" to confirm

**Location**:
- `src/pages/Profile/Profile.tsx` - Delete account modal

#### 6. Input Type Constraints
- **Email Input Type**: Email fields use `type="email"` for browser-level validation
- **Password Input Type**: Password fields use `type="password"` to hide input
- **Numeric Input**: Age field uses `inputMode="numeric"` and `pattern="[0-9]*"` for mobile keyboards

**Location**:
- All form components specify appropriate `type` attributes

### Code Examples

```typescript
// Real-time validation example
const validateField = (field: RegisterField, value: string): string | undefined => {
  const trimmed = value.trim();
  switch (field) {
    case 'email':
      if (!trimmed) return 'El correo electrónico es requerido';
      if (!emailRegex.test(trimmed)) {
        return 'Ingrese un correo electrónico válido';
      }
      return undefined;
    // ... other validations
  }
};

// Input sanitization example
const sanitizeNumericInput = (value: string) => 
  value.replace(/[^0-9]/g, '').slice(0, 3);

// Password strength validation
const getPasswordChecks = (pwd: string) => ({
  length: pwd.length >= 6,
  lowercase: /[a-z]/.test(pwd),
  uppercase: /[A-Z]/.test(pwd),
  number: /\d/.test(pwd),
  special: /[!@#$%^&*(),.?":{}|<>_-]/.test(pwd),
});
```

### Benefits
- Reduces form submission errors by catching issues before submission
- Improves user experience by providing immediate guidance
- Prevents invalid data from reaching the backend
- Reduces support requests and user frustration
- Guides users to create secure passwords through visual checklist

---

---

## Heuristic 3: Consistency and Standards

**Nielsen's Principle**: "Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions."

### Implementation

The application maintains consistency across all interfaces through standardized components, patterns, and conventions:

#### 1. Reusable Component Library

- **Button Component**: Single `Button` component used throughout the application with consistent styling and behavior
  - Primary buttons: Blue gradient background, white text
  - Secondary buttons: White background, border, primary color text
  - Same hover effects, focus states, and disabled states everywhere
  - Consistent sizing and spacing across all pages

- **Input Component**: Standardized `Input` component ensures uniform form field appearance and behavior
  - Consistent label positioning (above input)
  - Uniform error message display (below input, red text)
  - Same placeholder styling across all forms
  - Consistent icon placement and behavior

**Location**:
- `src/components/Button/Button.tsx` - Reusable button component
- `src/components/Input/Input.tsx` - Reusable input component
- All form pages use these components consistently

#### 2. Navigation Consistency

- **Header Navigation**: Same navigation structure across all pages
  - Logo always links to home page
  - Navigation items in same order and position
  - Active page indicator uses consistent styling
  - User menu appears in same location when authenticated

- **Footer Navigation**: Consistent footer with same links and structure on all pages
  - Same link organization
  - Consistent styling and layout

**Location**:
- `src/components/Header/Header.tsx` - Consistent header navigation
- `src/components/Footer/Footer.tsx` - Consistent footer navigation
- All pages include Header and Footer components

#### 3. Form Patterns

- **Form Layout**: Consistent form structure across all forms
  - Same spacing between fields
  - Consistent error message placement
  - Uniform submit button positioning
  - Same validation feedback patterns

- **Field Ordering**: Logical and consistent field ordering
  - Personal info forms: First name → Last name → Email → Age
  - Authentication forms: Email → Password
  - Consistent required field indicators

**Location**:
- `src/pages/Register/Register.tsx` - Registration form pattern
- `src/pages/Login/Login.tsx` - Login form pattern
- `src/pages/EditProfile/EditProfile.tsx` - Profile edit form pattern
- `src/pages/CreateMeeting/CreateMeeting.tsx` - Meeting creation form pattern

#### 4. Visual Design Consistency

- **Color Scheme**: Consistent color usage throughout
  - Primary color (blue gradient) for primary actions
  - Red for errors and destructive actions
  - Green for success states
  - Gray for disabled states

- **Typography**: Consistent font usage and sizing
  - Same font family across all pages
  - Consistent heading hierarchy (h1, h2, h3)
  - Uniform text sizes for labels, body text, and buttons

- **Spacing**: Consistent spacing system
  - Same padding and margins for similar elements
  - Uniform gaps between form fields
  - Consistent card and container spacing

**Location**:
- `src/styles/_variables.scss` - Design tokens (colors, fonts, spacing)
- `src/styles/main.scss` - Global styles
- All component SCSS files use consistent variables

#### 5. Interaction Patterns

- **Button States**: Consistent button behavior
  - Hover effects: Same transform and shadow effects
  - Focus states: Same focus-visible styling
  - Disabled states: Same opacity and cursor changes
  - Loading states: Same text change pattern ("Action..." → "Actioning...")

- **Form Submission**: Consistent form submission patterns
  - Same loading indicators
  - Uniform success/error message placement
  - Consistent redirect behavior after actions

**Location**:
- `src/components/Button/Button.scss` - Consistent button styling
- All form pages use same submission patterns

### Code Examples

```typescript
// Consistent Button component usage
<Button variant="primary" type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Registrando...' : 'Regístrate'}
</Button>

// Consistent Input component usage
<Input
  id="email"
  type="email"
  label="Correo electrónico"
  placeholder="example@gmail.com"
  value={email}
  onChange={handleEmailChange}
  error={errors.email}
  required
/>

// Consistent navigation structure
<nav className="header__nav" role="navigation" aria-label="Main navigation">
  <Link to="/" className={isActive('/') ? 'active' : ''}>Inicio</Link>
  <Link to="/about" className={isActive('/about') ? 'active' : ''}>Sobre nosotros</Link>
</nav>
```

### Benefits

- **Reduced Learning Curve**: Users learn the interface once and can apply that knowledge everywhere
- **Faster Task Completion**: Users don't need to figure out different patterns on each page
- **Increased Confidence**: Consistent patterns build user trust and confidence
- **Lower Error Rate**: Users make fewer mistakes when patterns are predictable
- **Better Maintainability**: Consistent code is easier to maintain and update

---

## Heuristic 4: Recognition rather than Recall

**Nielsen's Principle**: "Minimize the user's memory load by making objects, actions, and options visible. The user should not have to remember information from one part of the dialogue to another."

### Implementation

The application reduces cognitive load by making information visible and accessible rather than requiring users to remember details:

#### 1. Visible Labels and Placeholders

- **Clear Field Labels**: All form fields have visible labels above the input
  - Labels describe exactly what information is needed
  - No hidden or ambiguous field requirements
  - Labels remain visible even after user starts typing

- **Helpful Placeholders**: Placeholders provide examples and guidance
  - Email: "example@gmail.com"
  - Name: "e.g. John"
  - Age: "28"
  - Meeting ID: "e.g. 5f3a91e2"

**Location**:
- `src/components/Input/Input.tsx` - Label always visible
- All form pages (`Register.tsx`, `Login.tsx`, `EditProfile.tsx`, etc.) use descriptive placeholders

#### 2. Visual Indicators and Icons

- **Password Visibility Toggle**: Eye icon allows users to see password without remembering it
  - Toggle between visible and hidden password
  - Clear visual feedback of current state
  - No need to remember what was typed

- **Status Indicators**: Visual indicators show current state
  - Connection status in chat (🟢 connected, 🔴 disconnected)
  - Online users list in chat room
  - Active page indicator in navigation
  - Loading spinners show processing state

**Location**:
- `src/pages/Login/Login.tsx` - Password toggle button
- `src/components/ChatRoom/ChatRoom.tsx` - Connection status indicators
- `src/components/Header/Header.tsx` - Active navigation indicators

#### 3. Contextual Information Display

- **Password Requirements**: Password requirements visible as user types
  - Real-time checklist showing which requirements are met
  - Visual checkmarks (✔) for completed requirements
  - No need to remember password rules

- **User Information**: User data visible in profile without needing to recall
  - Full name, email, age displayed in profile
  - User initials shown in avatar
  - No need to remember account details

**Location**:
- `src/pages/Register/Register.tsx` - Password requirements checklist
- `src/pages/EditProfile/EditProfile.tsx` - Password requirements checklist
- `src/pages/Profile/Profile.tsx` - User information display

#### 4. Inline Help and Guidance

- **Error Messages**: Error messages appear inline with fields
  - Errors shown directly below the problematic field
  - No need to remember which field had an error
  - Clear, specific error descriptions

- **Form Instructions**: Instructions visible where needed
  - "La contraseña debe incluir:" checklist visible
  - Meeting creation form shows field descriptions
  - No hidden requirements or instructions

**Location**:
- `src/components/Input/Input.tsx` - Error messages below inputs
- `src/pages/Register/Register.tsx` - Password requirements visible
- `src/pages/CreateMeeting/CreateMeeting.tsx` - Form field descriptions

#### 5. Navigation Breadcrumbs and Context

- **Active Page Indicators**: Current page clearly indicated in navigation
  - Active link highlighted with different color
  - `aria-current="page"` attribute for screen readers
  - Users always know where they are

- **Page Titles**: Clear page titles show current context
  - "Iniciar Sesión", "Regístrate", "Mi Perfil" clearly visible
  - Consistent title pattern across pages
  - No ambiguity about current page

**Location**:
- `src/components/Header/Header.tsx` - Active navigation indicators
- All page components have clear h1 titles

#### 6. Visible Options and Actions

- **Action Buttons**: All actions clearly visible
  - "Crear reunión" button always visible in header
  - "Editar Perfil" button visible in profile
  - No hidden menus for common actions

- **User Menu**: User options visible when authenticated
  - Avatar shows user is logged in
  - Dropdown shows available options
  - No need to remember how to access profile

**Location**:
- `src/components/Header/Header.tsx` - Visible action buttons and user menu
- `src/pages/Profile/Profile.tsx` - Visible action buttons

### Code Examples

```typescript
// Visible password requirements
<div className="register__password-requirements" aria-live="polite">
  <p className="register__password-requirements-title">La contraseña debe incluir:</p>
  <ul className="register__password-requirements-list">
    <li className={passwordChecks.length ? 'met' : ''}>
      <span>{passwordChecks.length ? '✔' : '•'}</span>
      Al menos 6 caracteres
    </li>
    {/* More requirements... */}
  </ul>
</div>

// Visible labels and placeholders
<Input
  id="email"
  type="email"
  label="Correo electrónico"
  placeholder="example@gmail.com"
  value={email}
  error={errors.email}
/>

// Visible status indicators
<span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
  {isConnected ? '🟢' : '🔴'}
</span>
```

### Benefits

- **Reduced Cognitive Load**: Users don't need to remember information
- **Faster Task Completion**: Information is immediately available
- **Fewer Errors**: Users can verify information before submitting
- **Better User Experience**: Less frustration from having to recall details
- **Accessibility**: Screen readers can announce visible information

---

---

## Heuristic 5: Flexibility and Efficiency of Use

**Nielsen's Principle**: "Accelerators — unseen by the novice user — may often speed up the interaction for the expert user such that the system can cater to both inexperienced and experienced users. Allow users to tailor frequent actions."

### Implementation

The application provides multiple ways to accomplish tasks, catering to both novice and expert users:

#### 1. Keyboard Navigation and Shortcuts

- **Tab Navigation**: Users can navigate entire forms and interfaces using only keyboard
  - Tab moves forward through form fields
  - Shift+Tab moves backward
  - Enter submits forms
  - Escape closes modals and dialogs
  
- **Form Efficiency**: Forms support keyboard-only operation
  - All form fields accessible via Tab key
  - Submit buttons activated with Enter key
  - Checkboxes toggled with Space key
  - No mouse required for form completion

**Location**:
- All form pages (`Login.tsx`, `Register.tsx`, `EditProfile.tsx`, etc.)
- `src/components/Input/Input.tsx` - Keyboard accessible inputs
- `src/pages/Profile/Profile.tsx` - Modal with Escape key support

#### 2. Multiple Input Methods

- **Password Visibility Toggle**: Users can choose to see password while typing
  - Eye icon button for visual password entry
  - Useful for users who prefer visual confirmation
  - Accessible via keyboard (Tab + Enter/Space)

- **Remember Me Option**: Login form includes "Recuérdame" checkbox
  - Experienced users can enable persistent sessions
  - Reduces need to login repeatedly
  - Optional feature for convenience

**Location**:
- `src/pages/Login/Login.tsx` - Password toggle and remember me checkbox
- `src/pages/Register/Register.tsx` - Password visibility toggle

#### 3. Quick Actions and Navigation

- **Direct Navigation Links**: Multiple ways to access common features
  - Header "Crear reunión" button always visible
  - Footer links provide alternative navigation
  - Inline links in forms (e.g., "¿No tiene una cuenta? Crea una")

- **User Menu**: Quick access to profile and account actions
  - Avatar dropdown provides fast access to profile
  - No need to navigate through multiple pages
  - Logout available from any page via header

**Location**:
- `src/components/Header/Header.tsx` - Quick action buttons and user menu
- `src/components/Footer/Footer.tsx` - Alternative navigation links
- All form pages include navigation links

#### 4. Efficient Form Design

- **Auto-focus**: First form field automatically receives focus
  - Reduces clicks/keystrokes needed to start filling form
  - Immediate readiness for input
  - Faster form completion

- **Smart Defaults**: Forms include helpful defaults where appropriate
  - Placeholders guide users on expected format
  - Age field accepts numeric input only
  - Email field validates format automatically

**Location**:
- All form pages auto-focus first input
- `src/pages/Register/Register.tsx` - Numeric input sanitization
- `src/components/Input/Input.tsx` - Input type constraints

### Code Examples

```typescript
// Keyboard navigation support
<Input
  id="email"
  type="email"
  autoFocus  // Auto-focus for efficiency
  // ... other props
/>

// Password toggle for flexibility
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
>
  {/* Eye icon */}
</button>

// Remember me for experienced users
<label>
  <input type="checkbox" checked={rememberMe} />
  Recuérdame
</label>
```

### Benefits

- **Caters to All Users**: Novice users get guided experience, experts get shortcuts
- **Faster Task Completion**: Multiple input methods reduce time
- **Reduced Friction**: Keyboard navigation faster than mouse for many users
- **Flexibility**: Users choose their preferred interaction method

---

## Heuristic 6: Aesthetic and Minimalist Design

**Nielsen's Principle**: "Interfaces should not contain information which is irrelevant or rarely needed. Every extra unit of information in an interface competes with the relevant units of information and diminishes their relative visibility."

### Implementation

The application maintains a clean, focused interface that presents only essential information:

#### 1. Clean Visual Hierarchy

- **Focused Content**: Each page presents one primary task
  - Login page: Only login form and essential links
  - Register page: Only registration form with necessary fields
  - Profile page: User information and account actions only
  - No distracting elements or unnecessary information

- **Clear Section Separation**: Visual spacing and grouping
  - Generous whitespace between sections
  - Clear visual boundaries between content areas
  - Logical grouping of related information

**Location**:
- All page components maintain focused layouts
- `src/pages/Login/Login.scss` - Clean, minimal styling
- `src/pages/Register/Register.scss` - Focused form design

#### 2. Essential Information Only

- **Form Fields**: Only necessary fields are shown
  - Registration form includes only required user data
  - No optional fields that might confuse users
  - Each field serves a clear purpose

- **Navigation**: Only relevant navigation items
  - Header shows essential pages only
  - Footer provides comprehensive links without clutter
  - No redundant or duplicate navigation

**Location**:
- `src/components/Header/Header.tsx` - Minimal navigation
- `src/pages/Register/Register.tsx` - Essential fields only
- `src/pages/EditProfile/EditProfile.tsx` - Focused profile editing

#### 3. Progressive Disclosure

- **Password Requirements**: Shown only when relevant
  - Password requirements appear when user focuses password field
  - Not visible until needed
  - Reduces visual clutter

- **Error Messages**: Appear only when needed
  - Errors shown inline only when validation fails
  - No error messages for valid fields
  - Clean interface when everything is correct

**Location**:
- `src/pages/Register/Register.tsx` - Conditional password requirements
- `src/components/Input/Input.tsx` - Error messages only when needed
- All form pages use progressive disclosure

#### 4. Visual Simplicity

- **Consistent Color Scheme**: Limited, purposeful color palette
  - Primary blue for main actions
  - Red for errors only
  - Green for success states
  - No unnecessary color variations

- **Typography**: Clear, readable fonts
  - Single font family (Montserrat) throughout
  - Consistent font sizes
  - Good contrast for readability

**Location**:
- `src/styles/_variables.scss` - Limited color palette
- `src/styles/main.scss` - Consistent typography
- All components use design system variables

#### 5. Minimal UI Elements

- **No Decorative Elements**: Only functional UI components
  - Icons serve functional purposes (password toggle, status indicators)
  - No decorative graphics that don't add value
  - Clean, purposeful design

- **Focused CTAs**: Clear call-to-action buttons
  - Primary actions clearly distinguished
  - Secondary actions appropriately de-emphasized
  - No competing buttons or actions

**Location**:
- `src/components/Button/Button.tsx` - Clear button variants
- All pages maintain minimal, functional design
- `src/pages/Home/Home.tsx` - Clean landing page design

### Code Examples

```typescript
// Clean, focused form
<form className="register__form">
  {/* Only essential fields */}
  <Input label="Nombre" required />
  <Input label="Apellido" required />
  <Input label="Correo electrónico" type="email" required />
  {/* No unnecessary fields */}
</form>

// Progressive disclosure - password requirements
{password && (
  <div className="register__password-requirements">
    {/* Only shown when user types password */}
  </div>
)}

// Minimal navigation
<nav className="header__nav">
  <Link to="/">Inicio</Link>
  <Link to="/about">Sobre nosotros</Link>
  {/* Only essential links */}
</nav>
```

### Benefits

- **Reduced Cognitive Load**: Less information to process
- **Faster Task Completion**: Users focus on essential actions
- **Better Usability**: Important information stands out
- **Professional Appearance**: Clean design builds trust
- **Accessibility**: Simpler interface easier to navigate

---

## Heuristic 7: Help and Documentation

**Nielsen's Principle**: "Even though it is better if the system can be used without documentation, it may be necessary to provide help and documentation. Any such information should be easy to search, focused on the user's task, list concrete steps to be carried out, and not be too large."

### Implementation

The application provides contextual help and guidance throughout the user journey:

#### 1. Inline Help and Guidance

- **Field Labels and Placeholders**: Clear guidance for each input
  - Descriptive labels explain what information is needed
  - Placeholders provide format examples ("example@gmail.com")
  - No ambiguity about what to enter

- **Password Requirements**: Visible checklist guides password creation
  - Real-time feedback on password strength
  - Clear list of requirements
  - Visual indicators (checkmarks) show progress

**Location**:
- `src/components/Input/Input.tsx` - Labels and placeholders
- `src/pages/Register/Register.tsx` - Password requirements checklist
- `src/pages/EditProfile/EditProfile.tsx` - Password requirements

#### 2. Contextual Error Messages

- **Specific Error Descriptions**: Errors explain what went wrong and how to fix
  - "Ingrese un correo electrónico válido" (not just "Invalid")
  - "La contraseña debe cumplir con todos los requisitos"
  - "Las contraseñas no coinciden"
  - Actionable guidance, not just error states

- **Inline Error Display**: Errors appear directly with relevant fields
  - No need to search for what went wrong
  - Errors clear when corrected
  - Immediate feedback on fixes

**Location**:
- `src/pages/Register/Register.tsx` - Specific error messages
- `src/pages/Login/Login.tsx` - Contextual error guidance
- `src/components/Input/Input.tsx` - Inline error display

#### 3. ARIA Labels and Descriptions

- **Screen Reader Support**: ARIA attributes provide help for assistive technologies
  - `aria-label` describes button functions
  - `aria-describedby` links fields to help text
  - `role` attributes clarify element purposes
  - Screen readers announce helpful context

- **Accessible Help**: Help information available to all users
  - Visual users see labels and placeholders
  - Screen reader users hear descriptive labels
  - Keyboard users get focus indicators

**Location**:
- `src/pages/VideoConference/VideoConference.tsx` - aria-label on all buttons
- `src/components/Header/Header.tsx` - Navigation aria-labels
- `src/pages/Login/Login.tsx` - Password toggle aria-label

#### 4. Visual Indicators and Icons

- **Status Indicators**: Visual help shows system state
  - Connection status in chat (🟢 connected, 🔴 disconnected)
  - Active page indicator in navigation
  - Loading states show progress
  - Users understand current state without documentation

- **Functional Icons**: Icons provide visual help
  - Eye icon indicates password visibility toggle
  - Navigation icons clarify menu functions
  - Status icons communicate state

**Location**:
- `src/components/ChatRoom/ChatRoom.tsx` - Connection status indicators
- `src/components/Header/Header.tsx` - Navigation indicators
- `src/pages/Login/Login.tsx` - Password toggle icon

#### 5. Form Instructions

- **Field Descriptions**: Forms include helpful instructions
  - "La contraseña debe incluir:" checklist
  - Meeting creation form describes each field
  - Clear guidance on what information is needed

- **Required Field Indicators**: Visual markers show required fields
  - Asterisk (*) indicates required fields
  - `required` attribute provides programmatic indication
  - Users know what's mandatory

**Location**:
- `src/pages/Register/Register.tsx` - Password requirements instructions
- `src/pages/CreateMeeting/CreateMeeting.tsx` - Field descriptions
- All form components mark required fields

#### 6. Helpful Navigation

- **Breadcrumbs and Context**: Users always know where they are
  - Active page highlighted in navigation
  - Page titles clearly indicate current location
  - Footer provides site map for orientation

- **Link Text**: Descriptive link text explains destinations
  - "¿No tiene una cuenta? Crea una" (not just "Register")
  - "¿Olvidó su contraseña?" (not just "Forgot?")
  - Links provide context about where they lead

**Location**:
- `src/components/Header/Header.tsx` - Active page indicators
- `src/pages/Login/Login.tsx` - Descriptive link text
- `src/components/Footer/Footer.tsx` - Site map navigation

### Code Examples

```typescript
// Inline help with password requirements
<div className="register__password-requirements" aria-live="polite">
  <p className="register__password-requirements-title">La contraseña debe incluir:</p>
  <ul>
    <li className={passwordChecks.length ? 'met' : ''}>
      <span>{passwordChecks.length ? '✔' : '•'}</span>
      Al menos 6 caracteres
    </li>
    {/* More requirements with visual feedback */}
  </ul>
</div>

// Contextual error message
<Input
  id="email"
  type="email"
  label="Correo electrónico"
  placeholder="example@gmail.com"  // Helpful example
  error={errors.email}  // Specific error guidance
/>

// ARIA label provides help
<button
  aria-label={isMicOn ? 'Silenciar micrófono' : 'Activar micrófono'}
  onClick={toggleMute}
>
  {/* Icon */}
</button>
```

### Benefits

- **Reduced Learning Curve**: Help available when needed
- **Self-Service**: Users can solve problems without external documentation
- **Accessibility**: Help available to all users, including screen reader users
- **Confidence**: Clear guidance builds user confidence
- **Efficiency**: Contextual help faster than searching documentation

---

## Summary

These seven heuristics work together to create a user-friendly experience:
- **Visibility of System Status** ensures users are always informed about what's happening
- **Error Prevention** reduces the likelihood of errors occurring in the first place
- **Consistency and Standards** makes the interface predictable and easy to learn
- **Recognition rather than Recall** reduces cognitive load by making information visible
- **Flexibility and Efficiency of Use** caters to both novice and expert users
- **Aesthetic and Minimalist Design** focuses attention on essential information
- **Help and Documentation** provides guidance when users need it

All heuristics are implemented throughout the application, with particular emphasis on authentication flows, form submissions, user profile management, and navigation patterns.

---

## References

- Nielsen, J. (1994). *Usability Engineering*. Morgan Kaufmann.
- Nielsen Norman Group: [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/)

