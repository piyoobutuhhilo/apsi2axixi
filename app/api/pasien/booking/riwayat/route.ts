import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// 1. GET: Ambil daftar booking pasien
export async function GET() {
  try {
    const cookieStore = await cookies();
    const idAkun = cookieStore.get("user_id")?.value;

    // Cari data pasien berdasarkan akun yang sedang login
    const dataPasien = idAkun
      ? await prisma.pasien.findFirst({ where: { id_akun: idAkun } })
      : null;

    const bookings = await prisma.booking.findMany({
      where: dataPasien ? { id_pasien: dataPasien.id_pasien } : undefined,
      include: {
        pasien: true,
        poli: true,
        dokter: true,
        jadwal: true,
      },
      orderBy: {
        tanggal_booking: "desc",
      },
    });

    return NextResponse.json({ data: bookings }, { status: 200 });
  } catch (error: any) {
    console.error("GET Riwayat Booking Error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal memuat data riwayat booking" },
      { status: 500 }
    );
  }
}

// 2. DELETE: Hapus / Batalkan booking
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID Booking wajib disertakan!" },
        { status: 400 }
      );
    }

    await prisma.booking.delete({
      where: { id_booking: String(id) },
    });

    return NextResponse.json({ message: "Data booking berhasil dihapus!" });
  } catch (error: any) {
    console.error("DELETE Booking Error:", error);
    return NextResponse.json(
      { message: error?.message || "Gagal menghapus data booking" },
      { status: 500 }
    );
  }
}