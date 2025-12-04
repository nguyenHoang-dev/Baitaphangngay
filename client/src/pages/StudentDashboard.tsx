import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import api from '../utils/api';
import type { RootState } from '../store/store';

interface Activity {
    id: string;
    tenHoatDong: string;
    ngayDienRa: string;
    diaDiem: string;
    diemCong: number;
    loaiTieuChi: string;
}

interface Participation {
    id: string;
    hoatDong: Activity;
    trangThai: string;
    ngayDangKy: string;
}

const StudentDashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [participations, setParticipations] = useState<Participation[]>([]);
    const [score, setScore] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.profile?.id) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const semestersRes = await api.get('/semesters');
            const currentSemester = semestersRes.data.find((s: any) => s.isCurrent) || semestersRes.data[0];

            const [activitiesRes, participationsRes, scoreRes] = await Promise.all([
                api.get('/activities'),
                api.get(`/participations/student/${user?.profile?.id}`),
                currentSemester ? api.get(`/scores?sinhVienId=${user?.profile?.id}&hocKyId=${currentSemester.id}`) : Promise.resolve({ data: null })
            ]);

            setActivities(activitiesRes.data);
            setParticipations(participationsRes.data);
            setScore(scoreRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (activityId: string) => {
        try {
            await api.post('/participations/register', {
                sinhVienId: user?.profile?.id,
                hoatDongId: activityId
            });
            alert('Đăng ký thành công!');
            fetchData();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Đăng ký thất bại');
        }
    };

    const isRegistered = (activityId: string) => {
        return participations.some(p => p.hoatDong.id === activityId);
    };

    const approvedCount = participations.filter(p => p.trangThai === 'DA_DUYET').length;
    const pendingCount = participations.filter(p => p.trangThai === 'CHO_DUYET').length;

    return (
        <Layout>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Tổng Quan</h2>
                <p className="text-gray-600">Chào mừng trở lại, {user?.profile?.hoTen}</p>
            </div>

            {loading ? (
                <div className="text-center py-12">Đang tải dữ liệu...</div>
            ) : (
                <div className="space-y-8">
                    {/* Profile & Stats Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-indigo-600">
                                {user?.profile?.hoTen?.charAt(0) || 'S'}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{user?.profile?.hoTen}</h3>
                            <p className="text-gray-500 mb-1">{user?.profile?.maSv}</p>
                            <p className="text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full text-sm">
                                {user?.profile?.lop?.tenLop || 'Chưa cập nhật lớp'}
                            </p>
                        </div>

                        {/* Score Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white flex flex-col justify-between">
                            <div>
                                <h4 className="text-indigo-100 font-medium mb-1">Điểm Rèn Luyện (Học kỳ này)</h4>
                                <div className="text-5xl font-bold">{score?.tongDiem || 0}</div>
                            </div>
                            <div className="mt-4">
                                <div className="text-indigo-200 text-sm mb-1">Xếp loại</div>
                                <div className="text-2xl font-bold">{score?.xepLoai || 'Chưa xếp loại'}</div>
                            </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h4 className="font-bold text-gray-800 mb-4">Thống Kê Hoạt Động</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-700 font-medium">Đã tham gia (Được duyệt)</span>
                                    <span className="text-2xl font-bold text-green-700">{approvedCount}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                    <span className="text-yellow-700 font-medium">Đang chờ duyệt</span>
                                    <span className="text-2xl font-bold text-yellow-700">{pendingCount}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium">Tổng đăng ký</span>
                                    <span className="text-2xl font-bold text-gray-800">{participations.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available Activities Section */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Hoạt Động Sắp Tới</h3>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {activities.slice(0, 3).map((activity) => (
                                <div key={activity.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                            {activity.loaiTieuChi}
                                        </span>
                                        <span className="font-bold text-indigo-600">+{activity.diemCong} điểm</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{activity.tenHoatDong}</h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        📅 {new Date(activity.ngayDienRa).toLocaleDateString('vi-VN')} <br />
                                        📍 {activity.diaDiem}
                                    </p>
                                    <button
                                        onClick={() => handleRegister(activity.id)}
                                        disabled={isRegistered(activity.id)}
                                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isRegistered(activity.id)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                    >
                                        {isRegistered(activity.id) ? 'Đã Đăng Ký' : 'Đăng Ký Ngay'}
                                    </button>
                                </div>
                            ))}
                        </div>
                        {activities.length > 3 && (
                            <div className="mt-4 text-center">
                                <button className="text-indigo-600 font-medium hover:text-indigo-800">Xem tất cả hoạt động →</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default StudentDashboard;
