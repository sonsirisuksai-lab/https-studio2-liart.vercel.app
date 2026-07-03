import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@cosmos/core';
import { Skeleton } from '../ui/Skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <Skeleton />
      </div>
    );
  }

  // If you want a bypass or try-offline option:
  // We can let the user enter as guest if desired, but for standard ProtectedRoute:
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
