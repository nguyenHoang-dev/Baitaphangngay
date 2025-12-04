import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSemesters = async (req: Request, res: Response) => {
    try {
        const semesters = await prisma.hocKy.findMany({
            orderBy: { namHoc: 'desc' }
        });
        res.json(semesters);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching semesters', error });
    }
};

export const createSemester = async (req: Request, res: Response) => {
    try {
        const { tenHocKy, namHoc, ngayBatDau, ngayKetThuc } = req.body;
        const newSemester = await prisma.hocKy.create({
            data: {
                tenHocKy,
                namHoc,
                ngayBatDau: new Date(ngayBatDau),
                ngayKetThuc: new Date(ngayKetThuc)
            }
        });
        res.status(201).json(newSemester);
    } catch (error) {
        res.status(500).json({ message: 'Error creating semester', error });
    }
}

export const setCurrentSemester = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Transaction to unset current and set new current
        await prisma.$transaction([
            prisma.hocKy.updateMany({ data: { isCurrent: false } }),
            prisma.hocKy.update({ where: { id }, data: { isCurrent: true } })
        ]);

        res.json({ message: 'Current semester updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating current semester', error });
    }
}
