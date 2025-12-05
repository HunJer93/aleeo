import { render, screen } from '@testing-library/react';
import App from './App';

// Mock UserLogin component since it has complex dependencies
jest.mock('./components/UserLogin', () => {
  return function MockUserLogin() {
    return <div data-testid="user-login">User Login Component</div>;
  };
});

test('renders app with user login component', () => {
  render(<App />);
  const userLoginElement = screen.getByTestId('user-login');
  expect(userLoginElement).toBeInTheDocument();
  expect(userLoginElement).toHaveTextContent('User Login Component');
});
