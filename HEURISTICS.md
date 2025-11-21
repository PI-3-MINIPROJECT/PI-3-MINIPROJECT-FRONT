# Usability Heuristics Implementation

This document describes the two Nielsen's Usability Heuristics implemented in the VideoConference Platform frontend for Sprint 1.

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

## Summary

These two heuristics work together to create a user-friendly experience:
- **Visibility of System Status** ensures users are always informed about what's happening
- **Error Prevention** reduces the likelihood of errors occurring in the first place

Both heuristics are implemented throughout the application, with particular emphasis on authentication flows, form submissions, and user profile management.

---

## References

- Nielsen, J. (1994). *Usability Engineering*. Morgan Kaufmann.
- Nielsen Norman Group: [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/)

