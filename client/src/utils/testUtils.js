// Test utilities and mocks
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock for axios/api calls
export const mockApiResponse = (data, status = 200) => {
  return Promise.resolve({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  });
};

export const mockApiError = (message = 'API Error', status = 400) => {
  const error = new Error(message);
  error.response = {
    status,
    data: { error: message },
  };
  return Promise.reject(error);
};

// Mock user data for testing
export const mockUser = {
  id: 1,
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  conversations: [
    {
      id: 1,
      title: 'Test Conversation',
      messages: [
        {
          id: 1,
          role: 'user',
          content: 'Hello',
          conversationId: 1,
        },
        {
          id: 2,
          role: 'assistant',
          content: 'Hi there! How can I help you?',
          conversationId: 1,
        },
      ],
    },
    {
      id: 2,
      title: 'Another Chat',
      messages: [],
    },
  ],
};

// Mock conversation
export const mockConversation = {
  id: 1,
  title: 'Test Conversation',
  messages: [
    {
      id: 1,
      role: 'user',
      content: 'Test message',
      conversationId: 1,
    },
  ],
};

// Mock AuthContext provider for testing
export const MockAuthProvider = ({ children, mockValues = {} }) => {
  const defaultValues = {
    userData: null,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
    isAuthenticated: false,
    ...mockValues,
  };

  // We'll need to import the actual AuthContext here
  const { AuthContext } = require('../contexts/AuthContext');
  
  return (
    <AuthContext.Provider value={defaultValues}>
      {children}
    </AuthContext.Provider>
  );
};

export { render, screen, fireEvent, waitFor };

// Export userEvent as a module object with setup method
export { default as userEvent } from '@testing-library/user-event';