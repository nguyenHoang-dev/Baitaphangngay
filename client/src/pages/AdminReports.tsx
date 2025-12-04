import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';

interface StudentScore {
    id: string;
    maSv: string;
    hoTen: string;
    lop: { tenLop: string };
    diemRenLuyens: {
        tongDiem: number;
        xepLoai: string;
        hocKy: { tenHocKy: string; namHoc: string };
    }[];
}

const AdminReports: React.FC = () => {
    const [students, setStudents] = useState<StudentScore[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchScores();
    }, []);

    const fetchScores = async () => {
        try {
            // In a real app, we would have a dedicated endpoint for reports
            // For now, we'll fetch students and include their scores
            const response = await api.get('/users/students');
            // Note: The current getStudents controller might not include diemRenLuyens
            // We might need to update the controller or make separate calls.
            // Assuming we update the controller to include diemRenLuyens
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch scores', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800">Báo Cáo Điểm Rèn Luyện</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Mã SV</th>
                                <th className="px-6 py-4">Họ Tên</th>
                                <th className="px-6 py-4">Lớp</th>
                                <th className="px-6 py-4">Tổng Điểm</th>
                                <th className="px-6 py-4">Xếp Loại</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Đang tải báo cáo...
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Không có dữ liệu.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => {
                                    // Get latest score (mock logic)
                                    const latestScore = student.diemRenLuyens?.[0];
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{student.maSv}</td>
                                            <td className="px-6 py-4 text-gray-800">{student.hoTen}</td>
                                            <td className="px-6 py-4 text-gray-600">{student.lop?.tenLop || 'N/A'}</td>
                                            <td className="px-6 py-4 font-bold text-indigo-600">{latestScore?.tongDiem || 0}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${latestScore?.xepLoai === 'XUAT_SAC' ? 'bg-green-100 text-green-700' :
                                                    latestScore?.xepLoai === 'TOT' ? 'bg-blue-100 text-blue-700' :
                                                        latestScore?.xepLoai === 'KHA' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {latestScore?.xepLoai || 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default AdminReports;
