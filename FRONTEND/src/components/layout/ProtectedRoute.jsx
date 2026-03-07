import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const BiometricGuard = ({ children }) => {
  const { hasCompleteProfile } = useAuth();
  const location = useLocation();

  if (!hasCompleteProfile()) {
    // Redirect them to the /profile page, but save where they were trying to go
    // so we can bounce them back to the Try-On mirror after they enter their sizes
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  return children;
};
