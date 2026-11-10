import "dotenv/config";
import { prisma } from "../lib/prisma";


async function main() {
  console.log("🌱 Memulai seeding data dari database.sql ke Neon...");

  // 1. DATA AKUN
  const akunData = [
    { id_akun: "AKN001", username: "sari.putri", password: "sari1026" },
    { id_akun: "AKN002", username: "budi.santoso", password: "budi1027" },
    { id_akun: "AKN003", username: "rani.putri", password: "rani1028" },
    { id_akun: "AKN004", username: "fikri.pratama", password: "fikri1029" },
    { id_akun: "AKN005", username: "nur.aisyah", password: "aisyah1030" },
    { id_akun: "AKN006", username: "dimas.saputra", password: "dimas1031" },
    { id_akun: "AKN007", username: "nabila.zahra", password: "nabila1032" },
    { id_akun: "AKN008", username: "rizki.maulana", password: "rizki1033" },
    { id_akun: "AKN009", username: "dewi.anggraini", password: "dewi1034" },
    { id_akun: "AKN010", username: "farhan.aditya", password: "farhan1035" },
    { id_akun: "AKN011", username: "citra.lestari", password: "citra1036" },
    { id_akun: "AKN012", username: "arif.mahendra", password: "arif1042" },
    { id_akun: "AKN013", username: "maya.ramadhani", password: "maya1043" },
    { id_akun: "AKN014", username: "taufik.hidayat", password: "taufik1044" },
    { id_akun: "AKN015", username: "intan.permata", password: "intan1045" },
    { id_akun: "AKN_DOK001", username: "falzan@puskesmas.com", password: "dokter123" },
    { id_akun: "AKN_DOK002", username: "clara@puskesmas.com", password: "dokter123" },
    { id_akun: "AKN_DOK003", username: "ziyn@puskesmas.com", password: "dokter123" },
    { id_akun: "AKN_DOK004", username: "rian@puskesmas.com", password: "dokter123" },
    { id_akun: "AKN_DOK005", username: "rahma@puskesmas.com", password: "dokter123" },
    { id_akun: "AKN_DOK006", username: "budi@puskesmas.com", password: "dokter123" },
  ];

  for (const item of akunData) {
    await prisma.akun.upsert({
      where: { id_akun: item.id_akun },
      update: {},
      create: item,
    });
  }

  // 2. DATA POLI
  const poliData = [
    {
      id_poli: "POL001",
      nama_poli: "Poli Anak",
      lokasi_poli: "Lantai 1 Gedung A",
      deskripsi_poli: "Pelayanan kesehatan anak, balita, dan imunisasi",
      status_poli: "Aktif",
    },
    {
      id_poli: "POL002",
      nama_poli: "Poli Gigi",
      lokasi_poli: "Lantai 2 Gedung A",
      deskripsi_poli: "Pemeriksaan dan penanganan masalah gigi mulut",
      status_poli: "Aktif",
    },
    {
      id_poli: "POL003",
      nama_poli: "Poli Umum",
      lokasi_poli: "Lantai 1 Gedung Utama",
      deskripsi_poli: "Pelayanan pemeriksaan kesehatan dasar dan umum",
      status_poli: "Aktif",
    },
    {
      id_poli: "POL004",
      nama_poli: "Poli Kandungan",
      lokasi_poli: "Lantai 2 Gedung B",
      deskripsi_poli: "Pemeriksaan ibu hamil dan kesehatan reproduksi",
      status_poli: "Aktif",
    },
    {
      id_poli: "POL005",
      nama_poli: "Poli Penyakit Dalam",
      lokasi_poli: "Lantai 2 Gedung Utama",
      deskripsi_poli: "Konsultasi diagnosa dan terapi penyakit organ dalam",
      status_poli: "Aktif",
    },
  ];

  for (const item of poliData) {
    await prisma.poli.upsert({
      where: { id_poli: item.id_poli },
      update: item,
      create: item,
    });
  }

  // 3. DATA DOKTER
  const dokterData = [
    {
      id_dokter: "DKT001",
      nama_dokter: "dr. Falzan",
      jenis_kelamin: "Laki-Laki",
      alamat: "Jl. Pauh Sehat No. 12, Padang",
      no_telepon: "081234567801",
      id_akun: "AKN_DOK001",
    },
    {
      id_dokter: "DKT002",
      nama_dokter: "dr. Clara",
      jenis_kelamin: "Perempuan",
      alamat: "Jl. Limau Manis No. 45, Padang",
      no_telepon: "081234567802",
      id_akun: "AKN_DOK002",
    },
    {
      id_dokter: "DKT003",
      nama_dokter: "drg. Ziyn",
      jenis_kelamin: "Perempuan",
      alamat: "Jl. Kuranji No. 88, Padang",
      no_telepon: "081234567803",
      id_akun: "AKN_DOK003",
    },
    {
      id_dokter: "DKT004",
      nama_dokter: "dr. Rian Pratama",
      jenis_kelamin: "Laki-Laki",
      alamat: "Jl. Andalas Baru No. 05, Padang",
      no_telepon: "081234567804",
      id_akun: "AKN_DOK004",
    },
    {
      id_dokter: "DKT005",
      nama_dokter: "dr. Siti Rahma, Sp.OG",
      jenis_kelamin: "Perempuan",
      alamat: "Jl. Dr. M. Hatta No. 20, Padang",
      no_telepon: "081234567805",
      id_akun: "AKN_DOK005",
    },
    {
      id_dokter: "DKT006",
      nama_dokter: "dr. Budi Santoso, Sp.PD",
      jenis_kelamin: "Laki-Laki",
      alamat: "Jl. Perintis Kemerdekaan No. 14, Padang",
      no_telepon: "081234567806",
      id_akun: "AKN_DOK006",
    },
  ];

  for (const item of dokterData) {
    await prisma.dokter.upsert({
      where: { id_dokter: item.id_dokter },
      update: item,
      create: item,
    });
  }

  // 4. DATA APOTEKER, PERAWAT, RESEPSIONIS
  const apotekerData = [
    { id_apoteker: "APT001", nama_apoteker: "Nabila Zahra", jenis_kelamin: "Perempuan", alamat: "Bandar Buat, Kecamatan Lubuk Kilangan, Kota Padang", no_telepon: "081271530101", id_akun: "AKN007" },
    { id_apoteker: "APT002", nama_apoteker: "Rizki Maulana", jenis_kelamin: "Laki-laki", alamat: "Lubuk Begalung, Kota Padang", no_telepon: "081271530102", id_akun: "AKN008" },
    { id_apoteker: "APT003", nama_apoteker: "Taufik Hidayat", jenis_kelamin: "Laki-laki", alamat: "Air Pacah, Kecamatan Koto Tangah, Kota Padang", no_telepon: "081271530103", id_akun: "AKN014" },
  ];
  for (const item of apotekerData) {
    await prisma.apoteker.upsert({ where: { id_apoteker: item.id_apoteker }, update: {}, create: item });
  }

  const perawatData = [
    { id_perawat: "PRW001", nama_perawat: "Nur Aisyah", jenis_kelamin: "Perempuan", alamat: "Koto Luar, Kecamatan Pauh, Kota Padang", no_telepon: "081271520101", id_akun: "AKN005" },
    { id_perawat: "PRW002", nama_perawat: "Dimas Saputra", jenis_kelamin: "Laki-laki", alamat: "Anduring, Kecamatan Kuranji, Kota Padang", no_telepon: "081271520102", id_akun: "AKN006" },
    { id_perawat: "PRW003", nama_perawat: "Maya Ramadhani", jenis_kelamin: "Perempuan", alamat: "Pisang, Kecamatan Pauh, Kota Padang", no_telepon: "081271520103", id_akun: "AKN013" },
  ];
  for (const item of perawatData) {
    await prisma.perawat.upsert({ where: { id_perawat: item.id_perawat }, update: {}, create: item });
  }

  const resepsionisData = [
    { id_resepsionis: "RSPN001", nama_resepsionis: "Dewi Anggraini", jenis_kelamin: "Perempuan", alamat: "Kampung Kalawi, Kecamatan Kuranji, Kota Padang", no_telepon: "081271540101", id_akun: "AKN009" },
    { id_resepsionis: "RSPN002", nama_resepsionis: "Farhan Aditya", jenis_kelamin: "Laki-laki", alamat: "Lubuk Minturun, Kecamatan Koto Tangah, Kota Padang", no_telepon: "081271540102", id_akun: "AKN010" },
    { id_resepsionis: "RSPN003", nama_resepsionis: "Intan Permata", jenis_kelamin: "Perempuan", alamat: "Gunung Sarik, Kecamatan Kuranji, Kota Padang", no_telepon: "081271540103", id_akun: "AKN015" },
  ];
  for (const item of resepsionisData) {
    await prisma.resepsionis.upsert({ where: { id_resepsionis: item.id_resepsionis }, update: {}, create: item });
  }

  // 5. DATA PASIEN
  const pasienData = [
    { id_pasien: "PSN001", nama_pasien: "Sari Putri", nik: "0000000000000001", tanggal_lahir: new Date("1998-09-21"), jenis_kelamin: "Perempuan", alamat: "Koto Luar, Kecamatan Pauh, Kota Padang", no_telepon: "081234567801", id_akun: "AKN001" },
    { id_pasien: "PSN002", nama_pasien: "Budi Santoso", nik: "0000000000000002", tanggal_lahir: new Date("2000-01-08"), jenis_kelamin: "Laki-laki", alamat: "Limau Manis, Kecamatan Pauh, Kota Padang", no_telepon: "081234567802", id_akun: "AKN002" },
    { id_pasien: "PSN003", nama_pasien: "Citra Lestari", nik: "0000000000000003", tanggal_lahir: new Date("2001-04-15"), jenis_kelamin: "Perempuan", alamat: "Kapalo Koto, Kecamatan Pauh, Kota Padang", no_telepon: "081234567803", id_akun: "AKN011" },
  ];
  for (const item of pasienData) {
    await prisma.pasien.upsert({ where: { id_pasien: item.id_pasien }, update: {}, create: item });
  }

  // 6. DATA JADWAL DOKTER
  const parseTime = (t: string) => new Date(`1970-01-01T${t}Z`);

  const jadwalData = [
    { id_jadwal: "JDW001", id_dokter: "DKT004", id_poli: "POL001", hari: "Senin", jam_mulai: parseTime("08:00:00"), jam_selesai: parseTime("12:00:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW002", id_dokter: "DKT004", id_poli: "POL001", hari: "Selasa", jam_mulai: parseTime("08:00:00"), jam_selesai: parseTime("12:00:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW003", id_dokter: "DKT004", id_poli: "POL001", hari: "Rabu", jam_mulai: parseTime("08:00:00"), jam_selesai: parseTime("12:00:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW004", id_dokter: "DKT001", id_poli: "POL002", hari: "Senin", jam_mulai: parseTime("08:00:00"), jam_selesai: parseTime("17:30:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW005", id_dokter: "DKT001", id_poli: "POL002", hari: "Rabu", jam_mulai: parseTime("08:00:00"), jam_selesai: parseTime("17:30:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW006", id_dokter: "DKT002", id_poli: "POL002", hari: "Selasa", jam_mulai: parseTime("08:00:00"), jam_selesai: parseTime("17:30:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW007", id_dokter: "DKT002", id_poli: "POL002", hari: "Kamis", jam_mulai: parseTime("08:00:00"), jam_selesai: parseTime("17:30:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW008", id_dokter: "DKT003", id_poli: "POL003", hari: "Rabu", jam_mulai: parseTime("08:00:00"), jam_selesai: parseTime("17:30:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW009", id_dokter: "DKT003", id_poli: "POL003", hari: "Jum'at", jam_mulai: parseTime("08:00:00"), jam_selesai: parseTime("17:30:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW010", id_dokter: "DKT005", id_poli: "POL004", hari: "Senin", jam_mulai: parseTime("09:00:00"), jam_selesai: parseTime("14:00:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW011", id_dokter: "DKT005", id_poli: "POL004", hari: "Kamis", jam_mulai: parseTime("09:00:00"), jam_selesai: parseTime("14:00:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW012", id_dokter: "DKT006", id_poli: "POL005", hari: "Selasa", jam_mulai: parseTime("08:30:00"), jam_selesai: parseTime("13:30:00"), status_jadwal: "Aktif" },
    { id_jadwal: "JDW013", id_dokter: "DKT006", id_poli: "POL005", hari: "Jum'at", jam_mulai: parseTime("08:30:00"), jam_selesai: parseTime("13:30:00"), status_jadwal: "Aktif" },
  ];

  for (const item of jadwalData) {
    await prisma.jadwal_dokter.upsert({
      where: { id_jadwal: item.id_jadwal },
      update: {},
      create: item,
    });
  }

  // 7. DATA KATALOG DIAGNOSIS & OBAT
  const obatData = [
    { id_obat: "OBT001", nama_obat: "Parasetamol 500 mg", bentuk_obat: "Tablet", satuan: "Tablet", stok_obat: 100, batas_minimum_stok: 20, status_obat: "Aktif", id_apoteker: "APT001" },
    { id_obat: "OBT002", nama_obat: "Amlodipin 5 mg", bentuk_obat: "Tablet", satuan: "Tablet", stok_obat: 40, batas_minimum_stok: 10, status_obat: "Aktif", id_apoteker: "APT002" },
    { id_obat: "OBT003", nama_obat: "Vitamin C 500 mg", bentuk_obat: "Tablet", satuan: "Tablet", stok_obat: 75, batas_minimum_stok: 15, status_obat: "Aktif", id_apoteker: "APT003" },
  ];
  for (const item of obatData) {
    await prisma.obat.upsert({ where: { id_obat: item.id_obat }, update: {}, create: item });
  }

  console.log("✅ Seeding selesai! Seluruh Poli, Dokter, dan Jadwal berhasil masuk.");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });