import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';

export const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate()

    // Check if mobile screen on mount and when window resizes
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const navItems = [
        {
            name: 'Dashboard',
            icon: <Home className="w-5 h-5" />,
            path: '/dashboard'
        },
        {
            name: 'Create Request',
            icon: <PlusCircle className="w-5 h-5" />,
            path: '/create-request'
        },
        {
            name: 'Profile',
            icon: <User className="w-5 h-5" />,
            path: '/profile'
        },
       
    ];

    return (
        <div className={`${isMobile ? 'w-16' : 'w-64'} flex flex-col h-screen bg-gray-800 text-white`}>
            <div className="p-4 border-b border-gray-700">
                {!isMobile && <h1 className="text-xl font-bold">GameON</h1>}
                {isMobile && <div className="flex justify-center"><span className="text-xl font-bold">G</span></div>}
            </div>
            <nav className="flex-1 p-2">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link to={item.path}>
                                <Button
                                    variant={location.pathname === item.path ? "default" : "ghost"}
                                    className={`${isMobile ? 'justify-center w-full px-2' : 'justify-start w-full px-3'
                                        } py-2 text-white hover:bg-primary/90 hover:text-white`}
                                >
                                    {item.icon}
                                    {!isMobile && <span className="ml-3">{item.name}</span>}
                                </Button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
                <Button
                    variant="ghost"
                    className={`${isMobile ? 'justify-center w-full px-2' : 'justify-start w-full px-3'
                        } py-2 text-white hover:bg-gray-700`}
                    onClick={() => {
                        logout()
                        navigate('/')
                    }}
                >
                    <LogOut className="w-5 h-5" />
                    {!isMobile && <span className="ml-3">Logout</span>}
                </Button>
            </div>
        </div>
    );
};