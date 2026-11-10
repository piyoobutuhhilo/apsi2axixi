import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: { not: "Dibatalkan" },
      },
      include: {
        pasien: {
          include: {
            akun: true,
          },
        },
        poli: true,
        dokter: true,
      },
      orderBy: {
        tanggal_pemeriksaan: "asc",
      },
    });

    const formatted = bookings.map((b, idx) => {
      // Ambil nama pasien sebenarnya dari relasi booking -> pasien
      const namaPasien =
        b.pasien?.nama_pasien || b.pasien?.akun?.username || "Pasien";

      // Format inisial poli agar rapi (A-001, U-001, dll)
      let hurufPoli = "A";
      const namaPoli = (b.poli?.nama_poli || "").toLowerCase();
      if (namaPoli.includes("umum")) hurufPoli = "U";
      else if (namaPoli.includes("gigi")) hurufPoli = "G";
      else if (namaPoli.includes("anak")) hurufPoli = "A";
      else if (namaPoli.includes("dalam")) hurufPoli = "D";
      else if (namaPoli.includes("kandungan")) hurufPoli = "K";

      const shortCode = `${hurufPoli}-${String(idx + 1).padStart(3, "0")}`;

      return {
        id: b.id_booking,
        kode_antrean: shortCode,
        kode_asli: b.kode_antrean,
        nama_pasien: namaPasien,
        nik: b.pasien?.nik || "-",
        poli: b.poli?.nama_poli || "-",
        dokter: b.dokter?.nama_dokter || "-",
        tanggal_periksa: b.tanggal_pemeriksaan,
        status: b.status,
      };
    });

    return NextResponse.json({ data: formatted }, { status: 200 });
  } catch (error: any) {
    console.error("GET Antrean Resepsionis Error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal memuat antrean" },
      { status: 500 }
    );
  }
}