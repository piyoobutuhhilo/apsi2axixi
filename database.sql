
DROP TABLE IF EXISTS 
    detail_resep, resep, obat, pemeriksaan, diagnosis, katalog_diagnosis, 
    rujukan, rekam_medis, pembayaran, antrean, kunjungan, jadwal_dokter, 
    poli, resepsionis, pasien, perawat, apoteker, dokter, akun 
CASCADE;


CREATE TABLE akun (
    id_akun VARCHAR(12) PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE dokter (
    id_dokter VARCHAR(12) PRIMARY KEY,
    nama_dokter VARCHAR(150) NOT NULL,
    jenis_kelamin VARCHAR(150) NOT NULL,
    alamat TEXT NOT NULL,
    no_telepon VARCHAR(20) NOT NULL,
    id_akun VARCHAR(12) NOT NULL UNIQUE,
    CONSTRAINT fk_dokter_akun FOREIGN KEY (id_akun) REFERENCES akun(id_akun) ON DELETE RESTRICT
);

CREATE TABLE apoteker (
    id_apoteker VARCHAR(12) PRIMARY KEY,
    nama_apoteker VARCHAR(150) NOT NULL,
    jenis_kelamin VARCHAR(150) NOT NULL,
    alamat TEXT NOT NULL,
    no_telepon VARCHAR(20) NOT NULL,
    id_akun VARCHAR(12) NOT NULL UNIQUE,
    CONSTRAINT fk_apoteker_akun FOREIGN KEY (id_akun) REFERENCES akun(id_akun) ON DELETE RESTRICT
);

CREATE TABLE perawat (
    id_perawat VARCHAR(12) PRIMARY KEY,
    nama_perawat VARCHAR(150) NOT NULL,
    jenis_kelamin VARCHAR(150) NOT NULL,
    alamat TEXT NOT NULL,
    no_telepon VARCHAR(20) NOT NULL,
    id_akun VARCHAR(12) NOT NULL UNIQUE,
    CONSTRAINT fk_perawat_akun FOREIGN KEY (id_akun) REFERENCES akun(id_akun) ON DELETE RESTRICT
);

CREATE TABLE pasien (
    id_pasien VARCHAR(12) PRIMARY KEY,
    nama_pasien VARCHAR(150) NOT NULL,
    nik CHAR(16) NOT NULL UNIQUE,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(150) NOT NULL,
    alamat TEXT NOT NULL,
    no_telepon VARCHAR(20) NOT NULL,
    id_akun VARCHAR(12) NOT NULL UNIQUE,
    CONSTRAINT fk_pasien_akun FOREIGN KEY (id_akun) REFERENCES akun(id_akun) ON DELETE RESTRICT
);

CREATE TABLE resepsionis (
    id_resepsionis VARCHAR(12) PRIMARY KEY,
    nama_resepsionis VARCHAR(150) NOT NULL,
    jenis_kelamin VARCHAR(150) NOT NULL,
    alamat TEXT NOT NULL,
    no_telepon VARCHAR(20) NOT NULL,
    id_akun VARCHAR(12) NOT NULL UNIQUE,
    CONSTRAINT fk_resepsionis_akun FOREIGN KEY (id_akun) REFERENCES akun(id_akun) ON DELETE RESTRICT
);

CREATE TABLE poli (
    id_poli VARCHAR(12) PRIMARY KEY,
    nama_poli VARCHAR(150) NOT NULL,
    lokasi_poli VARCHAR(150) NOT NULL,
    deskripsi_poli VARCHAR(150),
    status_poli VARCHAR(150) NOT NULL
);

CREATE TABLE jadwal_dokter (
    id_jadwal VARCHAR(12) PRIMARY KEY,
    id_dokter VARCHAR(12) NOT NULL,
    id_poli VARCHAR(12) NOT NULL,
    hari VARCHAR(150) NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    status_jadwal VARCHAR(150) NOT NULL,
    CONSTRAINT fk_jadwal_dokter FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter) ON DELETE RESTRICT,
    CONSTRAINT fk_jadwal_poli FOREIGN KEY (id_poli) REFERENCES poli(id_poli) ON DELETE RESTRICT
);

