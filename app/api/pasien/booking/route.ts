import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

function hitungTanggalPemeriksaan(hariTarget: string): Date {
  const hariMap: Record<string, number> = {
    minggu: 0,
    senin: 1,
    selasa: 2,
    rabu: 3,
    kamis: 4,
    jumat: 5,
    sabtu: 6,
  };

  const today = new Date();
  const currentDay = today.getDay();
  const targetDay = hariMap[hariTarget.toLowerCase().trim()] ?? currentDay;

  let diff = targetDay - currentDay;
  if (diff <= 0) {
    diff += 7;
  }

  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  result.setHours(8, 30, 0, 0);
  return result;
}


export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const idPasienCookie = cookieStore.get("id_pasien")?.value;
    const idAkunCookie = cookieStore.get("id_akun")?.value || cookieStore.get("user_id")?.value;

    const body = await request.json();
    const { id_poli, id_dokter, id_jadwal, id_pasien: idPasienBody, id_akun: idAkunBody } = body;

    if (!id_poli || !id_dokter || !id_jadwal) {
      return NextResponse.json(
        { message: "Poli, Dokter, dan Jadwal wajib dipilih!" },
        { status: 400 }
      );
    }

    const targetIdPasien = idPasienBody || idPasienCookie;
    const targetIdAkun = idAkunBody || idAkunCookie;

    let pasienLogin = null;

    if (targetIdPasien) {
      pasienLogin = await prisma.pasien.findUnique({
        where: { id_pasien: targetIdPasien },
      });
    }

    if (!pasienLogin && targetIdAkun) {
      pasienLogin = await prisma.pasien.findFirst({
        where: { id_akun: targetIdAkun },
      });
    }

    if (!pasienLogin) {
      return NextResponse.json(
        { message: "Sesi pasien tidak sah atau belum login. Silakan login kembali!" },
        { status: 401 }
      );
    }

    const jadwalData = await prisma.jadwal_dokter.findUnique({
      where: { id_jadwal: String(id_jadwal) },
    });
    const hariJadwal = jadwalData?.hari || "Senin";
    const tglPeriksa = hitungTanggalPemeriksaan(hariJadwal);

    const newIdBooking = `BKG${Date.now().toString().slice(-6)}`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const kodeAntrean = `ANT-${id_poli}-${randomSuffix}`;

    const bookingBaru = await prisma.booking.create({
      data: {
        id_booking: newIdBooking,
        id_pasien: pasienLogin.id_pasien,
        id_poli: String(id_poli),
        id_dokter: String(id_dokter),
        id_jadwal: String(id_jadwal),
        kode_antrean: kodeAntrean,
        tanggal_booking: new Date(),
        tanggal_pemeriksaan: tglPeriksa,
        status: "Menunggu",
      },
      include: {
        pasien: true,
      },
    });

    return NextResponse.json({
      message: "Booking berhasil dibuat!",
      data: bookingBaru,
    });
  } catch (err: any) {
    console.error("Booking POST Error:", err);
    return NextResponse.json(
      { message: err?.message || "Gagal membuat booking" },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_booking, id_poli, id_dokter, id_jadwal } = body;

    if (!id_booking) {
      return NextResponse.json(
        { message: "ID Booking wajib disertakan untuk mode edit!" },
        { status: 400 }
      );
    }

    if (!id_poli || !id_dokter || !id_jadwal) {
      return NextResponse.json(
        { message: "Poli, Dokter, dan Jadwal wajib dipilih!" },
        { status: 400 }
      );
    }

   
    const bookingExisting = await prisma.booking.findUnique({
      where: { id_booking: String(id_booking) },
    });

    if (!bookingExisting) {
      return NextResponse.json(
        { message: "Data booking tidak ditemukan!" },
        { status: 404 }
      );
    }

    
    const jadwalData = await prisma.jadwal_dokter.findUnique({
      where: { id_jadwal: String(id_jadwal) },
    });
    const hariJadwal = jadwalData?.hari || "Senin";
    const tglPeriksaBaru = hitungTanggalPemeriksaan(hariJadwal);

    
    const updatedBooking = await prisma.booking.update({
      where: { id_booking: String(id_booking) },
      data: {
        id_poli: String(id_poli),
        id_dokter: String(id_dokter),
        id_jadwal: String(id_jadwal),
        tanggal_pemeriksaan: tglPeriksaBaru,
        status: "Menunggu", // Kembalikan ke Menunggu Konfirmasi setelah diubah
      },
      include: {
        pasien: true,
        poli: true,
        dokter: true,
        jadwal: true,
      },
    });

    return NextResponse.json({
      message: "Jadwal booking berhasil diperbarui!",
      data: updatedBooking,
    });
  } catch (err: any) {
    console.error("Booking PUT Error:", err);
    return NextResponse.json(
      { message: err?.message || "Gagal memperbarui jadwal booking" },
      { status: 500 }
    );
  }
}