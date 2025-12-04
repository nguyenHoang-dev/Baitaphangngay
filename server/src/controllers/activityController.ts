import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getActivities = async (req: Request, res: Response) => {
    try {
        const activities = await prisma.hoatDong.findMany({
            include: {
                hocKy: true
            },
            orderBy: { ngayDienRa: 'desc' }
        });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error });
    }
};

export const createActivity = async (req: Request, res: Response) => {
    try {
        const { tenHoatDong, moTa, ngayDienRa, ngayKetThuc, diaDiem, diemCong, loaiTieuChi, hocKyId } = req.body;

        const newActivity = await prisma.hoatDong.create({
            data: {
                tenHoatDong,
                moTa,
                ngayDienRa: new Date(ngayDienRa),
                ngayKetThuc: ngayKetThuc ? new Date(ngayKetThuc) : null,
                diaDiem,
                diemCong: parseInt(diemCong),
                loaiTieuChi,
                hocKyId
            }
        });
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: 'Error creating activity', error });
    }
}

export const updateActivity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tenHoatDong, moTa, ngayDienRa, ngayKetThuc, diaDiem, diemCong, loaiTieuChi, hocKyId } = req.body;

        const updatedActivity = await prisma.hoatDong.update({
            where: { id },
            data: {
                tenHoatDong,
                moTa,
                ngayDienRa: new Date(ngayDienRa),
                ngayKetThuc: ngayKetThuc ? new Date(ngayKetThuc) : null,
                diaDiem,
                diemCong: parseInt(diemCong),
                loaiTieuChi,
                hocKyId
            }
        });
        res.json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error });
    }
}

export const deleteActivity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.hoatDong.delete({ where: { id } });
        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activity', error });
    }
}
