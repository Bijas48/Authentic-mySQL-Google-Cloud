/*
  Warnings:

  - The primary key for the `laporan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pemasukan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pengeluaran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `laporan` DROP FOREIGN KEY `Laporan_idTransaksiPemasukan_fkey`;

-- DropForeignKey
ALTER TABLE `laporan` DROP FOREIGN KEY `Laporan_idTransaksiPengeluaran_fkey`;

-- DropForeignKey
ALTER TABLE `laporan` DROP FOREIGN KEY `Laporan_idUser_fkey`;

-- DropForeignKey
ALTER TABLE `pemasukan` DROP FOREIGN KEY `Pemasukan_idUser_fkey`;

-- DropForeignKey
ALTER TABLE `pengeluaran` DROP FOREIGN KEY `Pengeluaran_idUser_fkey`;

-- AlterTable
ALTER TABLE `laporan` DROP PRIMARY KEY,
    MODIFY `idLaporan` VARCHAR(191) NOT NULL,
    MODIFY `idUser` VARCHAR(191) NOT NULL,
    MODIFY `idTransaksiPengeluaran` VARCHAR(191) NULL,
    MODIFY `idTransaksiPemasukan` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`idLaporan`);

-- AlterTable
ALTER TABLE `pemasukan` DROP PRIMARY KEY,
    MODIFY `idTransaksiPemasukan` VARCHAR(191) NOT NULL,
    MODIFY `idUser` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idTransaksiPemasukan`);

-- AlterTable
ALTER TABLE `pengeluaran` DROP PRIMARY KEY,
    MODIFY `idTransaksiPengeluaran` VARCHAR(191) NOT NULL,
    MODIFY `idUser` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idTransaksiPengeluaran`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Pemasukan` ADD CONSTRAINT `Pemasukan_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengeluaran` ADD CONSTRAINT `Pengeluaran_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_idTransaksiPemasukan_fkey` FOREIGN KEY (`idTransaksiPemasukan`) REFERENCES `Pemasukan`(`idTransaksiPemasukan`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_idTransaksiPengeluaran_fkey` FOREIGN KEY (`idTransaksiPengeluaran`) REFERENCES `Pengeluaran`(`idTransaksiPengeluaran`) ON DELETE SET NULL ON UPDATE CASCADE;
