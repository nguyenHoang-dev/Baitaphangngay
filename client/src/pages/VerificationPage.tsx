import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import ManageParticipantsModal from '../components/ManageParticipantsModal';

interface Participation {
    id: string;
    sinhVien: {
        maSv: string;
        hoTen: string;
        lop: { tenLop: string };
    };
    hoatDong: {
        tenHoatDong: string;
        diemCong: number;
    };
    minhChung: string;
    ngayDangKy: string;
    trangThai: string;
}

interface Activity {
    id: string;
    tenHoatDong: string;
    ngayDienRa: string;
    diemCong: number;
}

const VerificationPage: React.FC = () => {
    const [pendingParticipations, setPendingParticipations] = useState<Participation[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pendingRes, activitiesRes] = await Promise.all([
                api.get('/participations?status=CHO_DUYET'),
                api.get('/activities')
            ]);
            setPendingParticipations(pendingRes.data);
            setActivities(activitiesRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: 'DA_DUYET' | 'TU_CHOI') => {
        try {
            await api.put(`/participations/${id}/status`, { trangThai: status });
            // Remove from list locally
            setPendingParticipations(prev => prev.filter(p => p.id !== id));
            alert(`Đã ${status === 'DA_DUYET' ? 'duyệt' : 'từ chối'} thành công!`);
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Pending Requests Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-indigo-50">
                        <h3 className="text-lg font-bold text-indigo-900">Yêu Cầu Chờ Duyệt ({pendingParticipations.length})</h3>
                        <p className="text-sm text-indigo-700">Danh sách sinh viên vừa gửi minh chứng cần xác nhận</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Sinh Viên</th>
                                    <th className="px-6 py-4">Lớp</th>
                                    <th className="px-6 py-4">Hoạt Động</th>
                                    <th className="px-6 py-4">Minh Chứng</th>
                                    <th className="px-6 py-4">Ngày Gửi</th>
                                    <th className="px-6 py-4 text-right">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Đang tải...</td>
                                    </tr>
                                ) : pendingParticipations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Không có yêu cầu nào đang chờ duyệt.
                                        </td>
                                    </tr>
                                ) : (
                                    pendingParticipations.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{p.sinhVien.hoTen}</div>
                                                <div className="text-xs text-gray-500">{p.sinhVien.maSv}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{p.sinhVien.lop?.tenLop}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900">{p.hoatDong.tenHoatDong}</div>
                                                <div className="text-xs text-indigo-600 font-bold">+{p.hoatDong.diemCong} điểm</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.minhChung ? (
                                                    <a href={p.minhChung} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                                        Xem ảnh
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Không có</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {new Date(p.ngayDangKy).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(p.id, 'DA_DUYET')}
                                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium shadow-sm"
                                                >
                                                    ✓ Duyệt
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(p.id, 'TU_CHOI')}
                                                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                                                >
                                                    ✕ Từ chối
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* All Activities Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800">Danh Sách Hoạt Động</h3>
                        <p className="text-sm text-gray-500">Quản lý chi tiết từng hoạt động</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Tên Hoạt Động</th>
                                    <th className="px-6 py-4">Ngày Diễn Ra</th>
                                    <th className="px-6 py-4">Điểm</th>
                                    <th className="px-6 py-4 text-right">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {activities.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{activity.tenHoatDong}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(activity.ngayDienRa).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-indigo-600">+{activity.diemCong}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedActivity({ id: activity.id, name: activity.tenHoatDong })}
                                                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                            >
                                                Xem chi tiết →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedActivity && (
                    <ManageParticipantsModal
                        isOpen={!!selectedActivity}
                        onClose={() => setSelectedActivity(null)}
                        activityId={selectedActivity.id}
                        activityName={selectedActivity.name}
                    />
                )}
            </div>
        </Layout>
    );
};

export default VerificationPage;
