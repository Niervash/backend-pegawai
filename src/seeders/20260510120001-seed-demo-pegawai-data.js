'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ambil data dari tabel master untuk mendapatkan ID yang valid
    const jabatans = await queryInterface.sequelize.query(
      `SELECT id, nama FROM master_jabatan;`
    );
    const golongans = await queryInterface.sequelize.query(
      `SELECT id, kode FROM master_golongan;`
    );
    const units = await queryInterface.sequelize.query(
      `SELECT id, kode FROM master_unit_kerja;`
    );

    const jabatanRows = jabatans[0];
    const golonganRows = golongans[0];
    const unitRows = units[0];

    // Fungsi pembantu untuk mencari ID
    const getJabatanId = (nama) => jabatanRows.find(j => j.nama === nama)?.id || null;
    const getGolonganId = (kode) => golonganRows.find(g => g.kode === kode)?.id || null;
    const getUnitId = (kode) => unitRows.find(u => u.kode === kode)?.id || null;

    // Bersihkan data lama untuk menghindari unique constraint error (NIP)
    await queryInterface.bulkDelete('pegawai', null, {});

    await queryInterface.bulkInsert('pegawai', [
      {
        nip: 'admin',
        nama: 'Administrator System',
        jabatan_id: getJabatanId('Kepala Seksi Pengembangan Karier'), 
        golongan_id: getGolonganId('IV/a'), 
        unit_kerja_id: getUnitId('BKPSDM'), 
        email: 'admin@demo.local',
        phone: '08111111111',
        tmt_pangkat: '2020-01-01',
        tmt_kgb: '2022-01-01',
        tanggal_masuk: '2010-01-01',
        status: 'aktif'
      },
      {
        nip: 'pegawai',
        nama: 'Demo Pegawai User',
        jabatan_id: getJabatanId('Kepala Bidang Mutasi'), 
        golongan_id: getGolonganId('III/a'), 
        unit_kerja_id: getUnitId('DINKES'), 
        email: 'pegawai@demo.local',
        phone: '08123456789',
        tmt_pangkat: '2022-01-01',
        tmt_kgb: '2023-06-01',
        tanggal_masuk: '2015-01-01',
        status: 'aktif'
      },
      {
        nip: '198501012010011001',
        nama: 'Ir. Ahmad Subagja, M.Si',
        jabatan_id: getJabatanId('Kepala Dinas'), 
        golongan_id: getGolonganId('IV/b'), 
        unit_kerja_id: getUnitId('BKPSDM'), 
        email: 'ahmad.subagja@sikapas.local',
        phone: '081234567890',
        tmt_pangkat: '2022-04-01',
        tmt_kgb: '2023-01-01',
        tanggal_masuk: '2010-01-01',
        status: 'aktif'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('pegawai', null, {});
  }
};
