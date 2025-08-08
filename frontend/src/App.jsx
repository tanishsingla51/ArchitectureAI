import React from 'react';
import Navbar from './components/Navbar.jsx';
import MainPage from './pages/MainPage.jsx';
import GenerateArchitecturePage from './pages/GenerateArchitecturePage.jsx';
import Footer from './components/Footer.jsx';
import SideBar from './components/SideBar.jsx';
import { useState , useEffect } from 'react';
import { useAuth , useClerk } from '@clerk/clerk-react';
import useApiStore from './store/apiStore.js';

// Get Clerk Publishable Key from environment variable
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { getToken , isSignedIn } = useAuth();
  const { chatHistory, getChatHistory } = useApiStore();
  const { openSignIn } = useClerk();

  const toggleSidebar = () => {

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setSidebarOpen(!sidebarOpen);

  };

  const fetchHistory = async () => {
    getChatHistory(getToken);
  };

  useEffect(() => {

    if(sidebarOpen){

      fetchHistory();
    }

  }, [sidebarOpen]);

 
  return (
    <div className="min-h-screen bg-white">
      
      <Navbar toggleSidebar={toggleSidebar} />
      <SideBar show={sidebarOpen} onClose={toggleSidebar} chatHistory={chatHistory} />
      <MainPage /> 
      
    <GenerateArchitecturePage />
     
       <Footer />
    </div>
  );
}

export default App;