CREATE TABLE kunjungan (
    id_kunjungan VARCHAR(12) PRIMARY KEY,
    id_pasien VARCHAR(12) NOT NULL,
    id_jadwal VARCHAR(12) NOT NULL,
    tanggal_kunjungan DATE NOT NULL,
    jenis_kunjungan VARCHAR(150) NOT NULL,
    keluhan_awal VARCHAR(150) NOT NULL,
    status_kunjungan VARCHAR(150) NOT NULL,
    CONSTRAINT fk_kunjungan_pasien FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien) ON DELETE RESTRICT,
    CONSTRAINT fk_kunjungan_jadwal FOREIGN KEY (id_jadwal) REFERENCES jadwal_dokter(id_jadwal) ON DELETE RESTRICT
);

CREATE TABLE antrean (
    id_antrean VARCHAR(12) PRIMARY KEY,
    id_kunjungan VARCHAR(12) NOT NULL,
    tanggal_antrean DATE NOT NULL,
    nomor_antrean VARCHAR(20) NOT NULL,
    waktu_ambil TIMESTAMP NOT NULL,
    id_resepsionis VARCHAR(12) NOT NULL,
    CONSTRAINT fk_antrean_kunjungan FOREIGN KEY (id_kunjungan) REFERENCES kunjungan(id_kunjungan) ON DELETE RESTRICT,
    CONSTRAINT fk_antrean_resepsionis FOREIGN KEY (id_resepsionis) REFERENCES resepsionis(id_resepsionis) ON DELETE RESTRICT
);

CREATE TABLE pembayaran (
    id_pembayaran VARCHAR(12) PRIMARY KEY,
    tanggal_pembayaran DATE NOT NULL,
    total_biaya DECIMAL(12, 2) NOT NULL,
    metode_pembayaran VARCHAR(150) NOT NULL,
    status_pembayaran VARCHAR(150) NOT NULL,
    catatan_pembayaran VARCHAR(150),
    id_resepsionis VARCHAR(12) NOT NULL,
    id_kunjungan VARCHAR(12) NOT NULL,
    CONSTRAINT fk_pembayaran_resepsionis FOREIGN KEY (id_resepsionis) REFERENCES resepsionis(id_resepsionis) ON DELETE RESTRICT,
    CONSTRAINT fk_pembayaran_kunjungan FOREIGN KEY (id_kunjungan) REFERENCES kunjungan(id_kunjungan) ON DELETE RESTRICT
);

CREATE TABLE rekam_medis (
    id_rekam_medis VARCHAR(12) PRIMARY KEY,
    id_kunjungan VARCHAR(12) NOT NULL,
    id_dokter VARCHAR(12) NOT NULL,
    tanggal_pencatatan DATE NOT NULL,
    riwayat_keluhan TEXT,
    hasil_pemeriksaan_fisik VARCHAR(150),
    catatan_medis TEXT,
    id_pasien VARCHAR(12) NOT NULL,
    CONSTRAINT fk_rm_kunjungan FOREIGN KEY (id_kunjungan) REFERENCES kunjungan(id_kunjungan) ON DELETE RESTRICT,
    CONSTRAINT fk_rm_dokter FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter) ON DELETE RESTRICT,
    CONSTRAINT fk_rm_pasien FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien) ON DELETE RESTRICT
);

CREATE TABLE rujukan (
    id_rujukan VARCHAR(12) PRIMARY KEY,
    id_rekam_medis VARCHAR(12) NOT NULL,
    tanggal_rujukan DATE NOT NULL,
    tujuan_rujukan VARCHAR(150) NOT NULL,
    alasan_rujukan TEXT NOT NULL,
    diagnosis_rujukan VARCHAR(150) NOT NULL,
    status_rujukan VARCHAR(150) NOT NULL,
    CONSTRAINT fk_rujukan_rm FOREIGN KEY (id_rekam_medis) REFERENCES rekam_medis(id_rekam_medis) ON DELETE RESTRICT
);

