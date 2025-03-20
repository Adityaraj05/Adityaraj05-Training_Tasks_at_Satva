import React from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ProductProvider } from './context/ProductContext';
import Layout from './components/Layout/Layout';
import ProductTable from './components/ProductTable/ProductTable';
import './styles/theme.scss';

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  
  const lightTheme = {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',  
    colorError: '#f5222d',
    colorTextBase: '#2c3e50',
    colorBgBase: '#ffffff',
    borderRadius: 6,
  };
  
  const darkTheme = {
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorTextBase: '#e5e7eb',
    colorBgBase: '#111827',
    borderRadius: 6,
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: theme === 'dark' ? darkTheme : lightTheme,
      }}
    >
      <Layout>
        <ProductTable />
      </Layout>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ProductProvider>
        <AppContent />
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;