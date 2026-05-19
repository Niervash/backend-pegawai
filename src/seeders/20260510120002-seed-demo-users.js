'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Bersihkan data lama
    await queryInterface.bulkDelete('users', null, {});
    
    await queryInterface.bulkInsert('users', [
      {
        name: 'Demo Admin',
        nip: 'admin',
        email: 'admin@demo.local',
        password: hashedPassword,
        role: 'admin',
        jabatan: 'Administrator Demo',
        created_at: new Date(),
      },
      {
        name: 'Demo Pegawai',
        nip: 'pegawai',
        email: 'pegawai@demo.local',
        password: hashedPassword,
        role: 'pegawai',
        jabatan: 'Pegawai Demo',
        created_at: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { 
      nip: ['admin', 'pegawai'] 
    }, {});
  }
};
