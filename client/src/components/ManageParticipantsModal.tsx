import React, { useEffect, useState } from 'react';
import api from '../utils/api';

interface Participant {
    id: string;
    sinhVien: {
        maSv: string;
        hoTen: string;
        lop: { tenLop: string };
    };
    trangThai: string;
    ngayDangKy: string;
}

interface ManageParticipantsModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityId: string;
    activityName: string;
}

const ManageParticipantsModal: React.FC<ManageParticipantsModalProps> = ({ isOpen, onClose, activityId, activityName }) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && activityId) {
            fetchParticipants();
        }
    }, [isOpen, activityId]);

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/participations/activity/${activityId}`);
            setParticipants(response.data);
        } catch (error) {
            console.error('Failed to fetch participants', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (participationId: string, status: 'DA_DUYET' | 'TU_CHOI') => {
        try {
            await api.put(`/participations/${participationId}/status`, { trangThai: status });
            fetchParticipants(); // Refresh list
        } catch (error) {
            alert('Cập nhật trạng thái thất bại');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Duyệt tham gia: {activityName}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">Đang tải...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-3">Mã SV</th>
                                    <th className="px-6 py-3">Họ Tên</th>
                                    <th className="px-6 py-3">Lớp</th>
                                    <th className="px-6 py-3">Ngày Đăng Ký</th>
                                    <th className="px-6 py-3">Trạng Thái</th>
                                    <th className="px-6 py-3 text-right">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {participants.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Chưa có sinh viên nào đăng ký.
                                        </td>
                                    </tr>
                                ) : (
                                    participants.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{p.sinhVien.maSv}</td>
                                            <td className="px-6 py-4">{p.sinhVien.hoTen}</td>
                                            <td className="px-6 py-4 text-gray-600">{p.sinhVien.lop?.tenLop}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(p.ngayDangKy).toLocaleDateString('vi-VN')}
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
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {p.trangThai === 'CHO_DUYET' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(p.id, 'DA_DUYET')}
                                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                                        >
                                                            Duyệt
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(p.id, 'TU_CHOI')}
                                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                        >
                                                            Từ Chối
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageParticipantsModal;
