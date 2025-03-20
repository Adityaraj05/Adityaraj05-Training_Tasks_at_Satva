export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface ModulePermissions {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface RolePermissions {
  users: ModulePermissions;
  employees: ModulePermissions;
  projects: ModulePermissions;
  roles: {
    view: boolean;
    edit: boolean;
  };
}

export interface Permission {
  id: number;
  role: string;
  modules: RolePermissions;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface AuthContextType {
  user: User | null;
  permissions: RolePermissions | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}