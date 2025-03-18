import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Outlet } from 'react-router';

export const Layout = () => {
    const { isAuthenticated } = useAuth();
    
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {isAuthenticated && <Sidebar />}
            <div className="flex flex-col flex-1 max-h-screen overflow-y-auto">
                <Navbar />
                <main className="flex-1 p-6 md:p-10"><Outlet /></main>
            </div>
        </div>
    );
};