import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Intune Assignment Checker Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});
