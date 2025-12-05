// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// CHAKRA UI AND ARK UI DEPENDENCY FIX:
// Chakra UI v3 depends on Ark UI components that have compatibility issues with Jest.
// This comprehensive mock setup ensures tests can run without these dependency conflicts.

// Suppress React DOM warnings about Chakra UI props in test environment
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React does not recognize the') ||
        args[0].includes('colorPalette') ||
        args[0].includes('alignItems') ||
        args[0].includes('justifyContent') ||
        args[0].includes('textAlign') ||
        args[0].includes('whiteSpace') ||
        args[0].includes('wordBreak') ||
        args[0].includes('colorScheme'))
    ) {
      // Suppress these Chakra UI-related warnings in tests
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock Chakra UI components to avoid Ark UI dependency issues
jest.mock('@chakra-ui/react', () => ({
  // Layout components
  SimpleGrid: ({ children, ...props }) => <div data-testid="simple-grid" {...props}>{children}</div>,
  GridItem: ({ children, ...props }) => <div data-testid="grid-item" {...props}>{children}</div>,
  Container: ({ children, ...props }) => <div data-testid="container" {...props}>{children}</div>,
  HStack: ({ children, ...props }) => <div data-testid="hstack" {...props}>{children}</div>,
  VStack: ({ children, ...props }) => <div data-testid="vstack" {...props}>{children}</div>,
  Stack: ({ children, ...props }) => <div data-testid="stack" {...props}>{children}</div>,
  Box: ({ children, ...props }) => <div data-testid="box" {...props}>{children}</div>,
  Flex: ({ children, ...props }) => <div data-testid="flex" {...props}>{children}</div>,
  Center: ({ children, ...props }) => <div data-testid="center" {...props}>{children}</div>,
  
  // Typography
  Heading: ({ children, ...props }) => <h2 data-testid="heading" {...props}>{children}</h2>,
  Text: ({ children, ...props }) => <span data-testid="text" {...props}>{children}</span>,
  Link: ({ children, onClick, ...props }) => (
    <a data-testid="link" onClick={onClick} href="#" {...props}>
      {children}
    </a>
  ),
  
  // Form components
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
  Textarea: ({ value, onChange, placeholder, onKeyDown, ...props }) => (
    <textarea
      data-testid="textarea"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      {...props}
    />
  ),
  Input: ({ value, onChange, placeholder, onBlur, onKeyDown, autoFocus, ...props }) => (
    <input
      data-testid="input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus}
      {...props}
    />
  ),
  
  // UI components
  Separator: (props) => <hr data-testid="separator" {...props} />,
  Spinner: (props) => <div data-testid="spinner" {...props}>Loading...</div>,
  Portal: ({ children }) => <div data-testid="portal">{children}</div>,
  
  // Complex components
  ScrollArea: {
    Root: ({ children, ...props }) => <div data-testid="scroll-root" {...props}>{children}</div>,
    Viewport: ({ children, ...props }) => <div data-testid="scroll-viewport" {...props}>{children}</div>,
    Content: ({ children, ...props }) => <div data-testid="scroll-content" {...props}>{children}</div>,
    Scrollbar: (props) => <div data-testid="scrollbar" {...props} />,
    Thumb: (props) => <div data-testid="scroll-thumb" {...props} />,
    Corner: (props) => <div data-testid="scroll-corner" {...props} />,
  },
  
  Popover: {
    Root: ({ children, open, onOpenChange, ...props }) => (
      <div data-testid="popover-root" data-open={open} {...props}>
        {children}
      </div>
    ),
    Trigger: ({ children, ...props }) => <div data-testid="popover-trigger" {...props}>{children}</div>,
    Content: ({ children, ...props }) => <div data-testid="popover-content" {...props}>{children}</div>,
    Arrow: (props) => <div data-testid="popover-arrow" {...props} />,
    Positioner: ({ children, ...props }) => <div data-testid="popover-positioner" {...props}>{children}</div>,
  },
  
  Field: {
    Root: ({ children, ...props }) => <div data-testid="field-root" {...props}>{children}</div>,
    Label: ({ children, srOnly, ...props }) => (
      <label 
        data-testid="field-label" 
        style={{ display: srOnly ? 'none' : 'block' }} 
        {...props}
      >
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
  
  // Provider components - these need to be functional to avoid breaking context
  ChakraProvider: ({ children }) => children,
  defaultSystem: {},
}));

// Mock the UI provider components
jest.mock('./components/ui/provider.jsx', () => ({
  Provider: ({ children }) => children,
}));

// Mock the color mode provider
jest.mock('./components/ui/color-mode', () => ({
  ColorModeProvider: ({ children }) => children,
}));

// Global test setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver for Chakra UI components that might use it
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia for responsive design components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.alert for tests
global.alert = jest.fn();
