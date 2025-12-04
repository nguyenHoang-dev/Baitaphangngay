import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClasses = async (req: Request, res: Response) => {
    try {
        const classes = await prisma.lop.findMany({
            include: {
                _count: {
                    select: { sinhViens: true }
                }
            }
        });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classes', error });
    }
};

export const createClass = async (req: Request, res: Response) => {
    try {
        const { tenLop, khoa } = req.body;
        const newClass = await prisma.lop.create({
            data: { tenLop, khoa }
        });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: 'Error creating class', error });
    }
}

export const deleteClass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.lop.delete({
            where: { id }
        });
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting class', error });
    }
};
