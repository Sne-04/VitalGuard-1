import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import SymptomChecker from './pages/SymptomChecker';
import Results from './pages/Results';
import History from './pages/History';
import IoTVitals from './pages/IoTVitals';
import ImageAnalysis from './pages/ImageAnalysis';
import Analytics from './pages/Analytics';
import LabReportAnalyzer from './pages/LabAnalyzer/LabReportAnalyzer';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    return (
        <div className="min-h-screen gradient-bg">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login/*" element={<Login />} />
                <Route path="/register/*" element={<Register />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route
                    path="/check"
                    element={
                        <ProtectedRoute>
                            <SymptomChecker />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/results/:id"
                    element={
                        <ProtectedRoute>
                            <Results />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <History />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/iot-vitals"
                    element={
                        <ProtectedRoute>
                            <IoTVitals />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/image-analysis"
                    element={
                        <ProtectedRoute>
                            <ImageAnalysis />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lab"
                    element={
                        <ProtectedRoute>
                            <LabReportAnalyzer />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
    if (!clerkPubKey) {
        return (
            <div style={{ color: 'white', padding: '20px' }}>
                <h1>Configuration Error</h1>
                <p>Missing Clerk Publishable Key in .env</p>
            </div>
        );
    }

    return (
        <ClerkProvider publishableKey={clerkPubKey}>
            <ThemeProvider>
                <Router>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </Router>
            </ThemeProvider>
        </ClerkProvider>
    );
}

export default App;
