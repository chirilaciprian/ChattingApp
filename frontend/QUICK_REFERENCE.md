# Architecture Quick Reference

## 🔄 Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (src/components/ & src/pages/)              │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐                     │
│  │ Login.tsx│  │Register.tsx│  │ Chat.tsx │                     │
│  └────┬─────┘  └─────┬──────┘  └────┬─────┘                     │
│       │              │              │                            │
│       │  Uses Hooks  │              │                            │
└───────┼──────────────┼──────────────┼────────────────────────────┘
        │              │              │
        ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LOGIC LAYER (src/hooks/)                                       │
│  ┌──────────────┐ ┌────────────────┐ ┌──────────────────┐      │
│  │useLoginForm()│ │useRegisterForm()│ │useChatManagement()│      │
│  └──────┬───────┘ └────────┬────────┘ └────────┬─────────┘      │
│         │                  │                    │                │
│         │  Calls Services  │                    │                │
└─────────┼──────────────────┼────────────────────┼────────────────┘
          │                  │                    │
          ▼                  ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  SERVICE LAYER (src/services/)                                  │
│  ┌────────────────┐                ┌───────────────┐            │
│  │ authService.ts │                │chatService.ts │            │
│  ├────────────────┤                ├───────────────┤            │
│  │ • login()      │                │ • sendMessage()│           │
│  │ • register()   │                │ • fetchChats()│            │
│  │ • logout()     │                │ • markAsRead()│            │
│  └────────┬───────┘                └───────┬───────┘            │
└───────────┼────────────────────────────────┼────────────────────┘
            │                                │
            ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  EXTERNAL LAYER (Future: Backend API)                           │
│  ┌──────────────────────────────────────────────────┐           │
│  │  POST /api/auth/login                            │           │
│  │  POST /api/auth/register                         │           │
│  │  POST /api/messages/send                         │           │
│  │  GET  /api/chats                                 │           │
│  │  WebSocket connection for real-time updates     │           │
│  └──────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘

        ┌──────────────────────────────────────────┐
        │  UTILITY LAYER (src/utils/)              │
        │  Used by: Hooks, Components              │
        │  ┌────────────────┐                      │
        │  │ validation.ts  │                      │
        │  ├────────────────┤                      │
        │  │ • validateEmail()                     │
        │  │ • validatePassword()                  │
        │  │ • validateUsername()                  │
        │  │ • validatePasswordMatch()             │
        │  └────────────────┘                      │
        └──────────────────────────────────────────┘
```

## 📦 Layer Responsibilities

### 1️⃣ Presentation Layer (Components & Pages)
**Responsibility**: Render UI and handle user interactions

```typescript
// Example: Login.tsx
const Login = () => {
  const { formData, handleSubmit } = useLoginForm();
  return <form onSubmit={handleSubmit}>...</form>;
};
```

**Rules:**
- ✅ Render JSX
- ✅ Call hook methods
- ✅ Handle DOM events
- ❌ NO business logic
- ❌ NO API calls
- ❌ NO validation logic

---

### 2️⃣ Logic Layer (Custom Hooks)
**Responsibility**: Manage state and business logic

```typescript
// Example: useLoginForm.ts
export const useLoginForm = () => {
  const [formData, setFormData] = useState({...});
  const handleSubmit = async () => {
    await authService.login(formData);
  };
  return { formData, handleSubmit };
};
```

**Rules:**
- ✅ State management
- ✅ Event handlers
- ✅ Call services
- ✅ Call utils
- ✅ Side effects (useEffect)
- ❌ NO JSX
- ❌ NO direct API calls (use services)

---

### 3️⃣ Service Layer (API Communication)
**Responsibility**: Handle all external communication

```typescript
// Example: authService.ts
export const login = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  return response.json();
};
```

**Rules:**
- ✅ API calls (fetch/axios)
- ✅ Error handling
- ✅ Response transformation
- ❌ NO state management
- ❌ NO UI logic

---

### 4️⃣ Utility Layer (Pure Functions)
**Responsibility**: Reusable helper functions

```typescript
// Example: validation.ts
export const validateEmail = (email: string) => {
  return emailRegex.test(email);
};
```

**Rules:**
- ✅ Pure functions
- ✅ No side effects
- ✅ Deterministic (same input = same output)
- ❌ NO state
- ❌ NO API calls
- ❌ NO hooks

---

## 🎯 Real-World Example: Login Flow

```
1. USER types email & password
   └─> Login.tsx (Component)
   
