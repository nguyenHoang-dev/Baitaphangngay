import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';

interface Class {
    id: string;
    tenLop: string;
    khoa: string;
    _count: {
        sinhViens: number;
    };
}

const ClassesPage: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newClass, setNewClass] = useState({ tenLop: '', khoa: '' });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/classes', newClass);
            setShowModal(false);
            setNewClass({ tenLop: '', khoa: '' });
            fetchClasses();
        } catch (error) {
            alert('Failed to add class');
        }
    };

    const handleDeleteClass = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lớp này không?')) {
            try {
                await api.delete(`/classes/${id}`);
                fetchClasses();
            } catch (error) {
                alert('Xóa lớp thất bại. Có thể lớp đang có sinh viên.');
            }
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản Lý Lớp Học</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + Thêm Lớp
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase">
                        <tr>
                            <th className="px-6 py-3">Tên Lớp</th>
                            <th className="px-6 py-3">Khoa</th>
                            <th className="px-6 py-3">Số Lượng SV</th>
                            <th className="px-6 py-3 text-right">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-4">Đang tải...</td></tr>
                        ) : classes.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-4">Chưa có lớp nào</td></tr>
                        ) : (
                            classes.map((cls) => (
                                <tr key={cls.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{cls.tenLop}</td>
                                    <td className="px-6 py-4 text-gray-600">{cls.khoa}</td>
                                    <td className="px-6 py-4 text-gray-500 font-medium">{cls._count?.sinhViens || 0}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteClass(cls.id)}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Class Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Thêm Lớp Mới</h3>
                        <form onSubmit={handleAddClass} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Lớp</label>
                                <input
                                    type="text"
                                    required
                                    value={newClass.tenLop}
                                    onChange={(e) => setNewClass({ ...newClass, tenLop: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="VD: CNTT-K60"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Khoa</label>
                                <input
                                    type="text"
                                    required
                                    value={newClass.khoa}
                                    onChange={(e) => setNewClass({ ...newClass, khoa: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="VD: Công nghệ thông tin"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Thêm Lớp
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ClassesPage;
