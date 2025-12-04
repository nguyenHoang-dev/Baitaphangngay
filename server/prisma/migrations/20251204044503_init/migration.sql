-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT');

-- CreateEnum
CREATE TYPE "TrangThaiThamGia" AS ENUM ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI');

-- CreateEnum
CREATE TYPE "XepLoai" AS ENUM ('XUAT_SAC', 'TOT', 'KHA', 'TRUNG_BINH', 'YEU');

-- CreateTable
CREATE TABLE "TaiKhoan" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaiKhoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lop" (
    "id" TEXT NOT NULL,
    "tenLop" TEXT NOT NULL,
    "khoa" TEXT NOT NULL,

    CONSTRAINT "Lop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SinhVien" (
    "id" TEXT NOT NULL,
    "maSv" TEXT NOT NULL,
    "hoTen" TEXT NOT NULL,
    "ngaySinh" TIMESTAMP(3),
    "gioiTinh" TEXT,
    "lopId" TEXT NOT NULL,
    "taiKhoanId" TEXT NOT NULL,

    CONSTRAINT "SinhVien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuanTri" (
    "id" TEXT NOT NULL,
    "hoTen" TEXT NOT NULL,
    "taiKhoanId" TEXT NOT NULL,
    "lopId" TEXT,

    CONSTRAINT "QuanTri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HocKy" (
    "id" TEXT NOT NULL,
    "tenHocKy" TEXT NOT NULL,
    "namHoc" TEXT NOT NULL,
    "ngayBatDau" TIMESTAMP(3) NOT NULL,
    "ngayKetThuc" TIMESTAMP(3) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HocKy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoatDong" (
    "id" TEXT NOT NULL,
    "tenHoatDong" TEXT NOT NULL,
    "moTa" TEXT,
    "ngayDienRa" TIMESTAMP(3) NOT NULL,
    "diaDiem" TEXT,
    "diemCong" INTEGER NOT NULL,
    "hocKyId" TEXT NOT NULL,
    "loaiTieuChi" TEXT NOT NULL,

    CONSTRAINT "HoatDong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThamGia" (
    "id" TEXT NOT NULL,
    "sinhVienId" TEXT NOT NULL,
    "hoatDongId" TEXT NOT NULL,
    "trangThai" "TrangThaiThamGia" NOT NULL DEFAULT 'CHO_DUYET',
    "minhChung" TEXT,
    "ngayDangKy" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThamGia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiemRenLuyen" (
    "id" TEXT NOT NULL,
    "sinhVienId" TEXT NOT NULL,
    "hocKyId" TEXT NOT NULL,
    "tongDiem" INTEGER NOT NULL DEFAULT 0,
    "xepLoai" "XepLoai",
    "chiTietDiem" JSONB,

    CONSTRAINT "DiemRenLuyen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaiKhoan_email_key" ON "TaiKhoan"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "SinhVien_maSv_key" ON "SinhVien"("maSv");

-- CreateIndex
CREATE UNIQUE INDEX "SinhVien_taiKhoanId_key" ON "SinhVien"("taiKhoanId");

-- CreateIndex
CREATE UNIQUE INDEX "QuanTri_taiKhoanId_key" ON "QuanTri"("taiKhoanId");

-- CreateIndex
CREATE UNIQUE INDEX "QuanTri_lopId_key" ON "QuanTri"("lopId");

-- CreateIndex
CREATE UNIQUE INDEX "ThamGia_sinhVienId_hoatDongId_key" ON "ThamGia"("sinhVienId", "hoatDongId");

-- CreateIndex
CREATE UNIQUE INDEX "DiemRenLuyen_sinhVienId_hocKyId_key" ON "DiemRenLuyen"("sinhVienId", "hocKyId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TaiKhoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SinhVien" ADD CONSTRAINT "SinhVien_lopId_fkey" FOREIGN KEY ("lopId") REFERENCES "Lop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SinhVien" ADD CONSTRAINT "SinhVien_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuanTri" ADD CONSTRAINT "QuanTri_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuanTri" ADD CONSTRAINT "QuanTri_lopId_fkey" FOREIGN KEY ("lopId") REFERENCES "Lop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoatDong" ADD CONSTRAINT "HoatDong_hocKyId_fkey" FOREIGN KEY ("hocKyId") REFERENCES "HocKy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThamGia" ADD CONSTRAINT "ThamGia_sinhVienId_fkey" FOREIGN KEY ("sinhVienId") REFERENCES "SinhVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThamGia" ADD CONSTRAINT "ThamGia_hoatDongId_fkey" FOREIGN KEY ("hoatDongId") REFERENCES "HoatDong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiemRenLuyen" ADD CONSTRAINT "DiemRenLuyen_sinhVienId_fkey" FOREIGN KEY ("sinhVienId") REFERENCES "SinhVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiemRenLuyen" ADD CONSTRAINT "DiemRenLuyen_hocKyId_fkey" FOREIGN KEY ("hocKyId") REFERENCES "HocKy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
