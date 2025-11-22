import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';

import authReducer from './slices/authSlice';
import conversationsReducer from './slices/conversationsSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

// Separate persist config for conversations (optional - you might want to persist this too)
const conversationsPersistConfig = {
  key: 'conversations',
  storage,
  whitelist: ['conversations', 'currentConversation'], // Persist conversations and current conversation
};

// Root reducer
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  conversations: persistReducer(conversationsPersistConfig, conversationsReducer),
});

// Configure store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production' && composeWithDevTools({
    name: 'Aleeo Chat App',
    trace: true,
    traceLimit: 25,
  }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;