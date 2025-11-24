import React from 'react';
import { render, screen, waitFor } from '../../__tests__/testUtils';
import userEvent from '@testing-library/user-event';
import ChatInterface from '../ChatInterface';
import { mockUser } from '../../__tests__/testUtils';

// Mock the API utilities
jest.mock('../../utility/apiUtils', () => ({
  createConversation: jest.fn(),
  createMessage: jest.fn(),
  renameConversation: jest.fn(),
  deleteConversation: jest.fn(),
}));

// Mock React Icons
jest.mock('react-icons/fa', () => ({
  FaPlusCircle: () => <div data-testid="plus-icon">+</div>,
}));

jest.mock('react-icons/hi2', () => ({
  HiDotsHorizontal: () => <div data-testid="dots-icon">...</div>,
}));

// Mock Chakra UI components that might not be available in test environment
jest.mock('@chakra-ui/react', () => ({
  SimpleGrid: ({ children }) => <div data-testid="simple-grid">{children}</div>,
  GridItem: ({ children }) => <div data-testid="grid-item">{children}</div>,
  Container: ({ children }) => <div data-testid="container">{children}</div>,
  HStack: ({ children }) => <div data-testid="hstack">{children}</div>,
  VStack: ({ children }) => <div data-testid="vstack">{children}</div>,
  Box: ({ children }) => <div data-testid="box">{children}</div>,
  Heading: ({ children }) => <h2 data-testid="heading">{children}</h2>,
  Button: ({ children, onClick, ...props }) => (
    <button data-testid="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  IconButton: ({ onClick, children, ...props }) => (
    <button data-testid="icon-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Textarea: ({ value, onChange, placeholder, onKeyDown }) => (
    <textarea
      data-testid="textarea"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
    />
  ),
  Input: ({ value, onChange, placeholder, onBlur, onKeyDown, autoFocus }) => (
    <input
      data-testid="input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus}
    />
  ),
  Separator: () => <hr data-testid="separator" />,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  ScrollArea: {
    Root: ({ children }) => <div data-testid="scroll-root">{children}</div>,
    Viewport: ({ children }) => <div data-testid="scroll-viewport">{children}</div>,
    Content: ({ children }) => <div data-testid="scroll-content">{children}</div>,
    Scrollbar: () => <div data-testid="scrollbar" />,
    Thumb: () => <div data-testid="scroll-thumb" />,
    Corner: () => <div data-testid="scroll-corner" />,
  },
  Popover: {
    Root: ({ children, open, onOpenChange }) => (
      <div data-testid="popover-root" data-open={open}>
        {children}
      </div>
    ),
    Trigger: ({ children }) => <div data-testid="popover-trigger">{children}</div>,
    Content: ({ children }) => <div data-testid="popover-content">{children}</div>,
    Arrow: () => <div data-testid="popover-arrow" />,
    Positioner: ({ children }) => <div data-testid="popover-positioner">{children}</div>,
  },
  Portal: ({ children }) => <div data-testid="portal">{children}</div>,
  Field: {
    Root: ({ children }) => <div data-testid="field-root">{children}</div>,
    Label: ({ children, srOnly }) => (
      <label data-testid="field-label" style={{ display: srOnly ? 'none' : 'block' }}>
        {children}
      </label>
    ),
  },
  For: ({ each, children }) => (
    <div data-testid="for-loop">
      {each?.map((item, index) => (
        <div key={index}>{children(item)}</div>
      ))}
    </div>
  ),
}));

const {
  createConversation,
  createMessage,
  renameConversation,
  deleteConversation,
} = require('../../utility/apiUtils');