CREATE TABLE katalog_diagnosis (
    kode_diagnosis VARCHAR(12) PRIMARY KEY,
    nama_diagnosis VARCHAR(150) NOT NULL
);

CREATE TABLE diagnosis (
    id_diagnosis VARCHAR(12) PRIMARY KEY,
    id_rekam_medis VARCHAR(12) NOT NULL,
    kode_diagnosis VARCHAR(12) NOT NULL,
    nama_diagnosis VARCHAR(150) NOT NULL,
    jenis_diagnosis VARCHAR(150) NOT NULL,
    catatan_diagnosis TEXT,
    CONSTRAINT fk_diagnosis_rm FOREIGN KEY (id_rekam_medis) REFERENCES rekam_medis(id_rekam_medis) ON DELETE RESTRICT,
    CONSTRAINT fk_diagnosis_katalog FOREIGN KEY (kode_diagnosis) REFERENCES katalog_diagnosis(kode_diagnosis) ON DELETE RESTRICT
);

CREATE TABLE pemeriksaan (
    id_pemeriksaan VARCHAR(12) PRIMARY KEY,
    id_kunjungan VARCHAR(12) NOT NULL,
    id_perawat VARCHAR(12) NOT NULL,
    id_rekam_medis VARCHAR(12) NOT NULL,
    tekanan_darah VARCHAR(150) NOT NULL,
    suhu_tubuh DECIMAL(4, 1) NOT NULL,
    laju_pernapasan INT NOT NULL,
    riwayat_penyakit TEXT,
    waktu_pemeriksaan TIME NOT NULL,
    nama_pemeriksaan VARCHAR(150) NOT NULL,
    deskripsi_pemeriksaan TEXT,
    tanggal_pemeriksaan DATE NOT NULL,
    catatan_pemeriksaan TEXT,
    CONSTRAINT fk_pemeriksaan_kunjungan FOREIGN KEY (id_kunjungan) REFERENCES kunjungan(id_kunjungan) ON DELETE RESTRICT,
    CONSTRAINT fk_pemeriksaan_perawat FOREIGN KEY (id_perawat) REFERENCES perawat(id_perawat) ON DELETE RESTRICT,
    CONSTRAINT fk_pemeriksaan_rm FOREIGN KEY (id_rekam_medis) REFERENCES rekam_medis(id_rekam_medis) ON DELETE RESTRICT
);

CREATE TABLE obat (
    id_obat VARCHAR(12) PRIMARY KEY,
    nama_obat VARCHAR(150) NOT NULL,
    bentuk_obat VARCHAR(150) NOT NULL,
    satuan VARCHAR(150) NOT NULL,
    stok_obat INT NOT NULL DEFAULT 0,
    batas_minimum_stok INT NOT NULL DEFAULT 0,
    status_obat VARCHAR(150) NOT NULL,
    id_apoteker VARCHAR(12) NOT NULL,
    CONSTRAINT fk_obat_apoteker FOREIGN KEY (id_apoteker) REFERENCES apoteker(id_apoteker) ON DELETE RESTRICT
);

CREATE TABLE resep (
    id_resep VARCHAR(12) PRIMARY KEY,
    id_rekam_medis VARCHAR(12) NOT NULL,
    tanggal_resep DATE NOT NULL,
    catatan_resep VARCHAR(150),
    status_resep VARCHAR(150) NOT NULL,
    CONSTRAINT fk_resep_rm FOREIGN KEY (id_rekam_medis) REFERENCES rekam_medis(id_rekam_medis) ON DELETE RESTRICT
);

CREATE TABLE detail_resep (
    id_detail_resep VARCHAR(12) PRIMARY KEY,
    id_resep VARCHAR(12) NOT NULL,
    id_obat VARCHAR(12) NOT NULL,
    jumlah_obat INT NOT NULL,
    dosis VARCHAR(150) NOT NULL,
    aturan_pakai VARCHAR(150) NOT NULL,
    CONSTRAINT fk_detail_resep FOREIGN KEY (id_resep) REFERENCES resep(id_resep) ON DELETE RESTRICT,
    CONSTRAINT fk_detail_obat FOREIGN KEY (id_obat) REFERENCES obat(id_obat) ON DELETE RESTRICT
);


