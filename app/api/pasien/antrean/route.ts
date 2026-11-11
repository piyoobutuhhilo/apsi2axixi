import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    
    const url = new URL(request.url);
    
    const cookieStore = await cookies();
    const idAkun = cookieStore.get("user_id")?.value;

    
    const dataPasien = idAkun
      ? await prisma.pasien.findFirst({ where: { id_akun: idAkun } })
      : null;

    
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