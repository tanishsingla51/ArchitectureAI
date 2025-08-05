import React from 'react';
import Navbar from './components/Navbar.jsx';
import MainPage from './pages/MainPage.jsx';
import GenerateArchitecturePage from './pages/GenerateArchitecturePage.jsx';
import Footer from './components/Footer.jsx';

// Get Clerk Publishable Key from environment variable
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

function App() {
 
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />
      {/* Hero Section */}
      <MainPage />

      {/* Generator Section */}
      <GenerateArchitecturePage />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