INSERT INTO akun (id_akun, username, password) VALUES
('AKN001', 'sari.putri', 'sari1026'),
('AKN002', 'budi.santoso', 'budi1027'),
('AKN003', 'rani.putri', 'rani1028'),
('AKN004', 'fikri.pratama', 'fikri1029'),
('AKN005', 'nur.aisyah', 'aisyah1030'),
('AKN006', 'dimas.saputra', 'dimas1031'),
('AKN007', 'nabila.zahra', 'nabila1032'),
('AKN008', 'rizki.maulana', 'rizki1033'),
('AKN009', 'dewi.anggraini', 'dewi1034'),
('AKN010', 'farhan.aditya', 'farhan1035'),
('AKN011', 'citra.lestari', 'citra1036'),
('AKN012', 'arif.mahendra', 'arif1042'),
('AKN013', 'maya.ramadhani', 'maya1043'),
('AKN014', 'taufik.hidayat', 'taufik1044'),
('AKN015', 'intan.permata', 'intan1045'),
('AKN_DOK001', 'falzan@puskesmas.com', 'dokter123'),
('AKN_DOK002', 'clara@puskesmas.com', 'dokter123'),
('AKN_DOK003', 'ziyn@puskesmas.com', 'dokter123'),
('AKN_DOK004', 'rian@puskesmas.com', 'dokter123'),
('AKN_DOK005', 'rahma@puskesmas.com', 'dokter123'),
('AKN_DOK006', 'budi@puskesmas.com', 'dokter123');

INSERT INTO dokter (id_dokter, nama_dokter, jenis_kelamin, alamat, no_telepon, id_akun) VALUES
('DKT001', 'dr. Falzan', 'Laki-Laki', 'Jl. Pauh Sehat No. 12, Padang', '081234567801', 'AKN_DOK001'),
('DKT002', 'dr. Clara', 'Perempuan', 'Jl. Limau Manis No. 45, Padang', '081234567802', 'AKN_DOK002'),
('DKT003', 'drg. Ziyn', 'Perempuan', 'Jl. Kuranji No. 88, Padang', '081234567803', 'AKN_DOK003'),
('DKT004', 'dr. Rian Pratama', 'Laki-Laki', 'Jl. Andalas Baru No. 05, Padang', '081234567804', 'AKN_DOK004'),
('DKT005', 'dr. Siti Rahma, Sp.OG', 'Perempuan', 'Jl. Dr. M. Hatta No. 20, Padang', '081234567805', 'AKN_DOK005'),
('DKT006', 'dr. Budi Santoso, Sp.PD', 'Laki-Laki', 'Jl. Perintis Kemerdekaan No. 14, Padang', '081234567806', 'AKN_DOK006')
ON CONFLICT (id_dokter) DO UPDATE 
SET nama_dokter = EXCLUDED.nama_dokter,
    jenis_kelamin = EXCLUDED.jenis_kelamin,
    alamat = EXCLUDED.alamat,
    no_telepon = EXCLUDED.no_telepon;



INSERT INTO apoteker (id_apoteker, nama_apoteker, jenis_kelamin, alamat, no_telepon, id_akun) VALUES
('APT001', 'Nabila Zahra', 'Perempuan', 'Bandar Buat, Kecamatan Lubuk Kilangan, Kota Padang', '081271530101', 'AKN007'),
('APT002', 'Rizki Maulana', 'Laki-laki', 'Lubuk Begalung, Kota Padang', '081271530102', 'AKN008'),
('APT003', 'Taufik Hidayat', 'Laki-laki', 'Air Pacah, Kecamatan Koto Tangah, Kota Padang', '081271530103', 'AKN014');

INSERT INTO perawat (id_perawat, nama_perawat, jenis_kelamin, alamat, no_telepon, id_akun) VALUES
('PRW001', 'Nur Aisyah', 'Perempuan', 'Koto Luar, Kecamatan Pauh, Kota Padang', '081271520101', 'AKN005'),
('PRW002', 'Dimas Saputra', 'Laki-laki', 'Anduring, Kecamatan Kuranji, Kota Padang', '081271520102', 'AKN006'),
('PRW003', 'Maya Ramadhani', 'Perempuan', 'Pisang, Kecamatan Pauh, Kota Padang', '081271520103', 'AKN013');

