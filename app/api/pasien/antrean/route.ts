import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const idAkun = cookieStore.get("user_id")?.value;

    // Cari data pasien berdasarkan sesi akun yang login
    const dataPasien = idAkun
      ? await prisma.pasien.findFirst({ where: { id_akun: idAkun } })
      : null;

    // Ambil booking aktif yang statusnya bukan 'Dibatalkan'
    const antreanList = await prisma.booking.findMany({
      where: {
        ...(dataPasien ? { id_pasien: dataPasien.id_pasien } : {}),
        status: {
          not: "Dibatalkan",
        },
      },
      include: {
        pasien: true,
        poli: true,
        dokter: true,
        jadwal: true,
      },
      orderBy: {
        tanggal_pemeriksaan: "asc",
      },
    });

    return NextResponse.json({ data: antreanList }, { status: 200 });
  } catch (error: any) {
    console.error("GET Antrean Error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal memuat tiket antrean" },
      { status: 500 }
    );
  }
}