import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isValidKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith("pk_")

if (!isValidKey) {
  console.warn("Clerk Publishable Key is missing or invalid! Set a valid VITE_CLERK_PUBLISHABLE_KEY in client/.env.local. Operating in local storage mode.")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isValidKey ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
