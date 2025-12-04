import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const account = await prisma.taiKhoan.findUnique({
            where: { email },
            include: {
                sinhVien: true,
                quanTri: true,
            },
        });

        if (!account) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, account.password);

        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign(
            { userId: account.id, role: account.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: account.id,
                email: account.email,
                role: account.role,
                profile: account.sinhVien || account.quanTri,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    // This is mainly for testing or initial setup, as Admin creates Students usually
    try {
        const { email, password, role, hoTen, maSv, lopId } = req.body;

        const existingAccount = await prisma.taiKhoan.findUnique({ where: { email } });
        if (existingAccount) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = await prisma.taiKhoan.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });

        if (role === 'STUDENT') {
            if (!maSv || !lopId) {
                res.status(400).json({ message: 'Student requires maSv and lopId' });
                return;
            }
            await prisma.sinhVien.create({
                data: {
                    maSv,
                    hoTen,
                    lopId,
                    taiKhoanId: newAccount.id
                }
            })
        } else if (role === 'ADMIN') {
            await prisma.quanTri.create({
                data: {
                    hoTen,
                    taiKhoanId: newAccount.id
                }
            })
        }

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
