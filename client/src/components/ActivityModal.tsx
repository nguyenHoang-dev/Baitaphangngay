import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface ActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any; // Data for editing
}

interface Semester {
    id: string;
    tenHocKy: string;
    namHoc: string;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [formData, setFormData] = useState({
        tenHoatDong: '',
        moTa: '',
        ngayDienRa: '',
        ngayKetThuc: '',
        diaDiem: '',
        diemCong: '',
        loaiTieuChi: 'HOC_TAP',
        hocKyId: ''
    });
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchSemesters();
            if (initialData) {
                setFormData({
                    tenHoatDong: initialData.tenHoatDong,
                    moTa: initialData.moTa || '',
                    ngayDienRa: new Date(initialData.ngayDienRa).toISOString().slice(0, 16),
                    ngayKetThuc: initialData.ngayKetThuc ? new Date(initialData.ngayKetThuc).toISOString().slice(0, 16) : '',
                    diaDiem: initialData.diaDiem || '',
                    diemCong: initialData.diemCong.toString(),
                    loaiTieuChi: initialData.loaiTieuChi,
                    hocKyId: initialData.hocKyId
                });
            } else {
                setFormData({
                    tenHoatDong: '',
                    moTa: '',
                    ngayDienRa: '',
                    ngayKetThuc: '',
                    diaDiem: '',
                    diemCong: '',
                    loaiTieuChi: 'HOC_TAP',
                    hocKyId: ''
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchSemesters = async () => {
        try {
            const response = await api.get('/semesters');
            setSemesters(response.data);
        } catch (err) {
            console.error('Failed to fetch semesters');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (initialData) {
                await api.put(`/activities/${initialData.id}`, formData);
            } else {
                await api.post('/activities', formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to ${initialData ? 'update' : 'create'} activity`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Activity' : 'Add New Activity'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name</label>
                        <input
                            type="text"
                            name="tenHoatDong"
                            value={formData.tenHoatDong}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="moTa"
                            value={formData.moTa}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="datetime-local"
                            name="ngayDienRa"
                            value={formData.ngayDienRa}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="datetime-local"
                            name="ngayKetThuc"
                            value={formData.ngayKetThuc}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="diaDiem"
                            value={formData.diaDiem}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                        <input
                            type="number"
                            name="diemCong"
                            value={formData.diemCong}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Criteria Type</label>
                        <select
                            name="loaiTieuChi"
                            value={formData.loaiTieuChi}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="HOC_TAP">Học tập</option>
                            <option value="KY_LUAT">Kỷ luật</option>
                            <option value="NGOAI_KHOA">Ngoại khóa</option>
                            <option value="KY_NANG">Kỹ năng</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                        <select
                            name="hocKyId"
                            value={formData.hocKyId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">Select Semester</option>
                            {semesters.map((sem) => (
                                <option key={sem.id} value={sem.id}>{sem.tenHocKy} ({sem.namHoc})</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2 flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (initialData ? 'Update Activity' : 'Create Activity')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActivityModal;
