"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardResepsionisPage() {
  const router = useRouter();
  const [namaPetugas, setNamaPetugas] = useState("Resepsionis");

  useEffect(() => {
    const user = localStorage.getItem("user_puskesmas");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.nama) setNamaPetugas(parsed.nama);
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
      router.push("/resepsionis/login");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1e5f44] flex items-center justify-center p-3 md:p-6 font-sans select-none overflow-hidden">
      {}
      <div className="relative w-full h-[94vh] max-w-[98vw] rounded-[36px] overflow-hidden shadow-2xl border-4 border-emerald-400/40 bg-[#d8eee5] flex flex-col justify-between p-6 md:p-10">
        
        {}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#3c8266]/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#327057]/50 pointer-events-none" />
        <div className="absolute top-16 right-16 w-48 h-48 rounded-full bg-[#285e48]/30 pointer-events-none" />

        {}
        <div className="relative z-10 w-full flex justify-between items-start">
          {}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1e4a36] text-white rounded-xl flex items-center justify-center font-black text-sm shadow">
              P
            </div>
            <div>
              <h2 className="font-extrabold text-sm md:text-base text-[#153a2a] leading-tight">
                Puskesmas Pauh
              </h2>
              <p className="text-[11px] text-emerald-800 font-semibold">Portal Resepsionis</p>
            </div>
          </div>

          {}
          <div className="flex flex-col items-end space-y-2.5">
            {}
            <div className="flex items-center space-x-3 bg-[#428168]/70 backdrop-blur-md px-5 py-2 rounded-full border border-white/30 text-white shadow-sm">
              <div className="w-6 h-6 rounded-full bg-white text-[#23533e] flex items-center justify-center font-bold text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="text-left leading-tight">
                <p className="font-bold text-xs">Akun Resepsionis</p>
                <p className="text-[10px] text-emerald-100">Halo, {namaPetugas}</p>
              </div>
            </div>

            {}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/70 hover:bg-white text-slate-800 px-4 py-1.5 rounded-full border border-slate-300 text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-[#23533e] text-white flex items-center justify-center text-[10px]">
                ‹
              </div>
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {}
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-5 my-auto">
          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            
            {}
            <div
              onClick={() => router.push("/resepsionis/kelola-booking")}
              className="bg-[#427a63] hover:bg-[#386b56] transition-all duration-200 cursor-pointer rounded-3xl p-6 shadow-md flex flex-col items-center justify-between min-h-[190px] border border-white/20 hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center gap-2 mt-2">
                <div className="w-14 h-14 bg-white/95 rounded-2xl flex items-center justify-center text-[#23533e] shadow-sm">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-white text-xs font-serif font-semibold mt-1">
                  Lihat Pasien Mendaftar
                </p>
              </div>

              <div className="w-full bg-white text-[#1e4a36] font-bold text-sm py-2 rounded-2xl text-center shadow-sm">
                Kelola Booking
              </div>
            </div>

            {}
            <div
              onClick={() => router.push("/resepsionis/jadwal")}
              className="bg-[#8ec2aa] hover:bg-[#7cb39a] transition-all duration-200 cursor-pointer rounded-3xl p-6 shadow-md flex flex-col items-center justify-between min-h-[190px] border border-white/30 hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center gap-2 mt-2">
                <div className="w-14 h-14 bg-[#427a63]/20 rounded-2xl flex items-center justify-center text-[#1e4a36]">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 16l2 2 4-4" />
                  </svg>
                </div>
                <p className="text-[#153a2a] text-xs font-serif font-semibold mt-1">
                  Atur Jadwal Dokter dan Pasien
                </p>
              </div>

              <div className="w-full bg-white text-[#1e4a36] font-bold text-sm py-2 rounded-2xl text-center shadow-sm">
                Jadwal Dokter & Pasien
              </div>
            </div>

            {}
            <div
              onClick={() => router.push("/resepsionis/kelola-kunjungan")}
              className="bg-[#1b4332] hover:bg-[#143627] transition-all duration-200 cursor-pointer rounded-3xl p-6 shadow-md flex flex-col items-center justify-between min-h-[190px] border border-emerald-950/40 hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center gap-2 mt-2">
                <div className="w-14 h-14 bg-[#396954]/50 rounded-2xl flex items-center justify-center text-emerald-200 border border-emerald-300/30">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    <rect x="4" y="3" width="16" height="18" rx="3" strokeWidth="1.8" />
                  </svg>
                </div>
                <p className="text-white text-xs font-serif font-semibold mt-1">
                  Cek Kode Antrian
                </p>
              </div>

              <div className="w-full bg-white text-[#1b4332] font-bold text-sm py-2 rounded-2xl text-center shadow-sm">
                Kelola Kunjungan
              </div>
            </div>

            {}
            <div
              onClick={() => router.push("/resepsionis/rme-pasien")}
              className="bg-[#8ec2aa] hover:bg-[#7cb39a] transition-all duration-200 cursor-pointer rounded-3xl p-6 shadow-md flex flex-col items-center justify-between min-h-[190px] border border-white/30 hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center gap-2 mt-2">
                <div className="w-14 h-14 bg-[#427a63]/20 rounded-2xl flex items-center justify-center text-[#1e4a36]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <p className="text-[#153a2a] text-xs font-serif font-semibold mt-1">
                  Rekam Medis Elektronik
                </p>
              </div>

              <div className="w-full bg-white text-[#1e4a36] font-bold text-sm py-2 rounded-2xl text-center shadow-sm">
                Kelola RME Pasien
              </div>
            </div>

          </div>

          {}
          <button
            onClick={() => router.push("/resepsionis/data-pasien")}
            className="w-full bg-[#8ec2aa] hover:bg-[#7cb39a] active:scale-[0.99] transition-all duration-200 rounded-3xl py-4 px-8 flex items-center space-x-4 border border-white/30 shadow-md cursor-pointer text-left"
          >
            <div className="w-11 h-11 bg-white/40 rounded-xl flex items-center justify-center text-[#153a2a]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="font-extrabold text-base md:text-lg text-[#153a2a] underline tracking-wide">
              Kelola Data Pasien
            </span>
          </button>
        </div>

        {}
        <div className="h-2" />
      </div>
    </div>
  );
}