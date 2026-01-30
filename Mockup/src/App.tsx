import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Employees } from '@/pages/Employees';
import { Cycles } from '@/pages/Cycles';
import { Dimensions } from '@/pages/Dimensions';
import { Settings } from '@/pages/Settings';

type Page = 'dashboard' | 'employees' | 'cycles' | 'dimensions' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <Employees />;
      case 'cycles':
        return <Cycles />;
      case 'dimensions':
        return <Dimensions />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} onPageChange={(page) => setCurrentPage(page as Page)}>
      {renderPage()}
    </MainLayout>
  );
}

export default App;
