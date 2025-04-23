import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import GameDetails from './pages/GameDetails';
import Library from './pages/Library';
 import 'bootstrap/dist/css/bootstrap.min.css';
 import './styles/global.css';

const CLERK_PUBLISHABLE_KEY =import.meta.env.VITE_CLERK_PUBLISHABLE_KEY; // Replace with your actual Clerk publishable key
//pk_test_cmljaC15ZXRpLTk5LmNsZXJrLmFjY291bnRzLmRldiQ
const PrivateRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Provider store={store}>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<GameDetails />} />
            <Route 
              path="/library" 
              element={
                <PrivateRoute>
                  <Library />
                </PrivateRoute>
              } 
            />
            <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
            <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
          </Routes>
        </Router>
      </Provider>
    </ClerkProvider>
  );
}

export default App;
