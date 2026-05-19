CREATE DATABASE IF NOT EXISTS sikapas_db;
USE sikapas_db;

-- 1. Master Tables (Dibuat lebih dulu untuk foreign key)
CREATE TABLE IF NOT EXISTS master_golongan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode VARCHAR(10) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    ruang VARCHAR(5) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS master_jabatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    tipe ENUM('Struktural', 'Fungsional', 'Pelaksana') NOT NULL,
    eselon VARCHAR(10)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS master_unit_kerja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode VARCHAR(20) NOT NULL UNIQUE,
    lokasi VARCHAR(255)
) ENGINE=InnoDB;

-- 2. Tabel Pegawai
CREATE TABLE IF NOT EXISTS pegawai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nip VARCHAR(20) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    jabatan_id INT,
    golongan_id INT,
    unit_kerja_id INT,
    email VARCHAR(100),
    phone VARCHAR(20),
    tmt_pangkat DATE,
    tmt_kgb DATE,
    tanggal_masuk DATE,
    status ENUM('aktif', 'cuti', 'pensiun') DEFAULT 'aktif',
    avatar VARCHAR(255),
    CONSTRAINT fk_pegawai_jabatan FOREIGN KEY (jabatan_id) REFERENCES master_jabatan(id) ON DELETE SET NULL,
    CONSTRAINT fk_pegawai_golongan FOREIGN KEY (golongan_id) REFERENCES master_golongan(id) ON DELETE SET NULL,
    CONSTRAINT fk_pegawai_unit FOREIGN KEY (unit_kerja_id) REFERENCES master_unit_kerja(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nip VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'pegawai', 'pimpinan') NOT NULL,
    jabatan VARCHAR(100),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_pegawai FOREIGN KEY (nip) REFERENCES pegawai(nip) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tabel Riwayat
CREATE TABLE IF NOT EXISTS riwayats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pegawai_id INT,
    tipe VARCHAR(50) NOT NULL,
    keterangan TEXT,
    tanggal DATE,
    dokumen VARCHAR(255),
    CONSTRAINT fk_riwayat_pegawai FOREIGN KEY (pegawai_id) REFERENCES pegawai(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Tabel Dokumen Penting
CREATE TABLE IF NOT EXISTS dokumen_penting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pegawai_id INT,
    nama_dokumen VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    kategori VARCHAR(50),
    tanggal_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dokumen_pegawai FOREIGN KEY (pegawai_id) REFERENCES pegawai(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Tabel Approvals
CREATE TABLE IF NOT EXISTS approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pegawai_id INT,
    type ENUM('Kenaikan Pangkat', 'KGB', 'Cuti', 'Mutasi') NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    dokumen VARCHAR(255),
    catatan TEXT,
    CONSTRAINT fk_approval_pegawai FOREIGN KEY (pegawai_id) REFERENCES pegawai(id) ON DELETE CASCADE
) ENGINE=InnoDB;
