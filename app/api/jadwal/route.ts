import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";




export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const poliParam = searchParams.get("poli") || "";
    const cleaned = poliParam.replace(/-/g, " ").trim();

    const data = await prisma.jadwal_dokter.findMany({
      where: poliParam
        ? {
            poli: {
              is: {
                OR: [
                  { nama_poli: { contains: cleaned, mode: "insensitive" } },
                  { id_poli: { contains: poliParam, mode: "insensitive" } },
                ],
              },
            },
          }
        : undefined,
      include: {
        dokter: true,
        poli: true,
      },
      orderBy: { id_jadwal: "asc" },
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    console.error("GET Jadwal Error:", err);
    return NextResponse.json({ message: "Gagal memuat jadwal" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_dokter, id_poli, hari, jam_mulai, jam_selesai, jam } = body;

    let mulai = jam_mulai || "08:00:00";
    let selesai = jam_selesai || "17:00:00";

    if (jam && typeof jam === "string") {
      const parts = jam.split("-");
      if (parts.length >= 2) {
        mulai = parts[0].trim().replace(".", ":") + ":00";
        selesai = parts[1].split(" ")[0].trim().replace(".", ":") + ":00";
      }
    }

   
    if (mulai.length === 5) mulai += ":00";
    if (selesai.length === 5) selesai += ":00";

    const newId = `JDW${Date.now().toString().slice(-6)}`;

    const created = await prisma.jadwal_dokter.create({
      data: {
        id_jadwal: newId,
        id_dokter: id_dokter,
        id_poli: id_poli,
        hari: hari,
        jam_mulai: new Date(`1970-01-01T${mulai}Z`),
        jam_selesai: new Date(`1970-01-01T${selesai}Z`),
        status_jadwal: "Aktif",
      },
    });

    return NextResponse.json({ message: "Jadwal berhasil disimpan!", data: created });
  } catch (err: any) {
    console.error("POST Jadwal Error:", err);
    return NextResponse.json({ message: err?.message || "Gagal menambah jadwal" }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_jadwal, jam_mulai, jam_selesai, jam } = body;

    if (!id_jadwal) {
      return NextResponse.json({ message: "ID Jadwal wajib disertakan!" }, { status: 400 });
    }

    let mulai = jam_mulai || "08:00:00";
    let selesai = jam_selesai || "17:00:00";

    if (jam && typeof jam === "string") {
      const parts = jam.split("-");
      if (parts.length >= 2) {
        mulai = parts[0].trim().replace(".", ":") + ":00";
        selesai = parts[1].split(" ")[0].trim().replace(".", ":") + ":00";
      }
    }

    if (mulai.length === 5) mulai += ":00";
    if (selesai.length === 5) selesai += ":00";

    const updated = await prisma.jadwal_dokter.update({
      where: { id_jadwal: String(id_jadwal) },
      data: {
        jam_mulai: new Date(`1970-01-01T${mulai}Z`),
        jam_selesai: new Date(`1970-01-01T${selesai}Z`),
      },
    });

    return NextResponse.json({ message: "Jadwal berhasil diperbarui!", data: updated });
  } catch (err: any) {
    console.error("PUT Jadwal Error:", err);
    return NextResponse.json({ message: err?.message || "Gagal memperbarui jadwal" }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID jadwal wajib ada" }, { status: 400 });
    }

    await prisma.jadwal_dokter.delete({
      where: { id_jadwal: String(id) },
    });

    return NextResponse.json({ message: "Jadwal berhasil dihapus!" });
  } catch (err: any) {
    console.error("DELETE Jadwal Error:", err);
    return NextResponse.json({ message: err?.message || "Gagal menghapus jadwal" }, { status: 500 });
  }
}