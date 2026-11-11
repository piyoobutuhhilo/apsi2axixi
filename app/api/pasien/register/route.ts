import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      username,
      password,
      nama_pasien,
      nik,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      no_telepon,
    } = body;

    
    if (!username || !password || !nama_pasien || !nik) {
      return NextResponse.json(
        { message: "Username, Password, Nama Lengkap, dan NIK wajib diisi!" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanNik = String(nik).trim();

    
    const existingAkun = await prisma.akun.findUnique({
      where: { username: cleanUsername },
    });
    if (existingAkun) {
      return NextResponse.json(
        { message: "Username sudah digunakan, silakan gunakan username lain!" },
        { status: 400 }
      );
    }

    const existingNik = await prisma.pasien.findUnique({
      where: { nik: cleanNik },
    });
    if (existingNik) {
      return NextResponse.json(
        { message: "NIK ini sudah terdaftar sebagai pasien!" },
        { status: 400 }
      );
    }

    
    let parsedTanggalLahir: Date = new Date("2000-01-01T00:00:00.000Z");
    if (tanggal_lahir) {
      const d = new Date(tanggal_lahir);
      if (!isNaN(d.getTime())) {
        parsedTanggalLahir = d;
      }
    }

    
    const newIdAkun = `AKN${Date.now().toString().slice(-6)}`;
    const newIdPasien = `PSN${Date.now().toString().slice(-6)}`;

    
    const result = await prisma.$transaction(async (tx) => {
      const createdAkun = await tx.akun.create({
        data: {
          id_akun: newIdAkun,
          username: cleanUsername,
          password: String(password),
          role: "PASIEN",
        },
      });

      const createdPasien = await tx.pasien.create({
        data: {
          id_pasien: newIdPasien,
          nama_pasien: nama_pasien.trim(),
          nik: cleanNik,
          tanggal_lahir: parsedTanggalLahir,
          jenis_kelamin: jenis_kelamin || "Laki-laki",
          alamat: alamat ? alamat.trim() : "-",
          no_telepon: no_telepon ? String(no_telepon).trim() : "-",
          id_akun: createdAkun.id_akun,
        },
      });

      return { akun: createdAkun, pasien: createdPasien };
    });

    return NextResponse.json(
      {
        message: "Registrasi akun pasien berhasil!",
        data: {
          id_akun: result.akun.id_akun,
          username: result.akun.username,
          id_pasien: result.pasien.id_pasien,
          nama_pasien: result.pasien.nama_pasien,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Pasien Error:", error);
    return NextResponse.json(
      { message: error?.message || "Terjadi kesalahan saat registrasi pasien" },
      { status: 500 }
    );
  }
}