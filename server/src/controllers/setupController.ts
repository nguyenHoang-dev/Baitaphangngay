import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const setupDatabase = async (req: Request, res: Response) => {
    try {
        // 1. Create Semester
        let semester = await prisma.hocKy.findFirst({
            where: { tenHocKy: 'Học kỳ 1', namHoc: '2023-2024' }
        });

        if (!semester) {
            semester = await prisma.hocKy.create({
                data: {
                    tenHocKy: 'Học kỳ 1',
                    namHoc: '2023-2024',
                    ngayBatDau: new Date('2023-09-01'),
                    ngayKetThuc: new Date('2024-01-15'),
                    isCurrent: true,
                },
            });
        }

        // 2. Create Class
        let lopA = await prisma.lop.findFirst({
            where: { tenLop: 'CNTT-K60' }
        });

        if (!lopA) {
            lopA = await prisma.lop.create({
                data: {
                    tenLop: 'CNTT-K60',
                    khoa: 'Công nghệ thông tin',
                },
            });
        }

        // 3. Create Admin Account
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminAccount = await prisma.taiKhoan.upsert({
            where: { email: 'admin@qlsv.com' },
            update: {},
            create: {
                email: 'admin@qlsv.com',
                password: adminPassword,
                role: Role.ADMIN,
            },
        });

        await prisma.quanTri.upsert({
            where: { taiKhoanId: adminAccount.id },
            update: {},
            create: {
                hoTen: 'Quản Trị Viên',
                taiKhoanId: adminAccount.id,
            },
        });

        // 4. Create Student Account
        const studentPassword = await bcrypt.hash('student123', 10);
        const studentAccount = await prisma.taiKhoan.upsert({
            where: { email: 'student@qlsv.com' },
            update: {},
            create: {
                email: 'student@qlsv.com',
                password: studentPassword,
                role: Role.STUDENT,
            }
        });

        const existingStudent = await prisma.sinhVien.findUnique({
            where: { maSv: 'SV001' }
        });

        if (!existingStudent) {
            await prisma.sinhVien.create({
                data: {
                    maSv: 'SV001',
                    hoTen: 'Nguyễn Văn A',
                    lopId: lopA.id,
                    taiKhoanId: studentAccount.id
                }
            });
        }

        res.json({ message: 'Database setup completed successfully!' });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ message: 'Setup failed', error });
    }
};
