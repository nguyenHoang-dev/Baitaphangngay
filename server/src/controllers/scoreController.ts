import { Request, Response } from 'express';
import { PrismaClient, XepLoai } from '@prisma/client';

const prisma = new PrismaClient();

// Calculate and update score for a student in a semester
export const calculateScore = async (req: Request, res: Response) => {
    try {
        const { sinhVienId, hocKyId } = req.body;

        // 1. Get all approved participations for this student in this semester
        const participations = await prisma.thamGia.findMany({
            where: {
                sinhVienId,
                trangThai: 'DA_DUYET',
                hoatDong: {
                    hocKyId
                }
            },
            include: {
                hoatDong: true
            }
        });

        // 2. Calculate total points
        let totalScore = participations.reduce((sum, p) => sum + p.hoatDong.diemCong, 0);
        if (totalScore > 100) totalScore = 100; // Cap at 100

        // 3. Determine Classification
        let classification: XepLoai = 'YEU';
        if (totalScore >= 90) classification = 'XUAT_SAC';
        else if (totalScore >= 80) classification = 'TOT';
        else if (totalScore >= 65) classification = 'KHA';
        else if (totalScore >= 50) classification = 'TRUNG_BINH';

        // 4. Calculate detailed scores by criteria type
        const detailedScores: Record<string, number> = {};
        participations.forEach(p => {
            const type = p.hoatDong.loaiTieuChi;
            detailedScores[type] = (detailedScores[type] || 0) + p.hoatDong.diemCong;
        });

        // 5. Upsert DiemRenLuyen record
        const scoreRecord = await prisma.diemRenLuyen.upsert({
            where: {
                sinhVienId_hocKyId: {
                    sinhVienId,
                    hocKyId
                }
            },
            update: {
                tongDiem: totalScore,
                xepLoai: classification,
                chiTietDiem: detailedScores
            },
            create: {
                sinhVienId,
                hocKyId,
                tongDiem: totalScore,
                xepLoai: classification,
                chiTietDiem: detailedScores
            }
        });

        res.json(scoreRecord);
    } catch (error) {
        res.status(500).json({ message: 'Error calculating score', error });
    }
};

// Get score for a student
export const getStudentScore = async (req: Request, res: Response) => {
    try {
        const { sinhVienId, hocKyId } = req.query;

        if (!sinhVienId || !hocKyId) {
            return res.status(400).json({ message: 'Missing sinhVienId or hocKyId' });
        }

        const score = await prisma.diemRenLuyen.findUnique({
            where: {
                sinhVienId_hocKyId: {
                    sinhVienId: String(sinhVienId),
                    hocKyId: String(hocKyId)
                }
            },
            include: {
                hocKy: true
            }
        });

        res.json(score || { tongDiem: 0, xepLoai: 'N/A' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching score', error });
    }
}
