import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.push(action.payload);
    },
    updateConversation: (state, action) => {
      const { id, ...updates } = action.payload;
      const conversation = state.conversations.find(conv => conv.id === id);
      if (conversation) {
        Object.assign(conversation, updates);
        // Update currentConversation if it's the one being updated
        if (state.currentConversation?.id === id) {
          state.currentConversation = { ...state.currentConversation, ...updates };
        }
      }
    },
    deleteConversation: (state, action) => {
      const conversationId = action.payload;
      state.conversations = state.conversations.filter(conv => conv.id !== conversationId);
      // Clear current conversation if it was deleted
      if (state.currentConversation?.id === conversationId) {
        state.currentConversation = state.conversations[0] || null;
      }
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      if (conversation) {
        if (!conversation.messages) {
          conversation.messages = [];
        }
        conversation.messages.push(message);
        // Update current conversation if it's the active one
        if (state.currentConversation?.id === conversationId) {
          if (!state.currentConversation.messages) {
            state.currentConversation.messages = [];
          }
          state.currentConversation.messages.push(message);
        }
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateConversation,
  deleteConversation,
  setCurrentConversation,
  addMessage,
  setLoading,
  setError,
  clearError,
} = conversationsSlice.actions;

// Selectors
export const selectConversations = (state) => state.conversations.conversations;
export const selectCurrentConversation = (state) => state.conversations.currentConversation;
export const selectConversationsLoading = (state) => state.conversations.loading;
export const selectConversationsError = (state) => state.conversations.error;

export default conversationsSlice.reducer;