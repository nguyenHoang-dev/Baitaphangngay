import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

const firstNames = ['An', 'Bình', 'Cường', 'Dũng', 'Giang', 'Hải', 'Hùng', 'Huy', 'Khánh', 'Lan', 'Linh', 'Minh', 'Nam', 'Nghĩa', 'Phong', 'Phúc', 'Quân', 'Quang', 'Sơn', 'Thành', 'Thảo', 'Thịnh', 'Trang', 'Trung', 'Tuấn', 'Tùng', 'Việt', 'Vinh', 'Yến'];
const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const middleNames = ['Văn', 'Thị', 'Đức', 'Thành', 'Minh', 'Hữu', 'Thanh', 'Quang', 'Ngọc', 'Xuân'];

function generateRandomName() {
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    return `${lastName} ${middleName} ${firstName}`;
}

function generatePhoneNumber() {
    const prefixes = ['09', '03', '07', '08', '05'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return prefix + suffix;
}

async function main() {
    console.log('Start seeding...');

    // Clean up existing data
    console.log('Cleaning up database...');
    await prisma.thamGia.deleteMany();
    await prisma.diemRenLuyen.deleteMany();
    await prisma.sinhVien.deleteMany();
    await prisma.quanTri.deleteMany();
    await prisma.hoatDong.deleteMany();
    await prisma.lop.deleteMany();
    await prisma.hocKy.deleteMany();
    await prisma.taiKhoan.deleteMany();
    console.log('Database cleaned.');

    // 1. Create Admin
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

    // 2. Create Semester
    const semester = await prisma.hocKy.create({
        data: {
            tenHocKy: 'Học kỳ 1',
            namHoc: '2024-2025',
            ngayBatDau: new Date('2024-09-01'),
            ngayKetThuc: new Date('2025-01-15'),
            isCurrent: true,
        },
    });

    // 3. Create Classes
    const classes = [];
    for (let i = 1; i <= 6; i++) {
        const className = `D24CQCC0${i}-B`;
        const newClass = await prisma.lop.create({
            data: {
                tenLop: className,
                khoa: 'CNTT UDU',
            },
        });
        classes.push(newClass);
        console.log(`Created class: ${className}`);
    }

    // 4. Create Students
    console.log('Creating students...');
    const studentsPerClass = 30;

    for (let i = 0; i < 180; i++) {
        const studentIndex = i + 1;
        const msvSuffix = studentIndex.toString().padStart(3, '0');
        const msv = `D24CQCC${msvSuffix}`;
        const name = generateRandomName();
        // Email format: Name + XXX@stu.ptit.edu.vn (simplified name for email)
        const nameParts = name.split(' ');
        const firstName = nameParts[nameParts.length - 1];
        // Remove accents for email
        const normalizedFirstName = firstName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const email = `${normalizedFirstName.toLowerCase()}${msvSuffix}@stu.ptit.edu.vn`;

        const password = await bcrypt.hash(msv, 10); // Password is msv

        // Determine class based on index
        const classIndex = Math.floor(i / studentsPerClass);
        const assignedClass = classes[classIndex];

        const account = await prisma.taiKhoan.create({
            data: {
                email,
                password,
                role: Role.STUDENT,
            },
        });

        await prisma.sinhVien.create({
            data: {
                maSv: msv,
                hoTen: name,
                ngaySinh: new Date('2006-01-01'), // Year 2006 as requested
                gioiTinh: Math.random() > 0.5 ? 'Nam' : 'Nữ',
                lopId: assignedClass.id,
                taiKhoanId: account.id,
            },
        });

        if (i % 10 === 0) console.log(`Created student ${msv}`);
    }

    // 5. Create Activities based on user request
    console.log('Creating activities...');
    const activities = [
        {
            tenHoatDong: 'Tham gia đầy đủ các hoạt động chính trị, xã hội',
            moTa: 'Tham gia các buổi sinh hoạt chuyên đề do Học viện, lớp/chi đoàn tổ chức',
            diemCong: 10,
            loaiTieuChi: 'HOC_TAP',
            ngayDienRa: new Date('2024-09-15'),
            ngayKetThuc: new Date('2024-12-30'),
            diaDiem: 'Hội trường A'
        },
        {
            tenHoatDong: 'Hiến máu nhân đạo đợt 1',
            moTa: 'Tham gia công tác xã hội: hiến máu nhân đạo',
            diemCong: 10,
            loaiTieuChi: 'NGOAI_KHOA',
            ngayDienRa: new Date('2024-10-10'),
            ngayKetThuc: new Date('2024-10-10'),
            diaDiem: 'Sảnh A'
        },
        {
            tenHoatDong: 'Ủng hộ người nghèo gặp thiên tai lũ lụt',
            moTa: 'Tham gia công tác xã hội: ủng hộ đồng bào lũ lụt',
            diemCong: 5,
            loaiTieuChi: 'NGOAI_KHOA',
            ngayDienRa: new Date('2024-10-20'),
            ngayKetThuc: new Date('2024-10-25'),
            diaDiem: 'Văn phòng Đoàn'
        },
        {
            tenHoatDong: 'Tuyên truyền hình ảnh Trường/Khoa trên MXH',
            moTa: 'Tuyên truyền tích cực hình ảnh về Trường/Khoa trên các trang mạng xã hội',
            diemCong: 5,
            loaiTieuChi: 'KY_NANG',
            ngayDienRa: new Date('2024-09-01'),
            ngayKetThuc: new Date('2024-12-31'),
            diaDiem: 'Online'
        },
        {
            tenHoatDong: 'Tham gia phòng chống tệ nạn xã hội',
            moTa: 'Tích cực tham gia các hoạt động phòng, chống tội phạm, các tệ nạn xã hội',
            diemCong: 5,
            loaiTieuChi: 'KY_LUAT',
            ngayDienRa: new Date('2024-11-01'),
            ngayKetThuc: new Date('2024-11-30'),
            diaDiem: 'Ký túc xá'
        },
        {
            tenHoatDong: 'Tham gia CLB Tin học',
            moTa: 'Thành viên tham gia các Câu lạc bộ, đội nhóm trực thuộc Học viện/khoa',
            diemCong: 5,
            loaiTieuChi: 'KY_NANG',
            ngayDienRa: new Date('2024-09-01'),
            ngayKetThuc: new Date('2025-01-01'),
            diaDiem: 'Phòng Lab 3'
        },
        {
            tenHoatDong: 'Lớp trưởng/Bí thư chi đoàn',
            moTa: 'Sinh viên được Học viện phân công làm lớp trưởng, lớp phó, bí thư...',
            diemCong: 10,
            loaiTieuChi: 'KY_NANG',
            ngayDienRa: new Date('2024-09-01'),
            ngayKetThuc: new Date('2025-01-15'),
            diaDiem: 'Lớp học'
        },
        {
            tenHoatDong: 'Đạt thành tích đặc biệt trong học tập',
            moTa: 'Sinh viên đạt thành tích đặc biệt trong học tập, rèn luyện',
            diemCong: 10,
            loaiTieuChi: 'HOC_TAP',
            ngayDienRa: new Date('2025-01-10'),
            ngayKetThuc: new Date('2025-01-10'),
            diaDiem: 'Học viện'
        },
        {
            tenHoatDong: 'Tham gia cuộc thi Olympic Tin học',
            moTa: 'Tham gia cuộc thi Olympic Tin học cấp trường/quốc gia',
            diemCong: 15,
            loaiTieuChi: 'HOC_TAP',
            ngayDienRa: new Date('2024-11-15'),
            ngayKetThuc: new Date('2024-11-20'),
            diaDiem: 'Hà Nội'
        },
        {
            tenHoatDong: 'Tham gia chiến dịch Mùa Hè Xanh',
            moTa: 'Tham gia chiến dịch tình nguyện Mùa Hè Xanh',
            diemCong: 15,
            loaiTieuChi: 'NGOAI_KHOA',
            ngayDienRa: new Date('2024-07-01'),
            ngayKetThuc: new Date('2024-07-30'),
            diaDiem: 'Vùng cao'
        },
        {
            tenHoatDong: 'Có chứng chỉ Tiếng Anh quốc tế (IELTS/TOEIC)',
            moTa: 'Nộp chứng chỉ tiếng Anh quốc tế còn hạn',
            diemCong: 10,
            loaiTieuChi: 'HOC_TAP',
            ngayDienRa: new Date('2024-09-01'),
            ngayKetThuc: new Date('2025-01-15'),
            diaDiem: 'Phòng Đào tạo'
        },
        {
            tenHoatDong: 'Tham gia dọn vệ sinh khu phố/trường học',
            moTa: 'Tham gia các buổi lao động công ích',
            diemCong: 5,
            loaiTieuChi: 'NGOAI_KHOA',
            ngayDienRa: new Date('2024-12-05'),
            ngayKetThuc: new Date('2024-12-05'),
            diaDiem: 'Khuôn viên trường'
        },
        {
            tenHoatDong: 'Không vi phạm quy chế thi',
            moTa: 'Chấp hành nghiêm túc quy chế thi cử trong học kỳ',
            diemCong: 10,
            loaiTieuChi: 'KY_LUAT',
            ngayDienRa: new Date('2025-01-01'),
            ngayKetThuc: new Date('2025-01-15'),
            diaDiem: 'Học viện'
        },
        {
            tenHoatDong: 'Đóng học phí đúng hạn',
            moTa: 'Hoàn thành nghĩa vụ đóng học phí đúng thời hạn quy định',
            diemCong: 5,
            loaiTieuChi: 'KY_LUAT',
            ngayDienRa: new Date('2024-09-01'),
            ngayKetThuc: new Date('2025-01-15'),
            diaDiem: 'Phòng Tài chính'
        }
    ];

    for (const act of activities) {
        await prisma.hoatDong.create({
            data: {
                ...act,
                hocKyId: semester.id
            }
        });
    }
    console.log('Activities created.');

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(JSON.stringify(e, null, 2));
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
