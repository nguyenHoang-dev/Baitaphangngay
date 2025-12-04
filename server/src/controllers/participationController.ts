import { Request, Response } from 'express';
import { PrismaClient, TrangThaiThamGia } from '@prisma/client';

const prisma = new PrismaClient();

// Register for an activity
export const registerActivity = async (req: Request, res: Response) => {
    try {
        const { sinhVienId, hoatDongId, minhChung } = req.body;

        // Check if already registered
        const existing = await prisma.thamGia.findUnique({
            where: {
                sinhVienId_hoatDongId: {
                    sinhVienId,
                    hoatDongId
                }
            }
        });

        if (existing) {
            return res.status(400).json({ message: 'Already registered for this activity' });
        }

        const participation = await prisma.thamGia.create({
            data: {
                sinhVienId,
                hoatDongId,
                minhChung,
                trangThai: TrangThaiThamGia.CHO_DUYET
            }
        });

        res.status(201).json(participation);
    } catch (error) {
        res.status(500).json({ message: 'Error registering for activity', error });
    }
};

// Get student's participations
export const getStudentParticipations = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const participations = await prisma.thamGia.findMany({
            where: { sinhVienId: studentId },
            include: {
                hoatDong: true
            },
            orderBy: { ngayDangKy: 'desc' }
        });
        res.json(participations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching participations', error });
    }
}

// Update participation status (for Admin)
export const updateParticipationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { trangThai } = req.body;

        const participation = await prisma.thamGia.update({
            where: { id },
            data: { trangThai },
            include: { hoatDong: true }
        });

        // If approved, recalculate score
        if (trangThai === 'DA_DUYET') {
            const studentId = participation.sinhVienId;
            const semesterId = participation.hoatDong.hocKyId;

            // Get all approved participations for this student in this semester
            const approvedParticipations = await prisma.thamGia.findMany({
                where: {
                    sinhVienId: studentId,
                    trangThai: 'DA_DUYET',
                    hoatDong: {
                        hocKyId: semesterId
                    }
                },
                include: { hoatDong: true }
            });

            // Calculate total score
            let totalScore = approvedParticipations.reduce((sum, p) => sum + p.hoatDong.diemCong, 0);

            // Cap at 100
            if (totalScore > 100) totalScore = 100;

            // Determine classification
            let xepLoai = 'YEU';
            if (totalScore >= 90) xepLoai = 'XUAT_SAC';
            else if (totalScore >= 80) xepLoai = 'TOT';
            else if (totalScore >= 65) xepLoai = 'KHA';
            else if (totalScore >= 50) xepLoai = 'TRUNG_BINH';

            // Update or create DiemRenLuyen
            await prisma.diemRenLuyen.upsert({
                where: {
                    sinhVienId_hocKyId: {
                        sinhVienId: studentId,
                        hocKyId: semesterId
                    }
                },
                update: {
                    tongDiem: totalScore,
                    xepLoai: xepLoai as any
                },
                create: {
                    sinhVienId: studentId,
                    hocKyId: semesterId,
                    tongDiem: totalScore,
                    xepLoai: xepLoai as any
                }
            });
        }

        res.json(participation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating status', error });
    }
}
// Get all participations (for Admin)
export const getAllParticipations = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const whereClause = status ? { trangThai: status as TrangThaiThamGia } : {};

        const participations = await prisma.thamGia.findMany({
            where: whereClause,
            include: {
                sinhVien: {
                    include: {
                        lop: true
                    }
                },
                hoatDong: true
            },
            orderBy: { ngayDangKy: 'desc' }
        });
        res.json(participations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching participations', error });
    }
}
