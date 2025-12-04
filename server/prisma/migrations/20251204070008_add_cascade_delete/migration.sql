-- DropForeignKey
ALTER TABLE "DiemRenLuyen" DROP CONSTRAINT "DiemRenLuyen_sinhVienId_fkey";

-- DropForeignKey
ALTER TABLE "SinhVien" DROP CONSTRAINT "SinhVien_taiKhoanId_fkey";

-- DropForeignKey
ALTER TABLE "ThamGia" DROP CONSTRAINT "ThamGia_hoatDongId_fkey";

-- DropForeignKey
ALTER TABLE "ThamGia" DROP CONSTRAINT "ThamGia_sinhVienId_fkey";

-- AddForeignKey
ALTER TABLE "SinhVien" ADD CONSTRAINT "SinhVien_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThamGia" ADD CONSTRAINT "ThamGia_sinhVienId_fkey" FOREIGN KEY ("sinhVienId") REFERENCES "SinhVien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThamGia" ADD CONSTRAINT "ThamGia_hoatDongId_fkey" FOREIGN KEY ("hoatDongId") REFERENCES "HoatDong"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiemRenLuyen" ADD CONSTRAINT "DiemRenLuyen_sinhVienId_fkey" FOREIGN KEY ("sinhVienId") REFERENCES "SinhVien"("id") ON DELETE CASCADE ON UPDATE CASCADE;
