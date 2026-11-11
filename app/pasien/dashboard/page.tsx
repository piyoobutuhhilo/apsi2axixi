"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPasienPage() {
  const router = useRouter();
  const [namaPasien, setNamaPasien] = useState("Pasien");

  useEffect(() => {
    const user = localStorage.getItem("user_puskesmas");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.nama) setNamaPasien(parsed.nama);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("user_puskesmas");
      router.push("/pasien/login");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#b8dcd0] via-[#528f72] to-[#1e533d] text-gray-900 overflow-hidden flex flex-col font-sans select-none">
      {}
      <div className="absolute -top-36 -right-36 w-[560px] h-[560px] rounded-full bg-[#27664c]/40 pointer-events-none" />
      <div className="absolute top-12 -right-24 w-[430px] h-[430px] rounded-full bg-[#1b4e39]/50 pointer-events-none" />

      {}
      <header className="relative z-10 w-full px-8 pt-6 pb-2 flex justify-between items-start">
        {}
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 bg-[#1f5c43] rounded-2xl flex items-center justify-center text-white shadow-md">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 7h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V9c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
            Puskesmas Pauh
          </h1>
        </div>

        {}
        <div className="flex flex-col space-y-2 items-end">
          {}
          <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-md border border-white/40 px-5 py-2 rounded-full shadow-sm">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1f5c43] shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="text-left text-white leading-tight">
              <p className="font-bold text-sm">Profil Pasien</p>
              <p className="text-xs text-emerald-100">Halo, {namaPasien}</p>
            </div>
          </div>

          {}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 px-5 py-2 rounded-full text-white font-bold text-sm shadow-sm transition cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-white text-[#1f5c43] flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-6 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-2 gap-6 w-full mb-6">
          {}
          <button
            onClick={() => router.push("/pasien/jadwal-poli")}
            className="bg-[#528f72] hover:bg-[#467c63] transition shadow-md hover:shadow-lg rounded-3xl py-7 px-4 flex flex-col items-center justify-center gap-3 border border-emerald-600/30 cursor-pointer"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#1f5c43] shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-black">Lihat Jadwal Poli</span>
          </button>

          {}
          <button
            onClick={() => router.push("/pasien/cetak-antrean")}
            className="bg-white hover:bg-slate-50 transition shadow-md hover:shadow-lg rounded-3xl py-7 px-4 flex flex-col items-center justify-center gap-3 border border-slate-100 cursor-pointer"
          >
            <div className="w-14 h-14 bg-[#528f72] rounded-2xl flex items-center justify-center text-white shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-black">Cetak Kode Antrean</span>
          </button>

          {}
          <button
            onClick={() => router.push("/pasien/booking")}
            className="bg-white hover:bg-slate-50 transition shadow-md hover:shadow-lg rounded-3xl py-7 px-4 flex flex-col items-center justify-center gap-3 border border-slate-100 cursor-pointer"
          >
            <div className="w-14 h-14 bg-[#528f72] rounded-2xl flex items-center justify-center text-white shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-[#1e293b]">Booking Jadwal</span>
          </button>

          {}
          <button
            onClick={() => router.push("/pasien/resep-obat")}
            className="bg-[#528f72] hover:bg-[#467c63] transition shadow-md hover:shadow-lg rounded-3xl py-7 px-4 flex flex-col items-center justify-center gap-3 border border-emerald-600/30 cursor-pointer"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#1f5c43] shadow-sm">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="9" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="15" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <path stroke="currentColor" strokeWidth="2" d="M9 13l6-2" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-black">Lihat Resep Obat</span>
          </button>

          {}
          <button
            onClick={() => router.push("/pasien/booking/riwayat")}
            className="bg-[#528f72] hover:bg-[#467c63] transition shadow-md hover:shadow-lg rounded-3xl py-7 px-4 flex flex-col items-center justify-center gap-3 border border-emerald-600/30 cursor-pointer"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#1f5c43] shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-black">Riwayat Booking</span>
          </button>

          {}
          <button
            onClick={() => router.push("/pasien/pembayaran-obat")}
            className="bg-white hover:bg-slate-50 transition shadow-md hover:shadow-lg rounded-3xl py-7 px-4 flex flex-col items-center justify-center gap-3 border border-slate-100 cursor-pointer"
          >
            <div className="w-14 h-14 bg-[#528f72] rounded-2xl flex items-center justify-center text-white shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10m-3-7h4.5a1.5 1.5 0 010 3H10.5a1.5 1.5 0 000 3H15" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-black">Pembayaran Obat</span>
          </button>
        </div>

        {}
        <button
          onClick={() => router.push("/pasien/rekam-medis")}
          className="w-full bg-[#528f72] hover:bg-[#467c63] transition shadow-md hover:shadow-lg rounded-3xl py-4 px-8 flex items-center justify-center space-x-6 border border-emerald-600/30 cursor-pointer"
        >
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1f5c43] shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span className="font-extrabold text-xl text-black">Rekam Medis Elektrik</span>
        </button>
      </main>
    </div>
  );
}