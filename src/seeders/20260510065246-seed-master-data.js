'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Bersihkan data lama untuk menghindari unique constraint error
    await queryInterface.bulkDelete('master_golongan', null, {});
    await queryInterface.bulkDelete('master_jabatan', null, {});
    await queryInterface.bulkDelete('master_unit_kerja', null, {});

    // 1. Master Golongan (Standar PNS Indonesia)
    await queryInterface.bulkInsert('master_golongan', [
      { kode: 'I/a', nama: 'Juru Muda', ruang: 'a' },
      { kode: 'I/b', nama: 'Juru Muda Tingkat I', ruang: 'b' },
      { kode: 'I/c', nama: 'Juru', ruang: 'c' },
      { kode: 'I/d', nama: 'Juru Tingkat I', ruang: 'd' },
      { kode: 'II/a', nama: 'Pengatur Muda', ruang: 'a' },
      { kode: 'II/b', nama: 'Pengatur Muda Tingkat I', ruang: 'b' },
      { kode: 'II/c', nama: 'Pengatur', ruang: 'c' },
      { kode: 'II/d', nama: 'Pengatur Tingkat I', ruang: 'd' },
      { kode: 'III/a', nama: 'Penata Muda', ruang: 'a' },
      { kode: 'III/b', nama: 'Penata Muda Tingkat I', ruang: 'b' },
      { kode: 'III/c', nama: 'Penata', ruang: 'c' },
      { kode: 'III/d', nama: 'Penata Tingkat I', ruang: 'd' },
      { kode: 'IV/a', nama: 'Pembina', ruang: 'a' },
      { kode: 'IV/b', nama: 'Pembina Tingkat I', ruang: 'b' },
      { kode: 'IV/c', nama: 'Pembina Utama Muda', ruang: 'c' },
      { kode: 'IV/d', nama: 'Pembina Utama Madya', ruang: 'd' },
      { kode: 'IV/e', nama: 'Pembina Utama', ruang: 'e' },
    ]);

    // 2. Master Jabatan (Struktural, Fungsional, Pelaksana)
    await queryInterface.bulkInsert('master_jabatan', [
      { nama: 'Kepala Dinas', tipe: 'Struktural', eselon: 'II.a' },
      { nama: 'Sekretaris Dinas', tipe: 'Struktural', eselon: 'III.a' },
      { nama: 'Kepala Bidang Mutasi', tipe: 'Struktural', eselon: 'III.b' },
      { nama: 'Kepala Seksi Pengembangan Karier', tipe: 'Struktural', eselon: 'IV.a' },
      { nama: 'Analisis Kepegawaian Ahli Pertama', tipe: 'Fungsional', eselon: '-' },
      { nama: 'Analisis Kepegawaian Ahli Muda', tipe: 'Fungsional', eselon: '-' },
      { nama: 'Pranata Komputer Ahli Pertama', tipe: 'Fungsional', eselon: '-' },
      { nama: 'Auditor Kepegawaian', tipe: 'Fungsional', eselon: '-' },
      { nama: 'Pengadministrasi Umum', tipe: 'Pelaksana', eselon: '-' },
      { nama: 'Pengolah Data Kepegawaian', tipe: 'Pelaksana', eselon: '-' },
    ]);

    // 3. Master Unit Kerja (Perangkat Daerah)
    await queryInterface.bulkInsert('master_unit_kerja', [
      { kode: 'SETDA', nama: 'Sekretariat Daerah', lokasi: 'Gedung Pusat Kompleks Perkantoran' },
      { kode: 'BKPSDM', nama: 'Badan Kepegawaian dan Pengembangan SDM', lokasi: 'Gedung B Lt. 1-3' },
      { kode: 'BAPPEDA', nama: 'Badan Perencanaan Pembangunan Daerah', lokasi: 'Gedung C Lt. 1' },
      { kode: 'DINKES', nama: 'Dinas Kesehatan', lokasi: 'Jl. Ahmad Yani No. 10' },
      { kode: 'DISDIK', nama: 'Dinas Pendidikan', lokasi: 'Jl. Merdeka No. 5' },
      { kode: 'DISKOMINFO', nama: 'Dinas Komunikasi dan Informatika', lokasi: 'Gedung D Lt. 2' },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('master_unit_kerja', null, {});
    await queryInterface.bulkDelete('master_jabatan', null, {});
    await queryInterface.bulkDelete('master_golongan', null, {});
  }
};
