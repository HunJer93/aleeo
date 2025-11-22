import { useDispatch, useSelector } from 'react-redux';

// Typed hooks for better TypeScript support (will work in JavaScript too)
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Custom hooks for common selectors
export const useAuth = () => useAppSelector(state => state.auth);
export const useConversations = () => useAppSelector(state => state.conversations);