import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const poliFilter = searchParams.get("poli");
    const statusFilter = searchParams.get("status");

    const whereClause: any = {};
    if (poliFilter && poliFilter !== "ALL") {
      whereClause.id_poli = poliFilter;
    }
    if (statusFilter && statusFilter !== "ALL") {
      whereClause.status = statusFilter;
    }

    const daftarBooking = await prisma.booking.findMany({
      where: whereClause,
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

    return NextResponse.json({ data: daftarBooking }, { status: 200 });
  } catch (error: any) {
    console.error("GET Resepsionis Booking Error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal memuat data booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id_booking, status } = body;

    if (!id_booking || !status) {
      return NextResponse.json(
        { message: "ID Booking dan status baru wajib disertakan!" },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id_booking: String(id_booking) },
      data: { status: String(status) },
    });

    return NextResponse.json({
      message: `Status booking berhasil diubah menjadi ${status}!`,
      data: updated,
    });
  } catch (error: any) {
    console.error("PATCH Booking Status Error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal memperbarui status booking" },
      { status: 500 }
    );
  }
}