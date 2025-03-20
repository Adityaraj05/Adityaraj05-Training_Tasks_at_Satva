import React, { useState, useEffect } from 'react';
import { Table, Button, Switch, Typography, Card, Tabs, App } from 'antd';
import { getPermissions, updatePermission } from '../api/api';
import { Permission } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/auth';
import '../index.css'; // Import the CSS file

const { Title } = Typography;

const Roles: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const { permissions: userPermissions, user } = useAuth();
  const { message } = App.useApp();

  const canEditRoles = hasPermission(userPermissions, 'roles', 'edit');
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const data = await getPermissions();
      setPermissions(data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      message.error('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (
    permissionId: number,
    module: string,
    action: string,
    checked: boolean,
    role: string
  ) => {
    try {
      const permission = permissions.find(p => p.id === permissionId);
      if (!permission) return;

      const updatedPermission = { ...permission };
      
      // Handle special case for roles module
      if (module === 'roles') {
        updatedPermission.modules.roles = {
          ...updatedPermission.modules.roles,
          [action]: checked,
        };
        
        // If turning off 'view' permission, also turn off 'edit' permission
        if (action === 'view' && !checked) {
          updatedPermission.modules.roles.edit = false;
        }
      } else {
        const modulePermissions = updatedPermission.modules[module as keyof typeof updatedPermission.modules];
        if (modulePermissions) {
          updatedPermission.modules[module as keyof typeof updatedPermission.modules] = {
            ...modulePermissions,
            [action]: checked,
          };
          
          // If turning off 'view' permission, also turn off all other permissions
          if (action === 'view' && !checked) {
            updatedPermission.modules[module as keyof typeof updatedPermission.modules] = {
              ...modulePermissions,
              view: false,
              add: false,
              edit: false,
              delete: false,
            };
          }
        }
      }

      await updatePermission(permissionId, updatedPermission);
      
      // Update local state
      setPermissions(permissions.map(p => 
        p.id === permissionId ? updatedPermission : p
      ));
      
      message.success('Permission updated successfully');
    } catch (error) {
      console.error('Error updating permission:', error);
      message.error('Failed to update permission');
    }
  };

  const renderPermissionTable = (role: string) => {
    const permission = permissions.find(p => p.role === role);
    if (!permission) return null;

    const modules = [
      { key: 'users', name: 'Users Management' },
      { key: 'employees', name: 'Employees Management' },
      { key: 'projects', name: 'Projects Management' },
      { key: 'roles', name: 'Roles Management' },
    ];

    const actions = [
      { key: 'view', name: 'View' },
      { key: 'add', name: 'Add' },
      { key: 'edit', name: 'Edit' },
      { key: 'delete', name: 'Delete' },
    ];

    return (
      <div className="scrollable-table-container">
        <Table
          dataSource={modules}
          rowKey="key"
          pagination={false}
          bordered
        >
          <Table.Column title="Module" dataIndex="name" key="name" />
          
          {actions.map(action => {
            return (
              <Table.Column
                title={action.key.charAt(0).toUpperCase() + action.key.slice(1)}
                key={action.key}
                render={(_, record: { key: string; name: string }) => {
                  // Special handling for roles module which has different structure
                  if (record.key === 'roles') {
                    if (action.key !== 'view' && action.key !== 'edit') {
                      return null;
                    }
                    
                    const viewChecked = permission.modules.roles.view;
                    const checked = permission.modules.roles[action.key as 'view' | 'edit'];
                    
                    // Disable edit switch if view is not checked
                    const isDisabled = !canEditRoles || (action.key === 'edit' && !viewChecked);
                    
                    return (
                      <Switch
                        checked={checked}
                        onChange={(checked) => 
                          handlePermissionChange(permission.id, record.key, action.key, checked, role)
                        }
                        disabled={isDisabled}
                      />
                    );
                  }
                  
                  const modulePermissions = permission.modules[record.key as keyof typeof permission.modules];
                  if (!modulePermissions) return null;
                  
                  const viewChecked = modulePermissions.view;
                  const checked = modulePermissions[action.key as keyof typeof modulePermissions];
                  
                  // Disable all other switches if view is not checked
                  const isDisabled = !canEditRoles || (action.key !== 'view' && !viewChecked);
                  
                  return (
                    <Switch
                      checked={checked}
                      onChange={(checked) => 
                        handlePermissionChange(permission.id, record.key, action.key, checked, role)
                      }
                      disabled={isDisabled}
                    />
                  );
                }}
              />
            );
          })}
        </Table>
      </div>
    );
  };

  // Create tab items based on user role
  const getTabItems = () => {
    // Define available roles - no Admin role tab for any user
    const availableRoles = ['HR', 'Supervisor', 'Manager'];
    
    // If the user is an admin, then show all roles except Admin
    if (isAdmin) {
      availableRoles.unshift('Admin');
    }
    
    return availableRoles
      .filter(role => role !== 'Admin') // Exclude Admin role from the tabs
      .map(role => ({
        key: role,
        label: role,
        children: renderPermissionTable(role)
      }));
  };

  return (
    <div>
      <Title level={2}>Roles & Permissions</Title>
      
      <Card loading={loading}>
        <Tabs defaultActiveKey="HR" items={getTabItems()} />
      </Card>
      
      {!canEditRoles && (
        <div className="mt-1 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-700">
            Note: You don't have permission to edit roles. Contact an administrator for changes.
          </p>
        </div>
      )}
    </div>
  );
};

export default Roles;