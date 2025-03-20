import axios from 'axios';
import { User, Permission, Employee, Project } from '../types';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const loginUser = async (email: string, password: string) => {
  const response = await api.get(`/users?email=${email}`);
  return response.data;
};

// Add these functions to get the counts
export const getUsersCount = async () => {
  const response = await api.get('/users');
  return response.data.length;
};

export const getEmployeesCount = async () => {
  const response = await api.get('/employees');
  return response.data.length;
};

export const getProjectsCount = async () => {
  const response = await api.get('/projects');
  return response.data.length;
};

export const getRolesCount = async () => {
  const response = await api.get('/permissions');
  return response.data.length;
};

// User APIs
export const getUsers = async (searchTerm: string = '') => {
  const response = await api.get(`/users?name_like=${searchTerm}`);
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: Omit<User, 'id'>) => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id: number, user: Partial<User>) => {
  const response = await api.patch(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Permission APIs
export const getPermissions = async () => {
  const response = await api.get('/permissions');
  return response.data;
};

export const getPermissionByRole = async (role: string) => {
  const response = await api.get(`/permissions?role=${role}`);
  return response.data[0];
};

export const updatePermission = async (id: number, permission: Partial<Permission>) => {
  const response = await api.patch(`/permissions/${id}`, permission);
  return response.data;
};

// Employee APIs
export const getEmployees = async () => {
  const response = await api.get('/employees');
  return response.data;
};

export const getEmployeeById = async (id: number) => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (employee: Omit<Employee, 'id'>) => {
  const response = await api.post('/employees', employee);
  return response.data;
};

export const updateEmployee = async (id: number, employee: Partial<Employee>) => {
  const response = await api.patch(`/employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id: number) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};

// Project APIs
export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const getProjectById = async (id: number) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (project: Omit<Project, 'id'>) => {
  const response = await api.post('/projects', project);
  return response.data;
};

export const updateProject = async (id: number, project: Partial<Project>) => {
  const response = await api.patch(`/projects/${id}`, project);
  return response.data;
};

export const deleteProject = async (id: number) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export default api;