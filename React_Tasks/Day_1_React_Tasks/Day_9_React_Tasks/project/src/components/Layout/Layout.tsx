import React from 'react';
import { Layout as AntLayout, Button, theme as antTheme } from 'antd';
import { Sun, Moon, Package } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Layout.module.scss';

const { Header, Content, Footer } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { token } = antTheme.useToken();

  return (
    <div className={styles.layout}>
      <Header className={styles.header} style={{ borderColor: token.colorBorder }}>
        <div className={styles.logo}>
          <Package size={24} />
          <span>Tatakae</span>
        </div>
        <Button
          type="text"
          icon={theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{ marginRight: '50px' }}
        />
      </Header>
      <Content className={styles.content}>
        {children}
      </Content>
      <Footer className={styles.footer}>
        Tatakae ©{new Date().getFullYear()} Created By Harsh Singh (React and Antd)
      </Footer>
    </div>
  );
};

export default Layout;