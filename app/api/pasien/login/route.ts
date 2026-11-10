import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan kata sandi wajib diisi!" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    // 1. Cari akun dan relasi profil pasiennya
    const akun = await prisma.akun.findUnique({
      where: { username: cleanUsername },
      include: { pasien: true },
    });

    if (!akun || akun.password !== password) {
      return NextResponse.json(
        { message: "Username atau kata sandi keliru!" },
        { status: 401 }
      );
    }

    // 2. Jika akun terdaftar belum memiliki baris profil di tabel pasien, buatkan otomatis
    let pasien = akun.pasien;
    if (!pasien && akun.role === "PASIEN") {
      const namaTampil = cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);
      pasien = await prisma.pasien.create({
        data: {
          id_pasien: `PSN${Date.now().toString().slice(-6)}`,
          nama_pasien: namaTampil,
          nik: `1371${Date.now().toString().slice(-12)}`,
          tanggal_lahir: new Date("2000-01-01"),
          jenis_kelamin: "Laki-laki",
          alamat: "Kecamatan Pauh, Padang",
          no_telepon: "081234567890",
          id_akun: akun.id_akun,
        },
      });
    }

    // 3. Pasang Cookie Sesi Server
    const cookieStore = await cookies();
    const cookieConfig = {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      httpOnly: false,
      sameSite: "lax" as const,
    };

    cookieStore.set("id_akun", akun.id_akun, cookieConfig);
    cookieStore.set("user_id", akun.id_akun, cookieConfig);
    if (pasien) {
      cookieStore.set("id_pasien", pasien.id_pasien, cookieConfig);
      cookieStore.set("user_name", pasien.nama_pasien, cookieConfig);
    }

    return NextResponse.json({
      message: "Login sukses!",
      user: {
        id_akun: akun.id_akun,
        id_pasien: pasien ? pasien.id_pasien : "",
        username: akun.username,
        nama: pasien ? pasien.nama_pasien : akun.username,
        role: akun.role,
      },
    });
  } catch (err: any) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { message: err?.message || "Gagal melakukan login" },
      { status: 500 }
    );
  }
}