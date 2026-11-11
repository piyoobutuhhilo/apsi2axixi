import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    
    const poliList = await prisma.poli.findMany({
      where: { status_poli: "Aktif" },
      include: {
        jadwal_dokter: {
          where: { status_jadwal: "Aktif" },
          include: {
            dokter: true,
          },
        },
      },
      orderBy: { id_poli: "asc" },
    });

   
    const formatted = poliList.map((p) => {
      
      const dokterMap = new Map<string, any>();

      p.jadwal_dokter.forEach((j) => {
        if (!dokterMap.has(j.id_dokter)) {
          dokterMap.set(j.id_dokter, {
            id_dokter: j.dokter.id_dokter,
            nama_dokter: j.dokter.nama_dokter,
            jadwal: [],
          });
        }

        
        const mulai = j.jam_mulai.toISOString().split("T")[1]?.slice(0, 5).replace(":", ".") || "08.00";
        const selesai = j.jam_selesai.toISOString().split("T")[1]?.slice(0, 5).replace(":", ".") || "17.00";

        dokterMap.get(j.id_dokter).jadwal.push({
          id_jadwal: j.id_jadwal,
          hari: j.hari,
          jam: `${mulai} - ${selesai}`,
          label: `${j.hari} (${mulai} - ${selesai})`,
        });
      });

      return {
        id_poli: p.id_poli,
        nama_poli: p.nama_poli,
        daftar_dokter: Array.from(dokterMap.values()),
      };
    });

    return NextResponse.json({ data: formatted }, { status: 200 });
  } catch (error: any) {
    console.error("Error booking options:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal memuat opsi booking" },
      { status: 500 }
    );
  }
}