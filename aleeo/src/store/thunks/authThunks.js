import { createAsyncThunk } from '@reduxjs/toolkit';
import { userLogin, createConversation, createMessage, renameConversation, deleteConversation } from '../../utility/apiUtils';
import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';
import { setConversations, addConversation, updateConversation, deleteConversation as deleteConversationAction, addMessage, setLoading, setError } from '../slices/conversationsSlice';

// Auth thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());
      const userData = await userLogin(credentials);
      if (userData) {
        dispatch(loginSuccess(userData));
        // Set conversations in the store
        if (userData.conversations) {
          dispatch(setConversations(userData.conversations));
        }
        return userData;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Conversation thunks
export const createNewConversation = createAsyncThunk(
  'conversations/createConversation',
  async (conversationData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const newConversation = await createConversation(conversationData);
      if (newConversation) {
        dispatch(addConversation(newConversation));
        dispatch(setLoading(false));
        return newConversation;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create conversation';
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      return rejectWithValue(errorMessage);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'conversations/sendMessage',
  async ({ messageData, conversationId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await createMessage(messageData);
      if (response && response.assistantMessage) {
        // Add user message
        dispatch(addMessage({ conversationId, message: messageData }));
        // Add assistant response
        dispatch(addMessage({ 
          conversationId, 
          message: {
            role: 'assistant',
            content: response.assistantMessage.content,
            conversation_id: conversationId
          }
        }));
        return response;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const renameConversationThunk = createAsyncThunk(
  'conversations/renameConversation',
  async ({ conversationId, newTitle }, { dispatch, rejectWithValue }) => {
    try {
      const response = await renameConversation(conversationId, newTitle);
      if (response) {
        dispatch(updateConversation({ id: conversationId, title: newTitle }));
        return response;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to rename conversation';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteConversationThunk = createAsyncThunk(
  'conversations/deleteConversation',
  async (conversationId, { dispatch, rejectWithValue }) => {
    try {
      await deleteConversation(conversationId);
      dispatch(deleteConversationAction(conversationId));
      return conversationId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete conversation';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);