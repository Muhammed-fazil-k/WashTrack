import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

function ProtectedRoute({ children, allowedRoles }) {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