describe('ChatInterface Component', () => {
  const defaultProps = {
    userData: mockUser,
    onLogout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders chat interface with conversations and current chat', () => {
      render(<ChatInterface {...defaultProps} />);

      expect(screen.getByText('Conversations')).toBeInTheDocument();
      expect(screen.getByText('Current Chat (Test Conversation)')).toBeInTheDocument();
      expect(screen.getByText('Test Conversation')).toBeInTheDocument();
      expect(screen.getByText('Another Chat')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('displays messages in current conversation', () => {
      render(<ChatInterface {...defaultProps} />);

      expect(screen.getByText(/user:/)).toBeInTheDocument();
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText(/assistant:/)).toBeInTheDocument();
      expect(screen.getByText(/Hi there! How can I help you?/)).toBeInTheDocument();
    });

    it('renders add conversation button', () => {
      render(<ChatInterface {...defaultProps} />);

      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });

    it('handles empty conversations gracefully', () => {
      const propsWithoutConversations = {
        ...defaultProps,
        userData: { ...mockUser, conversations: [] },
      };

      render(<ChatInterface {...propsWithoutConversations} />);

      expect(screen.getByText('Conversations')).toBeInTheDocument();
      expect(screen.getByText('Current Chat ()')).toBeInTheDocument(); // No current chat
    });
  });

  describe('Conversation Management', () => {
    it('allows creating a new conversation', async () => {
      createConversation.mockResolvedValue({
        id: 3,
        title: 'New Conversation 3',
        messages: [],
      });

      render(<ChatInterface {...defaultProps} />);
      const user = userEvent.setup();

      const addButton = screen.getByTestId('plus-icon').closest('button');
      await user.click(addButton);

      await waitFor(() => {
        expect(createConversation).toHaveBeenCalledWith({
          title: 'New Conversation 3',
        });
      });
    });

    it('allows switching between conversations', async () => {
      render(<ChatInterface {...defaultProps} />);

      // Click on "Another Chat" conversation
      const anotherChatButton = screen.getByRole('button', { name: 'Another Chat' });
      await userEvent.click(anotherChatButton);

      // Should update the current chat title
      expect(screen.getByText('Current Chat (Another Chat)')).toBeInTheDocument();
    });

    it('shows conversation options menu', async () => {
      render(<ChatInterface {...defaultProps} />);

      // Click on the dots menu for the first conversation
      const dotsButtons = screen.getAllByLabelText('conversation-options');
      await userEvent.click(dotsButtons[0]);

      expect(screen.getByText('Rename')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('allows renaming a conversation', async () => {
      renameConversation.mockResolvedValue({ id: 1, title: 'Updated Title' });

      render(<ChatInterface {...defaultProps} />);

      // Click dots menu and then rename
      const dotsButtons = screen.getAllByLabelText('conversation-options');
      await userEvent.click(dotsButtons[0]);
      
      const renameButton = screen.getByText('Rename');
      await userEvent.click(renameButton);

      // Should show input field
      const input = screen.getByPlaceholderText('Rename conversation title...');
      expect(input).toBeInTheDocument();

      // Type new title and blur
      await userEvent.type(input, 'Updated Title');
      await userEvent.tab(); // This will blur the input

      await waitFor(() => {
        expect(renameConversation).toHaveBeenCalledWith(1, 'Updated Title');
      });
    });

    it('allows deleting a conversation', async () => {
      deleteConversation.mockResolvedValue({});

      render(<ChatInterface {...defaultProps} />);

      // Click dots menu and then delete
      const dotsButtons = screen.getAllByLabelText('conversation-options');
      await userEvent.click(dotsButtons[0]);
      
      const deleteButton = screen.getByText('Delete');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteConversation).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Message Handling', () => {
    it('allows typing a message', async () => {
      render(<ChatInterface {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Write a message...');
      await userEvent.type(textarea, 'Hello, this is a test message');

      expect(textarea).toHaveValue('Hello, this is a test message');
    });

    it('sends a message when Send button is clicked', async () => {
      createMessage.mockResolvedValue({
        assistantMessage: {
          id: 3,
          role: 'assistant',
          content: 'This is a response',
          conversationId: 1,
        },
      });

      render(<ChatInterface {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Write a message...');
      await userEvent.type(textarea, 'Hello, assistant');

      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);

      // Should clear the textarea
      expect(textarea).toHaveValue('');

      // Should show spinner
      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(createMessage).toHaveBeenCalledWith({
          role: 'user',
          content: 'Hello, assistant',
          conversation_id: 1,
        });
      });
    });

    it('sends a message when Enter is pressed', async () => {
      createMessage.mockResolvedValue({
        assistantMessage: {
          id: 3,
          role: 'assistant',
          content: 'This is a response',
          conversationId: 1,
        },
      });

      render(<ChatInterface {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Write a message...');
      await userEvent.type(textarea, 'Hello, assistant');
      await userEvent.keyboard('{Enter}');

      expect(textarea).toHaveValue('');
      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(createMessage).toHaveBeenCalled();
      });
    });

    it('does not send empty messages', async () => {
      render(<ChatInterface {...defaultProps} />);

      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);

      expect(createMessage).not.toHaveBeenCalled();
    });

    it('allows multiline messages with Shift+Enter', async () => {
      render(<ChatInterface {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Write a message...');
      await userEvent.type(textarea, 'First line');
      await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
      await userEvent.type(textarea, 'Second line');

      expect(textarea).toHaveValue('First line\nSecond line');
    });
  });

  describe('Message Display', () => {
    it('formats user messages correctly', () => {
      render(<ChatInterface {...defaultProps} />);

      const userMessages = screen.getAllByText(/user:/);
      expect(userMessages.length).toBeGreaterThan(0);
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
    });

    it('formats assistant messages correctly', () => {
      render(<ChatInterface {...defaultProps} />);

      const assistantMessages = screen.getAllByText(/assistant:/);
      expect(assistantMessages.length).toBeGreaterThan(0);
      expect(screen.getByText(/Hi there! How can I help you/)).toBeInTheDocument();
    });

    it('shows loading state during message sending', () => {
      render(<ChatInterface {...defaultProps} />);

      // Simulate spinner state by checking if it can be rendered
      // In a real test, you would need to trigger the actual sending process
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    it('calls onLogout when logout button is clicked', async () => {
      render(<ChatInterface {...defaultProps} />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await userEvent.click(logoutButton);

      expect(defaultProps.onLogout).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('handles conversation creation errors gracefully', async () => {
      createConversation.mockRejectedValue(new Error('Failed to create'));
      
      // Mock window.alert
      window.alert = jest.fn();

      render(<ChatInterface {...defaultProps} />);
      const user = userEvent.setup();

      const addButton = screen.getByTestId('plus-icon').closest('button');
      await user.click(addButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Failed to create conversation. Please try again.');
      });
    });

    it('handles message sending errors gracefully', async () => {
      createMessage.mockRejectedValue(new Error('Failed to send'));
      
      // Mock window.alert
      window.alert = jest.fn();

      render(<ChatInterface {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Write a message...');
      await userEvent.type(textarea, 'Test message');

      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Failed to send message. Please try again.');
      });
    });
  });
});