2. USER clicks "Sign In"
   └─> handleSubmit from useLoginForm() (Hook)
   
3. HOOK validates input
   └─> validateEmail() from validation.ts (Util)
   
4. HOOK calls API
   └─> authService.login() (Service)
   
5. SERVICE makes HTTP request
   └─> POST /api/auth/login (Backend)
   
6. SERVICE returns response
   └─> Back to Hook
   
7. HOOK updates state
   └─> formData, isLoading, errors
   
8. COMPONENT re-renders
   └─> Show success/error, navigate
```

## 🔀 File Dependency Graph

```
Login.tsx
  │
  ├─> useLoginForm.ts
  │     │
  │     ├─> authService.ts
  │     │     └─> Backend API
  │     │
  │     └─> validation.ts
  │
  └─> LoginHero.tsx

Register.tsx
  │
  ├─> useRegisterForm.ts
  │     │
  │     ├─> authService.ts
  │     │     └─> Backend API
  │     │
  │     └─> validation.ts
  │
  └─> RegisterHero.tsx

Chat.tsx
  │
  ├─> useChatManagement.ts
  │     └─> chatService.ts
  │           └─> Backend API
  │
  ├─> UserList.tsx
  ├─> MessageBubble.tsx
  └─> MessageInput.tsx
```

## 🏗️ Adding New Features: Step-by-Step

### Example: Add "Forgot Password"

```
Step 1: Create Service
  src/services/authService.ts
  + export const forgotPassword = async (email) => { ... }

Step 2: Create Hook
  src/hooks/useForgotPassword.ts
  + export const useForgotPassword = () => { ... }

Step 3: Create Page
  src/pages/ForgotPassword.tsx
  + const ForgotPassword = () => { ... }

Step 4: Add Route
  src/App.tsx
  + <Route path="/forgot-password" element={<ForgotPassword />} />

Step 5: Link from Login
  src/pages/Login.tsx
  + <Link to="/forgot-password">Forgot Password?</Link>
```

## 📊 Code Organization Metrics

### Before Refactoring
```
Login.tsx:        150 lines (100% business logic + UI)
Register.tsx:     203 lines (100% business logic + UI)
Chat.tsx:         130 lines (100% business logic + UI)
Reusable logic:   0 files
Service layer:    0 files
Validation:       Inline (repeated)
```

### After Refactoring
```
Login.tsx:        145 lines (10% logic, 90% UI)
Register.tsx:     180 lines (10% logic, 90% UI)
Chat.tsx:         85 lines (5% logic, 95% UI)

+ hooks/useLoginForm.ts:        110 lines (business logic)
+ hooks/useRegisterForm.ts:     145 lines (business logic)
+ hooks/useChatManagement.ts:   95 lines (business logic)
+ services/authService.ts:      90 lines (API layer)
+ services/chatService.ts:      75 lines (API layer)
+ utils/validation.ts:          85 lines (pure functions)
```

**Result:**
- ✅ Better separation of concerns
- ✅ Reusable logic (3 hooks + utils)
- ✅ Easier to test
- ✅ Easier to maintain

## 🎓 Key Takeaways

1. **Pages = Thin Orchestrators**
   - Just compose and render
   - Delegate logic to hooks

2. **Hooks = Business Logic**
   - State management
   - Event handlers
   - Orchestrate services

3. **Services = External Communication**
   - API calls only
   - No state or UI logic

4. **Utils = Pure Functions**
   - No side effects
   - Reusable everywhere

5. **One-Way Data Flow**
   ```
   Component → Hook → Service → API
   API → Service → Hook → Component (re-render)
   ```

---

**Remember**: When in doubt, ask yourself:
- "Is this UI rendering?" → Component
- "Is this business logic?" → Hook
- "Is this an API call?" → Service
- "Is this a helper function?" → Util

Keep it simple, keep it clean! 🧹✨