INSERT INTO pasien (id_pasien, nama_pasien, nik, tanggal_lahir, jenis_kelamin, alamat, no_telepon, id_akun) VALUES
('PSN001', 'Sari Putri', '0000000000000001', '1998-09-21', 'Perempuan', 'Koto Luar, Kecamatan Pauh, Kota Padang', '081234567801', 'AKN001'),
('PSN002', 'Budi Santoso', '0000000000000002', '2000-01-08', 'Laki-laki', 'Limau Manis, Kecamatan Pauh, Kota Padang', '081234567802', 'AKN002'),
('PSN003', 'Citra Lestari', '0000000000000003', '2001-04-15', 'Perempuan', 'Kapalo Koto, Kecamatan Pauh, Kota Padang', '081234567803', 'AKN011');

INSERT INTO resepsionis (id_resepsionis, nama_resepsionis, jenis_kelamin, alamat, no_telepon, id_akun) VALUES
('RSPN001', 'Dewi Anggraini', 'Perempuan', 'Kampung Kalawi, Kecamatan Kuranji, Kota Padang', '081271540101', 'AKN009'),
('RSPN002', 'Farhan Aditya', 'Laki-laki', 'Lubuk Minturun, Kecamatan Koto Tangah, Kota Padang', '081271540102', 'AKN010'),
('RSPN003', 'Intan Permata', 'Perempuan', 'Gunung Sarik, Kecamatan Kuranji, Kota Padang', '081271540103', 'AKN015');

INSERT INTO poli (id_poli, nama_poli, lokasi_poli, deskripsi_poli, status_poli) VALUES
('POL001', 'Poli Anak', 'Lantai 1 Gedung A', 'Pelayanan kesehatan anak, balita, dan imunisasi', 'Aktif'),
('POL002', 'Poli Gigi', 'Lantai 2 Gedung A', 'Pemeriksaan dan penanganan masalah gigi mulut', 'Aktif'),
('POL003', 'Poli Umum', 'Lantai 1 Gedung Utama', 'Pelayanan pemeriksaan kesehatan dasar dan umum', 'Aktif'),
('POL004', 'Poli Kandungan', 'Lantai 2 Gedung B', 'Pemeriksaan ibu hamil dan kesehatan reproduksi', 'Aktif'),
('POL005', 'Poli Penyakit Dalam', 'Lantai 2 Gedung Utama', 'Konsultasi diagnosa dan terapi penyakit organ dalam', 'Aktif')
ON CONFLICT (id_poli) DO UPDATE 
SET nama_poli = EXCLUDED.nama_poli,
    lokasi_poli = EXCLUDED.lokasi_poli,
    deskripsi_poli = EXCLUDED.deskripsi_poli,
    status_poli = EXCLUDED.status_poli;

INSERT INTO jadwal_dokter (id_jadwal, id_dokter, id_poli, hari, jam_mulai, jam_selesai, status_jadwal) VALUES
-- Poli Umum (POL001)
('JDW001', 'DKT004', 'POL001', 'Senin', '08:00:00', '12:00:00', 'Aktif'),
('JDW002', 'DKT004', 'POL001', 'Selasa', '08:00:00', '12:00:00', 'Aktif'),
('JDW003', 'DKT004', 'POL001', 'Rabu', '08:00:00', '12:00:00', 'Aktif'),

-- Poli Anak (POL002)
('JDW004', 'DKT001', 'POL002', 'Senin', '08:00:00', '17:30:00', 'Aktif'),
('JDW005', 'DKT001', 'POL002', 'Rabu', '08:00:00', '17:30:00', 'Aktif'),
('JDW006', 'DKT002', 'POL002', 'Selasa', '08:00:00', '17:30:00', 'Aktif'),
('JDW007', 'DKT002', 'POL002', 'Kamis', '08:00:00', '17:30:00', 'Aktif'),

