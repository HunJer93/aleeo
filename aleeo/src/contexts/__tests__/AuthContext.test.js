import React from 'react';
import { render, screen, waitFor, userEvent } from '../../__tests__/testUtils';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock the API utilities
jest.mock('../../utility/apiUtils', () => ({
  checkCurrentUser: jest.fn(),
  logout: jest.fn(),
}));

const { checkCurrentUser, logout: apiLogout } = require('../../utility/apiUtils');

// Test component that uses the auth context
const TestComponent = () => {
  const { userData, login, logout, loading, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="user-data">
        {userData ? JSON.stringify(userData) : 'null'}
      </div>
      <button data-testid="login-btn" onClick={() => login({ id: 1, name: 'Test' })}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('useAuth hook', () => {
    it('throws error when used outside AuthProvider', () => {
      // Temporarily disable console.error to avoid error logs in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('AuthProvider', () => {
    const renderWithAuthProvider = () => {
      return render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    };

    it('starts with loading state and no user data', () => {
      checkCurrentUser.mockResolvedValue(null);
      
      renderWithAuthProvider();

      expect(screen.getByTestId('loading')).toHaveTextContent('true');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user-data')).toHaveTextContent('null');
    });

    it('loads user from localStorage if available', async () => {
      const storedUser = { id: 1, firstName: 'John', username: 'john' };
      localStorage.setItem('userData', JSON.stringify(storedUser));
      checkCurrentUser.mockResolvedValue(storedUser);

      renderWithAuthProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user-data')).toHaveTextContent(JSON.stringify(storedUser));
    });

    it('verifies user with server and updates state', async () => {
      const serverUser = { id: 1, firstName: 'John', username: 'john', verified: true };
      checkCurrentUser.mockResolvedValue(serverUser);

      renderWithAuthProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(checkCurrentUser).toHaveBeenCalled();
      expect(screen.getByTestId('user-data')).toHaveTextContent(JSON.stringify(serverUser));
      expect(localStorage.getItem('userData')).toBe(JSON.stringify(serverUser));
    });

    it('clears stored data when server returns no user', async () => {
      const storedUser = { id: 1, firstName: 'John' };
      localStorage.setItem('userData', JSON.stringify(storedUser));
      checkCurrentUser.mockResolvedValue(null);

      renderWithAuthProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user-data')).toHaveTextContent('null');
      expect(localStorage.getItem('userData')).toBeNull();
    });

    it('handles server error gracefully', async () => {
      checkCurrentUser.mockRejectedValue(new Error('Server error'));

      renderWithAuthProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user-data')).toHaveTextContent('null');
      expect(localStorage.getItem('userData')).toBeNull();
    });

    it('allows user to login', async () => {
      checkCurrentUser.mockResolvedValue(null);
      renderWithAuthProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      await userEvent.click(screen.getByTestId('login-btn'));

      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user-data')).toHaveTextContent(JSON.stringify({ id: 1, name: 'Test' }));
      expect(localStorage.getItem('userData')).toBe(JSON.stringify({ id: 1, name: 'Test' }));
    });

    it('allows user to logout', async () => {
      const storedUser = { id: 1, firstName: 'John' };
      localStorage.setItem('userData', JSON.stringify(storedUser));
      checkCurrentUser.mockResolvedValue(storedUser);
      apiLogout.mockResolvedValue(true);

      renderWithAuthProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

      await userEvent.click(screen.getByTestId('logout-btn'));

      await waitFor(() => {
        expect(apiLogout).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user-data')).toHaveTextContent('null');
      expect(localStorage.getItem('userData')).toBeNull();
    });

    it('handles logout API error gracefully', async () => {
      const storedUser = { id: 1, firstName: 'John' };
      localStorage.setItem('userData', JSON.stringify(storedUser));
      checkCurrentUser.mockResolvedValue(storedUser);
      apiLogout.mockRejectedValue(new Error('Logout failed'));

      // Mock console.error to avoid error logs in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderWithAuthProvider();

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      await userEvent.click(screen.getByTestId('logout-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('user-data')).toHaveTextContent('null');
      expect(localStorage.getItem('userData')).toBeNull();
      
      consoleSpy.mockRestore();
    });

    it('provides correct isAuthenticated value', async () => {
      checkCurrentUser.mockResolvedValue(null);
      
      renderWithAuthProvider();

      // Initially false while loading
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // Still false when no user and not loading
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');

      // True after login
      await userEvent.click(screen.getByTestId('login-btn'));
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });
});