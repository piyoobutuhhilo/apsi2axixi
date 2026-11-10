"use client";

import { useRouter } from "next/navigation";

export default function MenuBookingPasienPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full bg-[#20674f] text-gray-800 overflow-hidden flex flex-col font-sans select-none p-5 md:p-8">
      {/* Ornamen Lingkaran Khas Tema Puskesmas */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-16 -left-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-48 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      {/* Tombol Kembali di Kiri Atas */}
      <div className="relative z-10 w-full mb-4">
        <button
          onClick={() => router.push("/pasien/dashboard")}
          className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full border border-white/30 shadow-md transition cursor-pointer backdrop-blur-sm"
        >
          <div className="w-5 h-5 rounded-full bg-white text-[#20674f] flex items-center justify-center font-bold text-xs">
            ‹
          </div>
          <span>Kembali ke Dashboard</span>
        </button>
      </div>

      {/* Tab Header Nama Menu */}
      <div className="relative z-10 w-full mb-4">
        <div className="w-full bg-[#3ea870] text-white font-bold text-sm md:text-base py-3.5 px-8 rounded-full shadow-lg border-b-4 border-[#1e4a36] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">📅</span>
            <span>Layanan Booking Jadwal Poli Pasien</span>
          </div>
          <span className="hidden md:inline-block text-xs bg-white/20 px-3 py-1 rounded-full text-emerald-100 font-medium">
            Puskesmas Pauh
          </span>
        </div>
      </div>

      {/* Kontainer Utama dengan Gaya Panel Halus */}
      <div className="relative z-10 w-full flex-1 bg-[#d5dde2] rounded-[32px] p-6 md:p-12 shadow-2xl flex flex-col justify-center items-center">
        <div className="text-center max-w-lg mb-8">
          <h2 className="text-xl md:text-2xl font-black text-[#1b4332] tracking-tight">
            Pilih Layanan Pendaftaran
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mt-1.5 font-medium">
            Daftarkan diri Anda sebelum berkunjung atau sesuaikan jadwal pemeriksaan poli yang telah dibuat sebelumnya.
          </p>
        </div>

        {/* Grid 2 Pilihan Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-3xl">
          {/* Pilihan 1: Buat Booking Baru */}
          <div
            onClick={() => router.push("/pasien/booking/baru")}
            className="group relative bg-white hover:bg-emerald-50/50 rounded-3xl p-7 md:p-8 shadow-md hover:shadow-xl border-2 border-emerald-600/30 hover:border-emerald-600 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Dekorasi Aksen Warna */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#82cfa5]/20 rounded-bl-[80px] pointer-events-none group-hover:scale-110 transition-transform" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#23533e] text-white flex items-center justify-center text-2xl shadow-md mb-5 group-hover:scale-105 transition-transform">
                📝
              </div>
              <div className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                Pendaftaran Baru
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-[#23533e] transition-colors">
                Buat Booking Baru
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Pilih poli tujuan, dokter yang bertugas, serta tentukan tanggal kedatangan untuk mendapatkan nomor antrean online.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#23533e]">
              <span>Mulai Pendaftaran</span>
              <span className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>

          {/* Pilihan 2: Edit / Cek Booking */}
          <div
            onClick={() => router.push("/pasien/booking/riwayat")}
            className="group relative bg-white hover:bg-slate-50 rounded-3xl p-7 md:p-8 shadow-md hover:shadow-xl border-2 border-slate-300 hover:border-[#3ea870] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Dekorasi Aksen Warna */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-slate-200/50 rounded-bl-[80px] pointer-events-none group-hover:scale-110 transition-transform" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#4a6b5d] text-white flex items-center justify-center text-2xl shadow-md mb-5 group-hover:scale-105 transition-transform">
                🎫
              </div>
              <div className="inline-block bg-slate-100 text-slate-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                Kelola Tiket
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-[#23533e] transition-colors">
                Edit & Riwayat Booking
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Lihat bukti nomor antrean, ubah waktu kunjungan, atau batalkan pendaftaran jadwal poli yang sedang aktif.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#23533e]">
              <span>Buka Data Booking</span>
              <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>
        </div>

        {/* Catatan Bantuan Bawah */}
        <div className="mt-8 text-center text-[11px] text-slate-500">
          💡 <span className="font-semibold">Informasi:</span> Jam operasional loket konfirmasi poli Puskesmas Pauh dimulai pukul 08.00 WIB.
        </div>
      </div>
    </div>
  );
}