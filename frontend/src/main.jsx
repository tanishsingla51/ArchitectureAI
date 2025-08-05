import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react';
import { neobrutalism } from '@clerk/themes';

const PUBLIC_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLIC_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLIC_KEY} appearance={{
      baseTheme: neobrutalism
    }}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
