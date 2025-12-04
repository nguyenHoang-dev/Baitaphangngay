import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import StudentModal from '../components/StudentModal';

interface Student {
    id: string;
    maSv: string;
    hoTen: string;
    lop: { tenLop: string } | null;
    taiKhoan: { email: string };
    // Add other fields needed for edit
    ngaySinh: string;
    gioiTinh: string;
    lopId: string;
    soDienThoai: string;
}

const AdminDashboard: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/users');
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
            try {
                await api.delete(`/users/${id}`);
                setStudents(students.filter(student => student.id !== id));
            } catch (error) {
                console.error('Failed to delete student', error);
                alert('Không thể xóa sinh viên. Vui lòng thử lại.');
            }
        }
    };

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    return (
        <Layout>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Quản Lý Sinh Viên</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        + Thêm Sinh Viên
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Mã SV</th>
                                <th className="px-6 py-4">Họ Tên</th>
                                <th className="px-6 py-4">Lớp</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4 text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Không tìm thấy sinh viên nào.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.maSv}</td>
                                        <td className="px-6 py-4 text-gray-800">{student.hoTen}</td>
                                        <td className="px-6 py-4 text-gray-600">{student.lop?.tenLop || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{student.taiKhoan.email}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(student)}
                                                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
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

            <StudentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchStudents}
                initialData={selectedStudent}
            />
        </Layout>
    );
};

export default AdminDashboard;
