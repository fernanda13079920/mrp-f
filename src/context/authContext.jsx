import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const storedAuthData = localStorage.getItem('authData');
    if (storedAuthData) {
      try {
        setAuthData(JSON.parse(storedAuthData));
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        setAuthData(null);
      }
    }
  }, []);

  const saveAuthData = (data) => {
    setAuthData(data);
    localStorage.setItem('authData', JSON.stringify(data));
  };

  const clearAuthData = () => {
    setAuthData(null);
    localStorage.removeItem('authData');
  };

  const isAuthenticated = () => !!authData;

  return (
    <AuthContext.Provider value={{ authData, saveAuthData, clearAuthData, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
