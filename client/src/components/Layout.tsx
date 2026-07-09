import React, { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  sidebar?: boolean;
}

const Layout: FC<LayoutProps> = ({ children, sidebar = true }) => {
  return (
    <div className="flex h-screen bg-light">
      {sidebar && (
        <aside className="w-64 bg-dark text-white shadow-lg">
          {/* Sidebar content */}
        </aside>
      )}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
