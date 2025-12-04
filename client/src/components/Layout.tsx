import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import type { RootState } from '../store/store';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const adminMenuItems = [
        { path: '/admin', label: 'Trang Chủ', icon: '📊' },
        { path: '/admin/students', label: 'Sinh Viên', icon: '👨‍🎓' },
        { path: '/admin/classes', label: 'Lớp Học', icon: '🏫' },
        { path: '/admin/verification', label: 'Xác Thực', icon: '✅' },
        { path: '/admin/activities', label: 'Hoạt Động', icon: '🏆' },
        { path: '/admin/reports', label: 'Báo Cáo', icon: '📈' },
    ];

    const studentMenuItems = [
        { path: '/student', label: 'Trang Chủ', icon: '🏠' },
        { path: '/student/class', label: 'Lớp Của Tôi', icon: '👥' },
        { path: '/student/reports', label: 'Báo Cáo', icon: '📝' },
    ];

    const menuItems = user?.role === 'ADMIN' ? adminMenuItems : studentMenuItems;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Hệ Thống QLSV</h1>
                    <p className="text-indigo-300 text-sm mt-1">
                        {user?.role === 'ADMIN' ? 'Cổng Quản Trị' : 'Cổng Sinh Viên'}
                    </p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-indigo-700 text-white'
                                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                                } `}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-indigo-800">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-lg font-bold">
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="ml-3">
                            <p className="font-medium text-sm truncate w-32">{user?.email}</p>
                            <p className="text-xs text-indigo-300">
                                {user?.role === 'ADMIN' ? 'Quản Trị Viên' : 'Sinh Viên'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                    >
                        Đăng Xuất
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                </header>
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
