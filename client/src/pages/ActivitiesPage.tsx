import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import ActivityModal from '../components/ActivityModal';
import ManageParticipantsModal from '../components/ManageParticipantsModal';

interface Activity {
    id: string;
    tenHoatDong: string;
    moTa: string;
    ngayDienRa: string;
    ngayKetThuc?: string;
    diaDiem: string;
    diemCong: number;
    loaiTieuChi: string;
    hocKy: { tenHocKy: string; namHoc: string };
    hocKyId: string; // Add this for edit
}

const ActivitiesPage: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<{ id: string; name: string } | null>(null);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await api.get('/activities');
            setActivities(response.data);
        } catch (error) {
            console.error('Failed to fetch activities', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hoạt động này không?')) {
            try {
                await api.delete(`/activities/${id}`);
                setActivities(activities.filter(activity => activity.id !== id));
            } catch (error) {
                console.error('Failed to delete activity', error);
                alert('Không thể xóa hoạt động. Vui lòng thử lại.');
            }
        }
    };

    const handleEdit = (activity: Activity) => {
        setEditingActivity(activity);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingActivity(null);
    };

    return (
        <Layout>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Quản Lý Hoạt Động</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        + Thêm Hoạt Động
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Tên Hoạt Động</th>
                                <th className="px-6 py-4">Ngày Diễn Ra</th>
                                <th className="px-6 py-4">Ngày Kết Thúc</th>
                                <th className="px-6 py-4">Địa Điểm</th>
                                <th className="px-6 py-4">Điểm</th>
                                <th className="px-6 py-4">Loại Tiêu Chí</th>
                                <th className="px-6 py-4">Học Kỳ</th>
                                <th className="px-6 py-4 text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : activities.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Chưa có hoạt động nào.
                                    </td>
                                </tr>
                            ) : (
                                activities.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{activity.tenHoatDong}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(activity.ngayDienRa).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {activity.ngayKetThuc ? new Date(activity.ngayKetThuc).toLocaleDateString('vi-VN') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{activity.diaDiem || 'N/A'}</td>
                                        <td className="px-6 py-4 font-bold text-indigo-600">+{activity.diemCong}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                {activity.loaiTieuChi}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {activity.hocKy.tenHocKy} ({activity.hocKy.namHoc})
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => setSelectedActivity({ id: activity.id, name: activity.tenHoatDong })}
                                                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm border border-indigo-600 px-3 py-1 rounded hover:bg-indigo-50"
                                            >
                                                Duyệt TG
                                            </button>
                                            <button
                                                onClick={() => handleEdit(activity)}
                                                className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(activity.id)}
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
            </div>

            <ActivityModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchActivities}
                initialData={editingActivity}
            />

            {selectedActivity && (
                <ManageParticipantsModal
                    isOpen={!!selectedActivity}
                    onClose={() => setSelectedActivity(null)}
                    activityId={selectedActivity.id}
                    activityName={selectedActivity.name}
                />
            )}
        </Layout>
    );
};

export default ActivitiesPage;
