# Chat App Architecture Guide

## 📁 Project Structure

```
frontend/src/
├── components/           # Reusable UI components (presentational)
│   ├── MessageBubble.tsx
│   ├── MessageInput.tsx
│   ├── UserList.tsx
│   └── authHeroSections/
│       ├── LoginHero.tsx
│       └── RegisterHero.tsx
│
├── pages/               # Page components (container/orchestrator)
│   ├── Login.tsx       # Uses useLoginForm hook
│   ├── Register.tsx    # Uses useRegisterForm hook
│   └── Chat.tsx        # Uses useChatManagement hook
│
├── hooks/              # Custom React hooks (business logic)
│   ├── useLoginForm.ts
│   ├── useRegisterForm.ts
│   └── useChatManagement.ts
│
├── services/           # API layer (external communication)
│   ├── authService.ts  # Authentication API calls
│   └── chatService.ts  # Chat API calls
│
├── utils/              # Pure utility functions
│   └── validation.ts   # Form validation helpers
│
├── context/            # Global state management
│   └── AuthContext.tsx
│
├── types/              # TypeScript type definitions
│   └── index.ts
│
├── data/               # Mock/test data
│   └── mockData.ts
│
└── assets/             # Static assets (images, icons)
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
Each layer has a single, well-defined responsibility:

- **Components**: UI rendering only (no business logic)
- **Hooks**: Stateful logic and side effects
- **Services**: API calls and external communication
- **Utils**: Pure functions (no side effects)
- **Pages**: Composition and orchestration

### 2. **Component Types**

#### Presentational Components (`components/`)
- Receive data via props
- No direct API calls or complex state
- Reusable across different pages
- Example: `MessageBubble`, `UserList`

#### Container Components (`pages/`)
- Use custom hooks for logic
- Orchestrate multiple components
- Handle routing
- Example: `Login`, `Chat`

### 3. **Custom Hooks Pattern**

Hooks encapsulate:
- State management
- Form handling
- API calls
- Side effects (useEffect)
- Event handlers

**Benefits:**
- Reusable logic
- Easier testing
- Cleaner components
- Single Responsibility Principle

### 4. **Service Layer**

Services handle all external communication:
```typescript
// services/authService.ts
export const login = async (credentials) => {
  const response = await fetch('/api/login', { ... });
  return response.json();
};
```

**Benefits:**
- Centralized API logic
- Easy to mock for testing
- Can be swapped out (e.g., REST → GraphQL)
- Consistent error handling

## 📋 File Responsibilities

### Pages (Thin Orchestrators)
```typescript
// ✅ GOOD - Page delegates to hooks
const Login = () => {
  const { formData, handleSubmit, ... } = useLoginForm();
  return <form onSubmit={handleSubmit}>...</form>;
};

// ❌ BAD - Page has business logic
const Login = () => {
  const [email, setEmail] = useState('');
  const handleSubmit = (e) => {
    // validation logic
    // API call
    // navigation
  };
  // ...
};
```

### Custom Hooks (Business Logic)
```typescript
// ✅ GOOD - Hook contains all logic
export const useLoginForm = () => {
  const [formData, setFormData] = useState(...);
  const validate = () => { ... };
  const handleSubmit = async () => {
    if (!validate()) return;
    await loginService(formData);
  };
  return { formData, handleSubmit, ... };
};
```

### Services (API Layer)
```typescript
// ✅ GOOD - Service handles API details
export const login = async (credentials) => {
  // Handle auth headers, retries, errors
  const response = await fetch(...);
  return handleResponse(response);
};
```

### Utils (Pure Functions)
```typescript
// ✅ GOOD - Pure function, no side effects
export const validateEmail = (email: string): ValidationResult => {
  return { isValid: emailRegex.test(email), error: ... };
};

// ❌ BAD - Has side effects
export const validateEmail = (email: string) => {
  alert('Invalid email'); // Side effect!
};
```

## 🔄 Data Flow

```
User Action (Component)
       ↓
Event Handler (Hook)
       ↓
Validation (Utils)
       ↓
API Call (Service)
       ↓
State Update (Hook)
       ↓
Re-render (Component)
```

### Example: Sending a Message
```
1. User types & clicks send → MessageInput component
2. onSendMessage prop called → Chat page
3. sendMessage from hook → useChatManagement
4. Validation & API call → chatService.sendMessage()
5. State updated → Hook updates chats array
6. Component re-renders → New message appears
```

## 🎯 Best Practices

### 1. **Component Composition**
```typescript
// ✅ GOOD - Small, focused components
<Chat>
  <UserList />
  <MessageList />
  <MessageInput />
