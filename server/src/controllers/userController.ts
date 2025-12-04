import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Get all students
export const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.sinhVien.findMany({
            include: {
                taiKhoan: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
                lop: {
                    select: {
                        tenLop: true,
                    },
                },
                diemRenLuyens: {
                    orderBy: {
                        hocKy: {
                            namHoc: 'desc'
                        }
                    },
                    take: 1
                }
            },
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
};

// Create a new student
export const createStudent = async (req: Request, res: Response) => {
    try {
        const { maSv, hoTen, email, password, ngaySinh, gioiTinh, lopId } = req.body;

        // Check if email or maSv exists
        const existingEmail = await prisma.taiKhoan.findUnique({ where: { email } });
        if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

        const existingMaSv = await prisma.sinhVien.findUnique({ where: { maSv } });
        if (existingMaSv) return res.status(400).json({ message: 'Student ID already exists' });

        // 1. Create Account
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = await prisma.taiKhoan.create({
            data: {
                email,
                password: hashedPassword,
                role: Role.STUDENT
            }
        });

        // 2. Create Student Profile
        const newStudent = await prisma.sinhVien.create({
            data: {
                maSv,
                hoTen,
                ngaySinh: new Date(ngaySinh),
                gioiTinh,
                lopId,
                taiKhoanId: newAccount.id
            }
        });

        res.status(201).json(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating student', error });
    }
};

// Update student
export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { maSv, hoTen, ngaySinh, gioiTinh, lopId } = req.body;

        const updatedStudent = await prisma.sinhVien.update({
            where: { id },
            data: {
                maSv,
                hoTen,
                ngaySinh: new Date(ngaySinh),
                gioiTinh,
                lopId
            }
        });
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error });
    }
}

// Delete student (and account)
export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const student = await prisma.sinhVien.findUnique({ where: { id } });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        await prisma.$transaction([
            prisma.sinhVien.delete({ where: { id } }),
            prisma.taiKhoan.delete({ where: { id: student.taiKhoanId } })
        ]);

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error });
    }
}

// Get students by class ID
export const getStudentsByClass = async (req: Request, res: Response) => {
    try {
        const { classId } = req.params;
        const students = await prisma.sinhVien.findMany({
            where: { lopId: classId },
            include: {
                taiKhoan: { select: { email: true } },
                lop: { select: { tenLop: true } }
            }
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching class students', error });
    }
};