-- Poli Gigi (POL003)
('JDW008', 'DKT003', 'POL003', 'Rabu', '08:00:00', '17:30:00', 'Aktif'),
('JDW009', 'DKT003', 'POL003', 'Jum''at', '08:00:00', '17:30:00', 'Aktif'),

-- Poli Kandungan (POL004)
('JDW010', 'DKT005', 'POL004', 'Senin', '09:00:00', '14:00:00', 'Aktif'),
('JDW011', 'DKT005', 'POL004', 'Kamis', '09:00:00', '14:00:00', 'Aktif'),

-- Poli Penyakit Dalam (POL005)
('JDW012', 'DKT006', 'POL005', 'Selasa', '08:30:00', '13:30:00', 'Aktif'),
('JDW013', 'DKT006', 'POL005', 'Jum''at', '08:30:00', '13:30:00', 'Aktif')
ON CONFLICT (id_jadwal) DO NOTHING;

INSERT INTO kunjungan (id_kunjungan, id_pasien, id_jadwal, tanggal_kunjungan, jenis_kunjungan, keluhan_awal, status_kunjungan) VALUES
('KNJ001', 'PSN001', 'JDW001', '2026-10-20', 'Rawat jalan', 'Demam', 'Selesai'),
('KNJ002', 'PSN002', 'JDW002', '2026-10-20', 'Rawat jalan', 'Batuk', 'Selesai'),
('KNJ003', 'PSN003', 'JDW003', '2026-10-21', 'Rawat jalan', 'Nyeri tenggorokan disertai demam', 'Selesai');

INSERT INTO antrean (id_antrean, id_kunjungan, tanggal_antrean, nomor_antrean, waktu_ambil, id_resepsionis) VALUES
('ANT001', 'KNJ001', '2026-10-20', '001', '2026-10-20 08:00:00', 'RSPN001'),
('ANT002', 'KNJ002', '2026-10-20', '002', '2026-10-20 08:20:00', 'RSPN002'),
('ANT003', 'KNJ003', '2026-10-21', '001', '2026-10-21 09:05:00', 'RSPN003');

INSERT INTO pembayaran (id_pembayaran, tanggal_pembayaran, total_biaya, metode_pembayaran, status_pembayaran, catatan_pembayaran, id_resepsionis, id_kunjungan) VALUES
('BYR001', '2026-10-20', 25000.00, 'Tunai', 'Lunas', 'Pemantauan lanjutan sesuai kebutuhan', 'RSPN001', 'KNJ001'),
('BYR002', '2026-10-20', 15000.00, 'QRIS', 'Lunas', 'Pemantauan lanjutan sesuai kebutuhan', 'RSPN002', 'KNJ002'),
('BYR003', '2026-10-21', 20000.00, 'QRIS', 'Lunas', 'Pembayaran pemeriksaan rawat jalan lunas', 'RSPN003', 'KNJ003');

INSERT INTO rekam_medis (id_rekam_medis, id_kunjungan, id_dokter, tanggal_pencatatan, riwayat_keluhan, hasil_pemeriksaan_fisik, catatan_medis, id_pasien) VALUES
('RM001', 'KNJ001', 'DKT001', '2026-10-20', 'Demam dan lemas', 'Faring kemerahan, suhu meningkat', 'Disarankan kontrol bila keluhan berlanjut', 'PSN001'),
('RM002', 'KNJ002', 'DKT002', '2026-10-20', 'Batuk', 'Tekanan darah meningkat pada pemeriksaan', 'Disarankan kontrol bila keluhan berlanjut', 'PSN002'),
('RM003', 'KNJ003', 'DKT003', '2026-10-21', 'Demam dan batuk sejak dua hari', 'Faring kemerahan, suhu 37,8 derajat', 'Istirahat dan kontrol bila keluhan menetap', 'PSN003');

INSERT INTO rujukan (id_rujukan, id_rekam_medis, tanggal_rujukan, tujuan_rujukan, alasan_rujukan, diagnosis_rujukan, status_rujukan) VALUES
('RJK001', 'RM001', '2026-10-20', 'RSUP Dr. M. Djamil Padang', 'Evaluasi lanjutan', 'Infeksi saluran napas atas akut', 'Dibuat');