</Chat>

// ❌ BAD - Monolithic component
<Chat>
  {/* 500 lines of JSX */}
</Chat>
```

### 2. **Props vs State**
```typescript
// Props: Data passed from parent
<MessageBubble message={msg} />

// State: Data managed by component/hook
const [messages, setMessages] = useState([]);
```

### 3. **Error Handling**
```typescript
// In hooks
try {
  await service.login(credentials);
} catch (error) {
  setErrors({ email: 'Login failed' });
}

// In services
if (!response.ok) {
  throw new Error('API request failed');
}
```

### 4. **Type Safety**
```typescript
// Define interfaces for all data structures
interface LoginFormData {
  email: string;
  password: string;
}

// Use return types for hooks
interface UseLoginFormReturn {
  formData: LoginFormData;
  handleSubmit: () => Promise<void>;
  // ...
}
```

## 🚀 Adding New Features

### Example: Add "Forgot Password" Feature

1. **Create Service** (`services/authService.ts`)
```typescript
export const resetPassword = async (email: string) => {
  // API call
};
```

2. **Create Hook** (`hooks/useForgotPassword.ts`)
```typescript
export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const handleSubmit = async () => {
    await resetPassword(email);
  };
  return { email, setEmail, handleSubmit };
};
```

3. **Create Page** (`pages/ForgotPassword.tsx`)
```typescript
const ForgotPassword = () => {
  const { email, setEmail, handleSubmit } = useForgotPassword();
  return <form>...</form>;
};
```

4. **Add Route** (`App.tsx`)
```typescript
<Route path="/forgot-password" element={<ForgotPassword />} />
```

## 🧪 Testing Strategy

### Unit Tests
- **Utils**: Test pure functions
- **Hooks**: Test with `@testing-library/react-hooks`
- **Services**: Mock fetch/axios

### Integration Tests
- **Components**: Test with `@testing-library/react`
- **Pages**: Test user flows

### E2E Tests
- Full user journeys (Playwright/Cypress)

## 📊 Performance Optimization

1. **Memoization**
```typescript
const memoizedValue = useMemo(() => computeExpensive(data), [data]);
const memoizedCallback = useCallback(() => doSomething(), []);
```

2. **Code Splitting**
```typescript
const Chat = lazy(() => import('./pages/Chat'));
```

3. **Virtualization**
For long lists, use `react-window` or `react-virtual`

## 🔐 Security Best Practices

1. **Authentication**
   - Use httpOnly cookies for tokens
   - Implement token refresh
   - Handle expired tokens

2. **Input Validation**
   - Client-side validation (UX)
   - Server-side validation (security)
   - Sanitize user input

3. **API Security**
   - Use HTTPS
   - Implement CORS properly
   - Rate limiting

## 📝 Naming Conventions

- **Components**: PascalCase (`MessageBubble.tsx`)
- **Hooks**: camelCase with "use" prefix (`useLoginForm.ts`)
- **Utils**: camelCase (`validation.ts`)
- **Services**: camelCase with "Service" suffix (`authService.ts`)
- **Types**: PascalCase (`User`, `Message`)

## 🔄 State Management Options

### Current: Local State + Hooks
✅ Good for: Small to medium apps
✅ No extra dependencies
✅ Simple to understand

### Future Considerations:

#### Context API
When: Deeply nested prop drilling
```typescript
<AuthContext.Provider>
  <App />
</AuthContext.Provider>
```

#### Zustand / Jotai
When: Complex state, many components need same state
```typescript
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

#### React Query / SWR
When: Heavy server state, caching, real-time updates
```typescript
const { data, isLoading } = useQuery('chats', fetchChats);
```

## 📚 Next Steps

1. **Add Real Backend**
   - Replace mock services with actual API calls
   - Implement authentication tokens
   - WebSocket for real-time chat

2. **Improve UX**
   - Loading states
   - Error boundaries
   - Toast notifications
   - Optimistic updates

3. **Add Features**
   - File uploads
   - Read receipts
   - Typing indicators
   - Search/filter chats

4. **Testing**
   - Unit tests for hooks/utils
   - Integration tests for pages
   - E2E tests for critical flows

5. **Performance**
   - Lazy loading
   - Image optimization
   - Bundle size analysis

## 🎓 Learning Resources

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Remember**: Keep components small, hooks focused, services thin, and utilities pure!
