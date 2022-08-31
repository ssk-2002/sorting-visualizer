/* React Testing Library is an alternative to *Enzyme. While Enzyme lets us test the implementation details of React components, 
 React Testing Library helps us test the behavior of our React components from the perspective of the users that will use our app. 
 
 *Enzyme -> Enzyme is a JavaScript Testing utility for React that makes it easier to assert, manipulate, and traverse your React Components' output.*/

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