INSERT INTO katalog_diagnosis (kode_diagnosis, nama_diagnosis) VALUES
('KD-A', 'Infeksi saluran napas atas akut'),
('KD-B', 'Hipertensi esensial'),
('KD-C', 'Faringitis akut');

INSERT INTO diagnosis (id_diagnosis, id_rekam_medis, kode_diagnosis, nama_diagnosis, jenis_diagnosis, catatan_diagnosis) VALUES
('DGS001', 'RM001', 'KD-A', 'Infeksi saluran napas atas akut', 'Utama', 'Keluhan saluran pernapasan atas'),
('DGS002', 'RM001', 'KD-B', 'Hipertensi esensial', 'Sekunder', 'Pemantauan tekanan darah'),
('DGS003', 'RM002', 'KD-A', 'Infeksi saluran napas atas akut', 'Utama', 'Keluhan saluran pernapasan atas'),
('DGS004', 'RM003', 'KD-C', 'Faringitis akut', 'Utama', 'Nyeri menelan dengan faring kemerahan');

INSERT INTO pemeriksaan (id_pemeriksaan, id_kunjungan, id_perawat, id_rekam_medis, tekanan_darah, suhu_tubuh, laju_pernapasan, riwayat_penyakit, waktu_pemeriksaan, nama_pemeriksaan, deskripsi_pemeriksaan, tanggal_pemeriksaan, catatan_pemeriksaan) VALUES
('PMR001', 'KNJ001', 'PRW001', 'RM001', '120/80', 37.5, 20, 'Tidak ada riwayat penyakit kronis', '08:30:00', 'Pemeriksaan awal', 'Pemeriksaan umum', '2026-10-20', 'Pemantauan lanjutan sesuai kebutuhan'),
('PMR002', 'KNJ002', 'PRW002', 'RM002', '118/78', 36.8, 18, 'Tidak ada riwayat penyakit kronis', '09:00:00', 'Pemeriksaan awal', 'Pemeriksaan umum', '2026-10-20', 'Pemantauan lanjutan sesuai kebutuhan'),
('PMR003', 'KNJ003', 'PRW003', 'RM003', '116/78', 37.8, 19, 'Tidak memiliki riwayat penyakit kronis', '09:20:00', 'Pemeriksaan awal', 'Pemeriksaan umum', '2026-10-21', 'Pasien sadar dan kooperatif');

INSERT INTO obat (id_obat, nama_obat, bentuk_obat, satuan, stok_obat, batas_minimum_stok, status_obat, id_apoteker) VALUES
('OBT001', 'Parasetamol 500 mg', 'Tablet', 'Tablet', 100, 20, 'Aktif', 'APT001'),
('OBT002', 'Amlodipin 5 mg', 'Tablet', 'Tablet', 40, 10, 'Aktif', 'APT002'),
('OBT003', 'Vitamin C 500 mg', 'Tablet', 'Tablet', 75, 15, 'Aktif', 'APT003');

INSERT INTO resep (id_resep, id_rekam_medis, tanggal_resep, catatan_resep, status_resep) VALUES
('RSP001', 'RM001', '2026-10-20', 'Pemantauan lanjutan sesuai kebutuhan', 'Dibuat'),
('RSP002', 'RM002', '2026-10-20', 'Pemantauan lanjutan sesuai kebutuhan', 'Dibuat'),
('RSP003', 'RM003', '2026-10-21', 'Konsumsi obat sesuai anjuran tenaga kesehatan', 'Dibuat');

INSERT INTO detail_resep (id_detail_resep, id_resep, id_obat, jumlah_obat, dosis, aturan_pakai) VALUES
('DTR001', 'RSP001', 'OBT001', 10, '1 tablet', '3x sehari'),
('DTR002', 'RSP001', 'OBT002', 10, '1 tablet', '1x sehari'),
('DTR003', 'RSP002', 'OBT001', 6, '1 tablet', '2x sehari'),
('DTR004', 'RSP003', 'OBT003', 5, '1 tablet', '1x sehari');

