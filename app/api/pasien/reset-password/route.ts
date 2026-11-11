import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, passwordBaru } = body;

    if (!identifier || !passwordBaru) {
      return NextResponse.json(
        { message: "Data tidak lengkap!" },
        { status: 400 }
      );
    }

    
    const akun = await prisma.akun.findUnique({
      where: { username: identifier },
    });

    if (!akun) {
      return NextResponse.json(
        { message: "Akun dengan email atau nomor tersebut tidak ditemukan!" },
        { status: 404 }
      );
    }

    
    await prisma.akun.update({
      where: { id_akun: akun.id_akun },
      data: { password: passwordBaru },
    });

    return NextResponse.json({
      message: "Password berhasil diperbarui!",
    });
  } catch (error: any) {
    console.error("ERROR RESET PASSWORD:", error);
    return NextResponse.json(
      { message: `Database Error: ${error?.message || "Gagal memperbarui password"}` },
      { status: 500 }
    );
  }
}