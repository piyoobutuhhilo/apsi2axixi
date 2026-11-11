import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier =
      body.username ||
      body.email ||
      body.idResepsionis ||
      body.identifier;
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "ID Resepsionis/Email dan Password wajib diisi!" },
        { status: 400 }
      );
    }

    
    const akun = await prisma.akun.findFirst({
      where: {
        username: {
          equals: String(identifier).trim(),
          mode: "insensitive",
        },
      },
    });

    if (!akun || akun.password !== password) {
      return NextResponse.json(
        { message: "ID Resepsionis atau Password salah!" },
        { status: 401 }
      );
    }

    
    const role = (akun.role || "").toUpperCase();
    if (role !== "RESEPSIONIS") {
      return NextResponse.json(
        {
          message: `Akun ini terdaftar sebagai ${role || "bukan Resepsionis"}. Akses ditolak!`,
        },
        { status: 403 }
      );
    }

    
    const response = NextResponse.json({
      message: "Login Resepsionis Berhasil!",
      resepsionis: {
        id_akun: akun.id_akun,
        username: akun.username,
        nama: akun.username.split("@")[0],
        role: "RESEPSIONIS",
      },
      redirectTo: "/resepsionis/dashboard",
    });

    
    response.cookies.set("user_role", "RESEPSIONIS", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 hari
    });

    response.cookies.set("user_id", akun.id_akun, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    console.error("ERROR LOGIN RESEPSIONIS:", error);
    return NextResponse.json(
      { message: `Database Error: ${error?.message || "Gagal memproses login"}` },
      { status: 500 }
    );
  }
}