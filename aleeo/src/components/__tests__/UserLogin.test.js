import React from 'react';
import { render, screen, waitFor, userEvent } from '../../__tests__/testUtils';
import UserLogin from '../UserLogin';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the API utilities
jest.mock('../../utility/apiUtils', () => ({
  userLogin: jest.fn(),
  createNewUser: jest.fn(),
  checkCurrentUser: jest.fn(),
  logout: jest.fn(),
}));

// Mock the logo import
jest.mock('../../assets/aleeo_logo.png', () => 'mock-logo.png');

// Mock ChatInterface component
jest.mock('../ChatInterface', () => {
  return function MockChatInterface({ userData, onLogout }) {
    return (
      <div data-testid="chat-interface">
        <span>Chat for {userData?.firstName}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  };
});

const { userLogin, createNewUser } = require('../../utility/apiUtils');

describe('UserLogin Component', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();

  const renderWithAuthContext = (authValues = {}) => {
    const defaultAuthValues = {
      userData: null,
      login: mockLogin,
      logout: mockLogout,
      loading: false,
      isAuthenticated: false,
      ...authValues,
    };

    return render(
      <AuthContext.Provider value={defaultAuthValues}>
        <UserLogin />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('displays loading message when loading is true', () => {
      renderWithAuthContext({ loading: true });
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Authentication States', () => {
    it('displays chat interface when user is authenticated', () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
      };

      renderWithAuthContext({
        userData: mockUser,
        isAuthenticated: true,
      });

      expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
      expect(screen.getByText('Chat for John')).toBeInTheDocument();
    });

    it('displays login form when user is not authenticated', () => {
      renderWithAuthContext({ isAuthenticated: false });

      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('Sign In Form', () => {
    it('renders sign in form by default', () => {
      renderWithAuthContext();

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('allows user to input username and password', async () => {
      renderWithAuthContext();

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = screen.getByPlaceholderText('Password');

      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'testpassword');

      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('testpassword');
    });

    it('calls userLogin API when sign in form is submitted', async () => {
      const mockUserData = { id: 1, username: 'testuser' };
      userLogin.mockResolvedValue(mockUserData);
      
      renderWithAuthContext();

      await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
      await userEvent.type(screen.getByPlaceholderText('Password'), 'testpassword');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(userLogin).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'testpassword',
          remember_me: false,
        });
      });

      expect(mockLogin).toHaveBeenCalledWith(mockUserData);
    });

    it('switches to create account form when Create Account link is clicked', async () => {
      renderWithAuthContext();

      await userEvent.click(screen.getByText('Create Account'));

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });
  });

  describe('Create Account Form', () => {
    const setupCreateAccountForm = async () => {
      renderWithAuthContext();
      await userEvent.click(screen.getByText('Create Account'));
    };

    it('renders create account form with all fields', async () => {
      await setupCreateAccountForm();

      expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText('Password')).toHaveLength(2);
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('allows user to input all required fields', async () => {
      await setupCreateAccountForm();

      await userEvent.type(screen.getByPlaceholderText('First name'), 'John');
      await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
      await userEvent.type(screen.getByPlaceholderText('Email'), 'john@example.com');
      
      const passwordInputs = screen.getAllByPlaceholderText('Password');
      await userEvent.type(passwordInputs[0], 'password123');
      await userEvent.type(passwordInputs[1], 'password123');

      expect(screen.getByPlaceholderText('First name')).toHaveValue('John');
      expect(screen.getByPlaceholderText('Last Name')).toHaveValue('Doe');
      expect(screen.getByPlaceholderText('Email')).toHaveValue('john@example.com');
      expect(passwordInputs[0]).toHaveValue('password123');
      expect(passwordInputs[1]).toHaveValue('password123');
    });

    it('validates required fields and shows errors', async () => {
      await setupCreateAccountForm();

      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('validates password length', async () => {
      await setupCreateAccountForm();

      await userEvent.type(screen.getByPlaceholderText('First name'), 'John');
      await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
      await userEvent.type(screen.getByPlaceholderText('Email'), 'john@example.com');
      
      const passwordInputs = screen.getAllByPlaceholderText('Password');
      await userEvent.type(passwordInputs[0], '123');

      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
      });
    });

    it('validates password confirmation match', async () => {
      await setupCreateAccountForm();

      await userEvent.type(screen.getByPlaceholderText('First name'), 'John');
      await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
      await userEvent.type(screen.getByPlaceholderText('Email'), 'john@example.com');
      
      const passwordInputs = screen.getAllByPlaceholderText('Password');
      await userEvent.type(passwordInputs[0], 'password123');
      await userEvent.type(passwordInputs[1], 'different123');

      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('calls createNewUser API when form is submitted with valid data', async () => {
      const mockUserData = { id: 1, username: 'john@example.com' };
      createNewUser.mockResolvedValue(mockUserData);
      
      await setupCreateAccountForm();

      await userEvent.type(screen.getByPlaceholderText('First name'), 'John');
      await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
      await userEvent.type(screen.getByPlaceholderText('Email'), 'john@example.com');
      
      const passwordInputs = screen.getAllByPlaceholderText('Password');
      await userEvent.type(passwordInputs[0], 'password123');
      await userEvent.type(passwordInputs[1], 'password123');

      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(createNewUser).toHaveBeenCalledWith({
          first_name: 'John',
          last_name: 'Doe',
          username: 'john@example.com',
          password: 'password123',
          confirm_password: 'password123',
        });
      });

      expect(mockLogin).toHaveBeenCalledWith(mockUserData);
    });

    it('switches back to sign in form when Back to Sign In link is clicked', async () => {
      await setupCreateAccountForm();

      await userEvent.click(screen.getByText('Back to Sign In'));

      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('Logo Display', () => {
    it('displays logo when user is not authenticated', () => {
      renderWithAuthContext({ isAuthenticated: false });

      const logo = screen.getByAltText('Aleeo Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'mock-logo.png');
    });

    it('does not display logo when user is authenticated', () => {
      const mockUser = { id: 1, firstName: 'John' };
      renderWithAuthContext({
        userData: mockUser,
        isAuthenticated: true,
      });

      expect(screen.queryByAltText('Aleeo Logo')).not.toBeInTheDocument();
    });
  });
});