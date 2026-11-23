import { useContext } from 'react';
import { MockDataContext } from './MockDataContext.js';

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
