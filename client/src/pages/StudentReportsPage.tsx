import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import api from '../utils/api';
import type { RootState } from '../store/store';

interface Participation {
    id: string;
    hoatDong: {
        id: string;
        tenHoatDong: string;
        ngayDienRa: string;
        diemCong: number;
    };
    trangThai: string;
    ngayDangKy: string;
    minhChung: string | null;
}

interface Activity {
    id: string;
    tenHoatDong: string;
}

const StudentReportsPage: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [participations, setParticipations] = useState<Participation[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [selectedActivityId, setSelectedActivityId] = useState('');
    const [proof, setProof] = useState('');

    useEffect(() => {
        if (user?.profile?.id) {
            fetchParticipations();
            fetchActivities();
        }
    }, [user]);

    const fetchParticipations = async () => {
        try {
            const response = await api.get(`/participations/student/${user?.profile?.id}`);
            setParticipations(response.data);
        } catch (error) {
            console.error('Failed to fetch participations', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await api.get('/activities');
            setActivities(response.data);
        } catch (error) {
            console.error('Failed to fetch activities', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedActivityId) {
            alert('Vui lòng chọn hoạt động');
            return;
        }

        try {
            await api.post('/participations', {
                sinhVienId: user?.profile?.id,
                hoatDongId: selectedActivityId,
                minhChung: proof
            });
            alert('Gửi báo cáo thành công!');
            setIsModalOpen(false);
            setSelectedActivityId('');
            setProof('');
            fetchParticipations();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gửi báo cáo thất bại');
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Báo Cáo Hoạt Động</h2>
                    <p className="text-gray-600">Quản lý và theo dõi các hoạt động đã tham gia</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                    <span className="mr-2">+</span> Thêm Báo Cáo
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Hoạt Động</th>
                                <th className="px-6 py-4">Ngày Diễn Ra</th>
                                <th className="px-6 py-4">Ngày Đăng Ký</th>
                                <th className="px-6 py-4">Minh Chứng</th>
                                <th className="px-6 py-4">Trạng Thái</th>
                                <th className="px-6 py-4">Điểm</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : participations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Bạn chưa có báo cáo hoạt động nào.
                                    </td>
                                </tr>
                            ) : (
                                participations.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{p.hoatDong.tenHoatDong}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(p.hoatDong.ngayDienRa).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(p.ngayDangKy).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.minhChung ? (
                                                <a href={p.minhChung} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">
                                                    Xem Minh Chứng
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">Chưa có</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.trangThai === 'DA_DUYET' ? 'bg-green-100 text-green-700' :
                                                p.trangThai === 'TU_CHOI' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {p.trangThai === 'DA_DUYET' ? 'Đã Duyệt' :
                                                    p.trangThai === 'TU_CHOI' ? 'Từ Chối' : 'Chờ Duyệt'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700">
                                            {p.trangThai === 'DA_DUYET' ? `+${p.hoatDong.diemCong}` : '0'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Report Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Thêm Báo Cáo Mới</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt Động</label>
                                <select
                                    value={selectedActivityId}
                                    onChange={(e) => setSelectedActivityId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">-- Chọn hoạt động --</option>
                                    {activities.map((act) => (
                                        <option key={act.id} value={act.id}>
                                            {act.tenHoatDong}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link Minh Chứng</label>
                                <input
                                    type="text"
                                    value={proof}
                                    onChange={(e) => setProof(e.target.value)}
                                    placeholder="Nhập link ảnh/tài liệu minh chứng..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Ví dụ: Link Google Drive, Imgur...</p>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Gửi Báo Cáo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default StudentReportsPage;
