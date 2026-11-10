import { prisma } from "../lib/prisma";

async function main() {
  const akunList = [
    { id_akun: "AKN_RSP001", username: "resepsionis@puskesmas.com", password: "resepsionis123", role: "RESEPSIONIS" },
    { id_akun: "AKN_DOK001", username: "falzan@puskesmas.com", password: "dokter123", role: "DOKTER" },
    { id_akun: "AKN_DOK002", username: "clara@puskesmas.com", password: "dokter123", role: "DOKTER" },
    { id_akun: "AKN_DOK003", username: "ziyn@puskesmas.com", password: "dokter123", role: "DOKTER" },
    { id_akun: "AKN_PRW001", username: "perawat@puskesmas.com", password: "perawat123", role: "PERAWAT" },
    { id_akun: "AKN_APT001", username: "apoteker@puskesmas.com", password: "apoteker123", role: "APOTEKER" },
    { id_akun: "AKN_PSN001", username: "pasien@puskesmas.com", password: "pasien123", role: "PASIEN" },
  ];

  for (const item of akunList) {
    await prisma.akun.upsert({
      where: { id_akun: item.id_akun },
      update: { role: item.role },
      create: item,
    });
  }

  console.log("✓ Akun dengan Role berhasil disinkronkan ke PostgreSQL.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());