# Redux Store Implementation

This document explains the Redux store setup for persistent authentication in your React application.

## Overview

The Redux store has been implemented with the following features:
- **Authentication State Management**: Tracks user login state, user data, loading states, and errors
- **Conversation State Management**: Manages conversations, current conversation, and messages
- **State Persistence**: Uses Redux Persist to save authentication state to localStorage
- **Async Actions**: Uses Redux Toolkit's createAsyncThunk for API calls

## Store Structure

```
src/
├── store/
│   ├── index.js              # Store configuration with persistence
│   ├── hooks.js              # Custom hooks for typed dispatch/selectors
│   ├── slices/
│   │   ├── authSlice.js      # Authentication state management
│   │   └── conversationsSlice.js # Conversations state management
│   └── thunks/
│       └── authThunks.js     # Async actions for API calls
```

## Features Implemented

### 1. Authentication Slice (`authSlice.js`)
- **State**: `isAuthenticated`, `user`, `loading`, `error`
- **Actions**: `loginStart`, `loginSuccess`, `loginFailure`, `logout`, `clearError`, `updateUser`
- **Selectors**: Pre-built selectors for easy access to auth state

### 2. Conversations Slice (`conversationsSlice.js`)
- **State**: `conversations`, `currentConversation`, `loading`, `error`
- **Actions**: `setConversations`, `addConversation`, `updateConversation`, `deleteConversation`, `setCurrentConversation`, `addMessage`

### 3. Async Thunks (`authThunks.js`)
- `loginUser`: Handles user authentication
- `createNewConversation`: Creates new conversations
- `sendMessage`: Sends messages and handles responses
- `renameConversationThunk`: Renames conversations
- `deleteConversationThunk`: Deletes conversations

### 4. Persistence Setup
- **Auth State**: Persisted to localStorage (stays logged in across sessions)
- **Conversations**: Also persisted to maintain conversation history
- **Whitelist Configuration**: Only specified state slices are persisted

## Usage

### Authentication
```javascript
import { useAuth } from '../store/hooks';
import { loginUser } from '../store/thunks/authThunks';
import { logout } from '../store/slices/authSlice';

// In your component
const { isAuthenticated, user, loading, error } = useAuth();
const dispatch = useAppDispatch();

// Login
dispatch(loginUser({ username: 'user', password: 'pass' }));

// Logout
dispatch(logout());
```

### Conversations
```javascript
import { useConversations } from '../store/hooks';
import { createNewConversation, sendMessage } from '../store/thunks/authThunks';

// In your component
const { conversations, currentConversation } = useConversations();

// Create conversation
dispatch(createNewConversation({ user_id: userId, title: 'New Chat' }));

// Send message
dispatch(sendMessage({ 
  messageData: { role: 'user', content: 'Hello', conversation_id: convId },
  conversationId: convId 
}));
```

## Components Updated

### 1. `App.js`
- Added Redux Provider
- Added PersistGate for loading state during rehydration

### 2. `UserLogin.jsx`
- Integrated with Redux for authentication state
- Uses `loginUser` thunk instead of direct API calls
- Automatically renders ChatInterface when authenticated

### 3. `ChatInterface.jsx`
- Completely refactored to use Redux for state management
- All conversation operations now go through Redux
- Added logout button functionality

### 4. `LogoutButton.jsx` (New Component)
- Reusable logout button component
- Dispatches logout action when clicked

## Benefits

1. **Persistent Authentication**: Users stay logged in across browser sessions
2. **Centralized State**: All application state is managed in one place
3. **Better Performance**: Optimized re-renders and state updates
4. **Debugging**: Redux DevTools for easier debugging
5. **Scalability**: Easy to add new features and state management
6. **Type Safety**: Prepared for TypeScript migration if needed

## Next Steps

To further enhance the Redux setup, consider:

1. **Error Handling**: Add more sophisticated error handling and user feedback
2. **Loading States**: Add loading indicators throughout the app
3. **Optimistic Updates**: Implement optimistic updates for better UX
4. **Real-time Updates**: Integration with WebSockets for real-time features
5. **User Registration**: Add user registration thunk and slice
6. **Middleware**: Add custom middleware for logging, analytics, etc.

## Testing

The application is now ready for testing. You should notice:
- Login state persists across browser refreshes
- Conversations are maintained in Redux state
- Logout functionality clears all state
- All async operations are handled properly with loading states

Start the development server with `npm start` and test the authentication flow!