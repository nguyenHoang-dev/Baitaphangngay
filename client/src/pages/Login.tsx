import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { loginSuccess } from '../store/authSlice';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [role, setRole] = useState<'ADMIN' | 'STUDENT'>('STUDENT');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });

            // Optional: Check if the logged-in user matches the selected role
            if (response.data.user.role !== role) {
                setError(`Vui lòng đăng nhập đúng vai trò ${role === 'ADMIN' ? 'Quản Trị Viên' : 'Sinh Viên'}`);
                setLoading(false);
                return;
            }

            dispatch(loginSuccess(response.data));

            if (response.data.user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Đăng nhập thất bại';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Chào Mừng</h1>
                    <p className="text-white/80">Đăng nhập để quản lý điểm rèn luyện</p>
                </div>

                <div className="flex bg-white/20 rounded-lg p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('STUDENT')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === 'STUDENT'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-white hover:bg-white/10'
                            }`}
                    >
                        Sinh Viên
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('ADMIN')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === 'ADMIN'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-white hover:bg-white/10'
                            }`}
                    >
                        Quản Trị Viên
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-2" htmlFor="email">
                            Địa chỉ Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50 transition-all"
                            placeholder={role === 'ADMIN' ? "admin@qlsv.com" : "student@qlsv.com"}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-2" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50 transition-all"
                            placeholder="Nhập mật khẩu của bạn"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-white text-indigo-600 hover:bg-white/90 rounded-lg font-bold shadow-lg transform transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang đăng nhập...
                            </span>
                        ) : (
                            `Đăng Nhập (${role === 'ADMIN' ? 'Admin' : 'Sinh Viên'})`
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                        Quên mật khẩu?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
