import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import { AuthProvider, AuthContext } from './AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

const PrivateRoute = ({ children }) => {
    return (
        <AuthContext.Consumer>
            {({ user }) => {
                return user ? children : <Navigate to="/login" />;
            }}
        </AuthContext.Consumer>
    );
};

const Dashboard = () => {
    return <h2>Dashboard: Protected Route</h2>;
};

export default App;
