import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/auth';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: keyof RolePermissions;
  requiredAction?: 'view' | 'add' | 'edit' | 'delete';
}

interface RolePermissions {
  users: ModulePermissions;
  employees: ModulePermissions;
  projects: ModulePermissions;
  roles: {
    view: boolean;
    edit: boolean;
  };
}

interface ModulePermissions {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredModule,
  requiredAction = 'view',
}) => {
  const { isAuthenticated, loading, permissions } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-2">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no specific permission is required, just check authentication
  if (!requiredModule) {
    return <>{children}</>;
  }

  // Check if user has the required permission
  const hasRequiredPermission = hasPermission(permissions, requiredModule, requiredAction);

  if (!hasRequiredPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;